import { storage } from "@/lib/storage";
import type { ActivityEntry } from "./types";

const KEY = "activity";
const MAX_ITEMS = 50;

export class ActivityRepository {
  getAll(): ActivityEntry[] {
    const items = storage.get<ActivityEntry[]>(KEY);
    return Array.isArray(items) ? items : [];
  }

  add(entry: ActivityEntry): ActivityEntry[] {
    const items = this.getAll();
    // Avoid duplicate consecutive identical events
    if (items.length > 0 && items[0].type === entry.type && items[0].mediaId === entry.mediaId) {
      items[0] = entry;
    } else {
      items.unshift(entry);
    }
    const next = items.slice(0, MAX_ITEMS);
    storage.set(KEY, next);
    return next;
  }

  clear(): void {
    storage.remove(KEY);
  }

  recent(limit = 10): ActivityEntry[] {
    return this.getAll().slice(0, limit);
  }
}
