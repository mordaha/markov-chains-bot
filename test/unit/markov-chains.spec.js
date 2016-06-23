import 'babel-polyfill';
import { expect, assert } from 'chai';
import sinon from 'sinon';
import { testAsync, returnValuesAsync } from '../common';

import { MarkovChainsService } from '../../src/markovs/markov-chains-service';

function prepareKV(sss) {
  const kv = { get: () => {} };
  const dicts = sss
    .split(' ')
    .map((x) => {
      const dict = {};
      dict[x] = 1;
      return dict;
    });
  sinon.stub(kv, 'get', returnValuesAsync(dicts));
  return kv;
}

describe('MarkovChainsService tests addWords', () => {
  it('addWords tests', () => {
    const markovs = new MarkovChainsService({}, 'test');
    const spyAddChain = sinon.spy(markovs, '_addChain');

    markovs.addWords(['aa', 'bb', 'cc', 'dd', 'ee']);

    expect(spyAddChain.callCount).equal(11);

    assert.ok(spyAddChain.calledWith('test:aa', 'bb'));

    assert.ok(spyAddChain.calledWith('test:aa:bb', 'cc'));
    assert.ok(spyAddChain.calledWith('test:bb', 'cc'));

    assert.ok(spyAddChain.calledWith('test:cc', 'dd'));
    assert.ok(spyAddChain.calledWith('test:cc', 'dd'));
    assert.ok(spyAddChain.calledWith('test:bb:cc', 'dd'));
    assert.ok(spyAddChain.calledWith('test:aa:bb:cc', 'dd'));

    assert.ok(spyAddChain.calledWith('test:first_words', 'aa'));
  });

  it('addWords tests add pair', () => {
    const markovs = new MarkovChainsService({}, 'test');
    const spyAddChain = sinon.spy(markovs, '_addChain');

    markovs.addWords(['aa', 'bb']);

    expect(spyAddChain.callCount).equal(2);

    assert.ok(spyAddChain.calledWith('test:aa', 'bb'));
  });

  it('addWords tests add 0 or 1 words', () => {
    const markovs = new MarkovChainsService({}, 'test');
    const spyAddChain = sinon.spy(markovs, '_addChain');

    markovs.addWords([]);
    expect(spyAddChain.callCount).equal(0);

    markovs.addWords(['aa']);
    expect(spyAddChain.callCount).equal(0);
  });

  it('getWords test empty firstWord to call ._getFirstWord()', testAsync(() => {
    const markovs = new MarkovChainsService({}, 'test');
    const spy = sinon.spy(markovs, '_getFirstWord');

    markovs.getWords();

    expect(spy.callCount).equal(1);
  }));

  it('getWords test maxLength', testAsync(async () => {
    const kv = prepareKV('aa bb bb cc cc cc dd dd dd dd ee ee ee ee ee');
    const markovs = new MarkovChainsService(kv, 'test');
    const words = await markovs.getWords('zz', 5);
    expect(words.length).equal(5);
    expect(words).deep.equal(['zz', 'aa', 'bb', 'cc', 'dd']);
  }));

  it('getWords test loop', testAsync(async () => {
    const dict = {
      'test:zz': { aa: 1 },
      'test:aa': { aa: 1 },
    };
    const kv = {
      get: (key) => {
        if (key in dict) {
          return dict[key];
        }
        return {};
      },
    };
    const markovs = new MarkovChainsService(kv, 'test', Math.random);
    const words = await markovs.getWords('zz', 10);
    expect(words.length).equal(3);
    expect(words).deep.equal(['zz', 'aa', 'aa']);
  }));
});
