export class MarkovRepository {
  constructor(kv) {
    this.kv = kv;
  }

  async getWords(key) {
    const dict = await this.kv.get(key) || {};
    return Object.keys(dict);
  }

  async addChain(key, word) {
    const dict = await this.kv.get(key) || {};
    dict[word] = this.getTimestamp();
    this.kv.set(key, dict);
  }

  getTimestamp() {
    return new Date().getTime();
  }
}
