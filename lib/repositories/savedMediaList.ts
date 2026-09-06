// Shared low-level CRUD for user-owned "saved media" lists (Favorites, Watchlist).
// Both lists store the same SavedMedia snapshot shape and only differ by their
// storage key. The domain-specific repositories supply that key while keeping
// the rest of the application isolated from this helper.
import { storage } from "@/lib/storage";
import type { SavedMedia } from "./types";

export abstract class SavedMediaRepository {
  protected constructor(protected readonly key: string) {}

  getAll(): SavedMedia[] {
    const items = storage.get<SavedMedia[]>(this.key);
    return Array.isArray(items) ? items : [];
  }

  has(id: number, mediaType: string): boolean {
    return this.getAll().some((item) => item.id === id && item.mediaType === mediaType);
  }

  add(media: Omit<SavedMedia, "addedAt">): SavedMedia[] {
    const items = this.getAll();
    if (items.some((item) => item.id === media.id && item.mediaType === media.mediaType)) {
      return items;
    }
    const entry: SavedMedia = { ...media, addedAt: Date.now() };
    const next = [entry, ...items];
    storage.set(this.key, next);
    return next;
  }

  remove(id: number, mediaType: string): SavedMedia[] {
    const next = this.getAll().filter((item) => !(item.id === id && item.mediaType === mediaType));
    storage.set(this.key, next);
    return next;
  }

  clear(): void {
    storage.remove(this.key);
  }

  count(): number {
    return this.getAll().length;
  }
}