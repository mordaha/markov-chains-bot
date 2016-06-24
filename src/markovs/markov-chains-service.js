import { AbstractMarkovChainsService } from './abstract-markov-chains-service';

export class MarkovChainsService extends AbstractMarkovChainsService {

  // :: MarkovRepository -> String -> Function -> markovChainsService
  constructor(markovRepository, randomFn = Math.random) {
    super();
    this.mr = markovRepository;
    this.randomFn = randomFn;
  }

  // addWords :: [String]
  addWords(words) {
    const length = words.length;
    for (let j = 1; j < length; j++) {
      for (let i = 0; i < j; i++) {
        // for [a,b,c,d,e] words
        // and j=3
        // it generates [c], [b,c], [a,b,c] chains for word d (words[j])
        const chain = words.slice(j - i - 1, j);
        const word = words[j];
        const key = this.makeKey(...chain);
        this.mr.addChain(key, word);
      }
    }
    if (length > 1) {
      const key = this.makeKey('first_words');
      this.mr.addChain(key, words[0]);
    }
  }

  // getWords :: String -> Int -> [String]
  async getWords(startWord='', maxLength=30) {
    const w1 = startWord || await this.getFirstWord();
    let usedKeys = [];
    let out = [w1];
    while (out.length < maxLength) {
      let nextWords = [];
      for (let i=0; i < out.length; i++) {
        const chain = out.slice(i, out.length);
        const key = this.makeKey(...chain);
        if (usedKeys.indexOf(key) !== -1) {
          continue;
        }
        usedKeys = usedKeys.concat(key);
        const words = await this.mr.getWords(key);
        if (words !== null && words.length) {
          nextWords = nextWords.concat(words);
        }
      }
      if (nextWords.length === 0) {
        break;
      }
      out = out.concat(this.getRandomValueFromArray(nextWords));
    }
    return out;
  }

  // makeKey :: [String] -> String
  makeKey(...args) {
    return args.join(':');
  }

  // getRandomValueFromArray :: [T] -> T -> T
  getRandomValueFromArray(arr) {
    const rnd = this.randomFn();
    const out = arr[Math.floor(rnd * arr.length)];
    return out;
  }

  // getFirstWord :: String
  async getFirstWord() {
    const key = this.makeKey('first_words');
    const words = await this.mr.getWords(key);
    return this.getRandomValueFromArray(words);
  }
}
