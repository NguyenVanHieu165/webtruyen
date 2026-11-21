import "server-only";

import { cache } from "react";

import { fixtureCatalogRepository } from "./fixture-repository.server.ts";
import { createCatalogService } from "./service.ts";

export const catalogService = createCatalogService({
  listStories: cache(() => fixtureCatalogRepository.listStories()),
  listCategories: cache(() => fixtureCatalogRepository.listCategories()),
});
