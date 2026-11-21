export const storyLifecycles = ["ongoing", "completed", "hiatus"] as const;

export type StoryLifecycle = (typeof storyLifecycles)[number];

export const publicationStatuses = ["draft", "published", "archived"] as const;

export type PublicationStatus = (typeof publicationStatuses)[number];

export const storySortOrders = ["updated", "newest", "title"] as const;

export type StorySortOrder = (typeof storySortOrders)[number];

export interface Author {
  readonly id: string;
  readonly name: string;
}

export interface Category {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly description?: string;
}

/**
 * Normalized source record: authorId and categoryIds map to future relational
 * foreign keys and the StoryCategory join table.
 */
interface StoryRecordFields {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly coverImage: string;
  readonly authorId: string;
  readonly lifecycle: StoryLifecycle;
  readonly categoryIds: readonly string[];
  readonly catalogUpdatedAt: string;
}

export type StoryRecord = StoryRecordFields &
  (
    | {
        readonly publicationStatus: "published";
        readonly publishedAt: string;
      }
    | {
        readonly publicationStatus: "draft" | "archived";
        readonly publishedAt: string | null;
      }
  );

export type CatalogStory = StoryRecord & {
  readonly author: Author;
  readonly categories: readonly Category[];
};

export type PublishedCatalogStory = CatalogStory & {
  readonly publicationStatus: "published";
  readonly publishedAt: string;
};

export interface StoryCardDto {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly coverImage: string;
  readonly author: string;
  readonly lifecycle: StoryLifecycle;
  readonly categories: readonly Pick<Category, "slug" | "name">[];
  readonly publishedAt: string;
  readonly catalogUpdatedAt: string;
}

export interface StoryDetailDto extends StoryCardDto {
  readonly description: string;
}

export interface CategorySummaryDto extends Category {
  readonly publishedStoryCount: number;
}

export interface CatalogQuery {
  readonly q: string;
  readonly category?: string;
  readonly status?: StoryLifecycle;
  readonly sort: StorySortOrder;
  readonly page: number;
}

export interface PaginationMetadata {
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly totalPages: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;
  readonly range: "available" | "empty" | "out-of-range";
}

export interface StoryListingResult {
  readonly items: readonly StoryCardDto[];
  readonly pagination: PaginationMetadata;
  readonly query: CatalogQuery;
}
