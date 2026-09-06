import { storage } from "@/lib/storage";
import type { SavedMedia } from "./types";

const KEY = "watchlist";

export class WatchlistRepository {
  getAll(): SavedMedia[] {
    const items = storage.get<SavedMedia[]>(KEY);
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
    storage.set(KEY, next);
    return next;
  }

  remove(id: number, mediaType: string): SavedMedia[] {
    const next = this.getAll().filter((item) => !(item.id === id && item.mediaType === mediaType));
    storage.set(KEY, next);
    return next;
  }

  clear(): void {
    storage.remove(KEY);
  }

  count(): number {
    return this.getAll().length;
  }
}
