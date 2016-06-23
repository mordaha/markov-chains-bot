import { AbstractKVStorage } from './abstract-kv-storage';

export class RedisKVStorage extends AbstractKVStorage {
  // @constructor :: RedisClient -> String -> RedisKVStorage
  constructor(redisClient, prefix='test') {
    super();
    this.prefix = prefix;
    this.redisClient = redisClient;
  }

  // makeKey :: String -> String
  makeKey(key) {
    return `${this.prefix}:${key}`;
  }

  // get :: String -> Promise(T)
  async get(key) {
    const pKey = this.makeKey(key);
    const strJson = await this.redisClient.getAsync(pKey);
    const data = JSON.parse(strJson);
    return data;
  }

  // set :: String -> String -> Promise(?)
  async set(key, value) {
    const pKey = this.makeKey(key);
    const strJson = JSON.stringify(value);
    return await this.redisClient.setAsync(pKey, strJson);
  }

  // for debug purposes only
  async keys(pattern = '*') {
    return await this.redisClient.keysAsync(pattern);
  }
}
