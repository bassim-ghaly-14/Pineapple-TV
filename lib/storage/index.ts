// Storage abstraction layer. Replaceable with a backend/database later.

export interface StorageAdapter {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
}

const PREFIX = "pineapple:";

function normalizeKey(key: string): string {
  return key.startsWith(PREFIX) ? key : `${PREFIX}${key}`;
}

export class LocalStorageStorage implements StorageAdapter {
  get<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(normalizeKey(key));
      if (raw == null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(normalizeKey(key), JSON.stringify(value));
    } catch {
      // storage full or unavailable — fail silently
    }
  }

  remove(key: string): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(normalizeKey(key));
  }
}

export const storage = new LocalStorageStorage();
