import { SavedMediaRepository } from "./savedMediaList";

export class FavoritesRepository extends SavedMediaRepository {
  constructor() {
    super("favorites");
  }
}
