import "server-only";

import {
  authorFixtures,
  categoryFixtures,
  storyFixtures,
} from "./fixtures.ts";
import type { CatalogRepository } from "./repository.ts";
import { joinStoryRelations } from "./repository.ts";

export const fixtureCatalogRepository: CatalogRepository = {
  async listStories() {
    return storyFixtures.map((story) =>
      joinStoryRelations(story, authorFixtures, categoryFixtures),
    );
  },

  async listCategories() {
    return categoryFixtures;
  },
};
