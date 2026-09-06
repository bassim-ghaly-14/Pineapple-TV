import { SavedMediaRepository } from "./savedMediaList";

export class WatchlistRepository extends SavedMediaRepository {
  constructor() {
    super("watchlist");
  }
}
