import 'babel-polyfill';
import { expect, assert } from 'chai';
import sinon from 'sinon';
import { testAsync, returnValuesAsync } from '../common';

import { MarkovChainsService } from '../../src/markovs/markov-chains-service';

describe('MarkovChainsService tests addWords', () => {
  const mr = {
    addChain: () => {},
    getWords: async () => {},
  };
  const markovs = new MarkovChainsService(mr);
  const sandbox = sinon.sandbox.create();

  beforeEach(() => {
    sandbox.restore();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('addWords tests', () => {
    const spyAddChain = sandbox.spy(mr, 'addChain');
    markovs.addWords(['aa', 'bb', 'cc', 'dd', 'ee']);

    expect(spyAddChain.callCount).equal(11);
    assert.ok(spyAddChain.calledWith('aa', 'bb'));
    assert.ok(spyAddChain.calledWith('aa:bb', 'cc'));
    assert.ok(spyAddChain.calledWith('bb', 'cc'));
    assert.ok(spyAddChain.calledWith('cc', 'dd'));
    assert.ok(spyAddChain.calledWith('cc', 'dd'));
    assert.ok(spyAddChain.calledWith('bb:cc', 'dd'));
    assert.ok(spyAddChain.calledWith('aa:bb:cc', 'dd'));
    assert.ok(spyAddChain.calledWith('first_words', 'aa'));
  });

  it('addWords tests add pair', () => {
    const spyAddChain = sandbox.spy(mr, 'addChain');
    markovs.addWords(['aa', 'bb']);

    expect(spyAddChain.callCount).equal(2);
    assert.ok(spyAddChain.calledWith('aa', 'bb'));
  });

  it('addWords tests add 0 or 1 words', () => {
    const spyAddChain = sandbox.spy(mr, 'addChain');

    markovs.addWords([]);
    expect(spyAddChain.callCount).equal(0);

    markovs.addWords(['aa']);
    expect(spyAddChain.callCount).equal(0);
  });

  it('getWords test empty firstWord to call .getFirstWord()', testAsync(() => {
    const spy = sandbox.spy(markovs, 'getFirstWord');

    markovs.getWords();

    expect(spy.callCount).equal(1);
  }));

  it('getWords test maxLength', testAsync(async () => {
    const arr = 'aa bb bb cc cc cc dd dd dd dd ee ee ee ee ee'
      .split(' ')
      .map(x => [x]);
    sandbox.stub(mr, 'getWords', returnValuesAsync(arr));
    const words = await markovs.getWords('zz', 5);
    expect(words.length).equal(5);
    expect(words).deep.equal(['zz', 'aa', 'bb', 'cc', 'dd']);
  }));

  it('getWords test loop', testAsync(async () => {
    /**
     * stub emits values like chains:
     * {
     *  'zz': ['aa'],
     *  'zz:aa': [],
     *  'aa': ['aa'],
     *  'aa:aa': [],
     *  'zz:aa:aa': [],
     *  .... : []
     * }
     */
    const arr = 'aa::aa:::::::::::::'
      .split(':')
      .map(x => {
        if (x === '') {
          return [];
        }
        return [x];
      });
    sandbox.stub(mr, 'getWords', returnValuesAsync(arr));

    const words = await markovs.getWords('zz', 5);
    expect(words.length).equal(3);
    expect(words).deep.equal(['zz', 'aa', 'aa']);
  }));

  it('getRandomValueFromArray returns random value from array', testAsync(async () => {
    // stub randomFn to value 0.6
    sandbox.stub(markovs, 'randomFn').returns(0.6);
    // stub first return of mr.getWords() to return ['aa', 'bb', 'cc', 'dd', 'ee'],
    // so getRandomWords with random()==0.6 will choose 'dd'
    const arr = [
      ['aa', 'bb', 'cc', 'dd', 'ee'],
      [],
      [],
      [],
      [],
    ];
    sandbox.stub(mr, 'getWords', returnValuesAsync(arr));

    const words = await markovs.getWords('zz', 5);
    expect(words.length).equal(2);
    expect(words).deep.equal(['zz', 'dd']);
  }));
});
