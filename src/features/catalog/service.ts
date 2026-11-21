import { normalizeSearchText } from "./search-normalization.ts";
import {
  CATALOG_PAGE_SIZE,
  type CatalogRepository,
} from "./repository.ts";
import type {
  CatalogQuery,
  CatalogStory,
  CategorySummaryDto,
  PaginationMetadata,
  PublishedCatalogStory,
  StoryCardDto,
  StoryDetailDto,
  StoryListingResult,
} from "./model.ts";

const vietnameseTitleCollator = new Intl.Collator("vi", {
  numeric: true,
  sensitivity: "base",
});

function compareIds(left: CatalogStory, right: CatalogStory): number {
  if (left.id < right.id) {
    return -1;
  }
  if (left.id > right.id) {
    return 1;
  }
  return 0;
}

function compareDatesDescending(left: string, right: string): number {
  return Date.parse(right) - Date.parse(left);
}

function sortStories(
  stories: readonly PublishedCatalogStory[],
  sort: CatalogQuery["sort"],
): PublishedCatalogStory[] {
  const sorted = [...stories];

  switch (sort) {
    case "updated":
      return sorted.sort(
        (left, right) =>
          compareDatesDescending(left.catalogUpdatedAt, right.catalogUpdatedAt) ||
          compareIds(left, right),
      );
    case "newest":
      return sorted.sort(
        (left, right) =>
          compareDatesDescending(left.publishedAt, right.publishedAt) ||
          compareIds(left, right),
      );
    case "title":
      return sorted.sort(
        (left, right) =>
          vietnameseTitleCollator.compare(left.title, right.title) ||
          compareIds(left, right),
      );
  }
}

function toStoryCardDto(story: PublishedCatalogStory): StoryCardDto {
  return {
    id: story.id,
    slug: story.slug,
    title: story.title,
    coverImage: story.coverImage,
    author: story.author.name,
    lifecycle: story.lifecycle,
    categories: story.categories.map(({ slug, name }) => ({ slug, name })),
    publishedAt: story.publishedAt,
    catalogUpdatedAt: story.catalogUpdatedAt,
  };
}

function toStoryDetailDto(story: PublishedCatalogStory): StoryDetailDto {
  return {
    ...toStoryCardDto(story),
    description: story.description,
  };
}

function toPaginationMetadata(
  page: number,
  totalItems: number,
): PaginationMetadata {
  const totalPages = Math.ceil(totalItems / CATALOG_PAGE_SIZE);
  const range =
    totalItems === 0
      ? page === 1
        ? "empty"
        : "out-of-range"
      : page > totalPages
        ? "out-of-range"
        : "available";

  return {
    page,
    pageSize: CATALOG_PAGE_SIZE,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: range === "available" && page < totalPages,
    range,
  };
}

function toStoryListingResult(
  stories: readonly PublishedCatalogStory[],
  query: CatalogQuery,
): StoryListingResult {
  const sorted = sortStories(stories, query.sort);
  const pagination = toPaginationMetadata(query.page, sorted.length);
  const start = (query.page - 1) * CATALOG_PAGE_SIZE;
  const pageItems =
    pagination.range === "available"
      ? sorted.slice(start, start + CATALOG_PAGE_SIZE)
      : [];

  return {
    items: pageItems.map(toStoryCardDto),
    pagination,
    query,
  };
}

function hasCategory(
  story: CatalogStory,
  categorySlug: string | undefined,
): boolean {
  return (
    categorySlug === undefined ||
    story.categories.some((category) => category.slug === categorySlug)
  );
}

function matchesQuery(story: CatalogStory, query: string): boolean {
  if (query.length === 0) {
    return true;
  }

  const normalizedQuery = normalizeSearchText(query);
  return (
    normalizeSearchText(story.title).includes(normalizedQuery) ||
    normalizeSearchText(story.author.name).includes(normalizedQuery)
  );
}

function matchesStatus(
  story: CatalogStory,
  status: CatalogQuery["status"],
): boolean {
  return status === undefined || story.lifecycle === status;
}

function publishedStories(
  stories: readonly CatalogStory[],
): PublishedCatalogStory[] {
  return stories.filter(
    (story): story is PublishedCatalogStory =>
      story.publicationStatus === "published",
  );
}

export function createCatalogService(repository: CatalogRepository) {
  return {
    async searchStories(query: CatalogQuery): Promise<StoryListingResult> {
      const stories = publishedStories(await repository.listStories()).filter(
        (story) =>
          hasCategory(story, query.category) &&
          matchesStatus(story, query.status) &&
          matchesQuery(story, query.q),
      );
      return toStoryListingResult(stories, query);
    },

    async getCategoryStories(
      categorySlug: string,
      query: CatalogQuery,
    ): Promise<StoryListingResult | null> {
      const [categories, catalogStories] = await Promise.all([
        repository.listCategories(),
        repository.listStories(),
      ]);
      if (!categories.some((category) => category.slug === categorySlug)) {
        return null;
      }

      const stories = publishedStories(catalogStories).filter(
        (story) =>
          hasCategory(story, categorySlug) && matchesStatus(story, query.status),
      );
      return toStoryListingResult(stories, query);
    },

    async listCategories(): Promise<readonly CategorySummaryDto[]> {
      const [categories, stories] = await Promise.all([
        repository.listCategories(),
        repository.listStories(),
      ]);
      const visibleStories = publishedStories(stories);

      return categories.map((category) => ({
        ...category,
        publishedStoryCount: visibleStories.filter((story) =>
          story.categories.some((item) => item.id === category.id),
        ).length,
      }));
    },

    async getCategoryBySlug(
      slug: string,
    ): Promise<CategorySummaryDto | null> {
      const [categories, stories] = await Promise.all([
        repository.listCategories(),
        repository.listStories(),
      ]);
      const category = categories.find((item) => item.slug === slug);
      if (category === undefined) {
        return null;
      }

      const publishedStoryCount = publishedStories(stories).filter((story) =>
        story.categories.some((item) => item.id === category.id),
      ).length;

      return { ...category, publishedStoryCount };
    },

    async getStoryBySlug(slug: string): Promise<StoryDetailDto | null> {
      const stories = publishedStories(await repository.listStories());
      const story = stories.find((item) => item.slug === slug);
      return story === undefined ? null : toStoryDetailDto(story);
    },
  };
}
