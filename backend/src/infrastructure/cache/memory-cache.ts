interface CacheRecord<T> {
  value: T;
  expiresAt: number;
}

export class MemoryCache<T> {
  private readonly store = new Map<string, CacheRecord<T>>();

  get(key: string): T | null {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiresAt <= Date.now()) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  set(key: string, value: T, ttlMs: number) {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }
}
