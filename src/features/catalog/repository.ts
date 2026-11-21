import type { Author, CatalogStory, Category, StoryRecord } from "./model.ts";

export const CATALOG_PAGE_SIZE = 24;

export interface CatalogRepository {
  listStories(): Promise<readonly CatalogStory[]>;
  listCategories(): Promise<readonly Category[]>;
}

export function joinStoryRelations(
  story: StoryRecord,
  authors: readonly Author[],
  categories: readonly Category[],
): CatalogStory {
  const author = authors.find((candidate) => candidate.id === story.authorId);
  const storyCategories = story.categoryIds.map((categoryId) =>
    categories.find((candidate) => candidate.id === categoryId),
  );

  if (author === undefined || storyCategories.some((category) => category === undefined)) {
    throw new Error(`Catalog story ${story.id} has an invalid author/category relation.`);
  }

  return {
    ...story,
    author,
    categories: storyCategories.filter(
      (category): category is Category => category !== undefined,
    ),
  };
}
