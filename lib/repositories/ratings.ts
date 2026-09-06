import { storage } from "@/lib/storage";
import type { RatingEntry } from "./types";

const KEY = "ratings";

export class RatingsRepository {
  getAll(): RatingEntry[] {
    const items = storage.get<RatingEntry[]>(KEY);
    return Array.isArray(items) ? items : [];
  }

  get(id: number, mediaType: string): RatingEntry | null {
    return this.getAll().find((item) => item.id === id && item.mediaType === mediaType) ?? null;
  }

  getRating(id: number, mediaType: string): number {
    return this.get(id, mediaType)?.rating ?? 0;
  }

  set(
    media: Omit<RatingEntry, "updatedAt">,
  ): RatingEntry[] {
    const items = this.getAll();
    const existing = items.findIndex((item) => item.id === media.id && item.mediaType === media.mediaType);
    const entry: RatingEntry = { ...media, updatedAt: Date.now() };
    if (existing >= 0) {
      items[existing] = entry;
    } else {
      items.unshift(entry);
    }
    storage.set(KEY, items);
    return items;
  }

  remove(id: number, mediaType: string): RatingEntry[] {
    const next = this.getAll().filter((item) => !(item.id === id && item.mediaType === mediaType));
    storage.set(KEY, next);
    return next;
  }

  clear(): void {
    storage.remove(KEY);
  }

  average(): number {
    const items = this.getAll();
    if (items.length === 0) return 0;
    const sum = items.reduce((acc, item) => acc + item.rating, 0);
    return sum / items.length;
  }
}
