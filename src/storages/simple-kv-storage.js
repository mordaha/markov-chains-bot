import { AbstractKVStorage } from './abstract-kv-storage';

export class SimpleKeyValueStorage extends AbstractKVStorage {
  // @constructor :: SimpleKeyValueStorage
  constructor() {
    super();
    this.dict = {};
  }

  // get :: String -> Promise(T)
  async get(key) {
    return this.dict[key] || null;
  }

  // set :: String -> T -> Promise(null)
  async set(key, value) {
    this.dict[key] = value;
    return null;
  }
}
