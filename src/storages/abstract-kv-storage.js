export class AbstractKVStorage {
  // get :: String -> Promise(T)
  async get(key) {} // eslint-disable-line

  // set :: String -> T -> Promise
  async set(key, value) {} // eslint-disable-line
}
