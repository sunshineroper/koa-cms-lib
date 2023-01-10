import { get, has, set } from 'lodash'
export class Config {
  private store = {}
  init(config: Record<string, any>) {
    this.store = config
  }

  getItem(key, val?) {
    return get(this.store, key, val)
  }

  setItem(key, val) {
    return set(this.store, key, val)
  }

  hasItem(key) {
    return has(this.store, key)
  }
}

export const config = new Config()
