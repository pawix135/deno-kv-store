export class KVStore {
  private store: Map<string, unknown>;

  constructor() {
    this.store = new Map();
  }

  set(key: string, value: unknown) {
    this.store.set(key, value);
  }

  get(key: string) {
    return this.store.get(key);
  }

  delete(key: string) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }

  has(key: string) {
    return this.store.has(key);
  }

  get size() {
    return this.store.size;
  }
}
