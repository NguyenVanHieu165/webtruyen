import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  authorFixtures,
  categoryFixtures,
  storyFixtures,
} from "../src/features/catalog/fixtures.ts";
import type { CatalogQuery } from "../src/features/catalog/model.ts";
import {
  hasCatalogSearchCriteria,
  parseCategoryQuery,
  parseSearchQuery,
} from "../src/features/catalog/query-schema.ts";
import { catalogService } from "../src/features/catalog/catalog.server.ts";
import { joinStoryRelations } from "../src/features/catalog/repository.ts";
import { normalizeSearchText } from "../src/features/catalog/search-normalization.ts";
import { createCatalogService } from "../src/features/catalog/service.ts";

function createFixtureService() {
  const stories = storyFixtures.map((story) =>
    joinStoryRelations(story, authorFixtures, categoryFixtures),
  );

  return createCatalogService({
    async listStories() {
      return stories;
    },
    async listCategories() {
      return categoryFixtures;
    },
  });
}

function query(
  values: Readonly<Record<string, unknown>> = {},
): { readonly success: true; readonly data: CatalogQuery } {
  const result = parseSearchQuery(values);
  assert.equal(result.success, true);
  if (!result.success) {
    throw new Error("Expected a valid search query.");
  }
  return result;
}

describe("catalog query validation", () => {
  it("applies defaults and normalizes query whitespace", () => {
    const parsed = query({ q: "  tien   hiep  " });
    assert.deepEqual(parsed.data, {
      q: "tien hiep",
      category: undefined,
      status: undefined,
      sort: "updated",
      page: 1,
    });
  });

  it("rejects duplicate, unsupported, and invalid parameters", () => {
    const duplicate = parseSearchQuery({ page: ["1", "2"] });
    const unsupported = parseSearchQuery({ filter: "fresh" });
    const invalid = parseSearchQuery({ page: "101", status: "paused" });

    assert.equal(duplicate.success, false);
    if (!duplicate.success) {
      assert.equal(duplicate.issues[0]?.code, "duplicate");
      assert.equal(duplicate.issues[0]?.field, "page");
    }

    assert.equal(unsupported.success, false);
    if (!unsupported.success) {
      assert.equal(unsupported.issues[0]?.code, "unsupported");
      assert.equal(unsupported.issues[0]?.field, "filter");
    }

    assert.equal(invalid.success, false);
    if (!invalid.success) {
      assert.deepEqual(
        invalid.issues.map((issue) => issue.field).sort(),
        ["page", "status"],
      );
    }
  });

  it("enforces the keyword limit and integer page syntax", () => {
    const atLimit = query({ q: "a".repeat(100) });
    const overLimit = parseSearchQuery({ q: "a".repeat(101) });
    const nonInteger = parseSearchQuery({ page: "1.0" });

    assert.equal(atLimit.data.q.length, 100);
    assert.equal(overLimit.success, false);
    assert.equal(nonInteger.success, false);
  });

  it("uses a narrower parameter allowlist on category pages", () => {
    const parsed = parseCategoryQuery({ q: "ignored" });
    assert.equal(parsed.success, false);
    if (!parsed.success) {
      assert.equal(parsed.issues[0]?.code, "unsupported");
      assert.equal(parsed.issues[0]?.field, "q");
    }
  });

  it("treats blank form options as no category or lifecycle filter", () => {
    const parsed = parseSearchQuery({ category: "", status: "" });

    assert.equal(parsed.success, true);
    if (parsed.success) {
      assert.equal(parsed.data.category, undefined);
      assert.equal(parsed.data.status, undefined);
    }
  });

  it("does not treat sorting or pagination alone as a search criterion", () => {
    assert.equal(
      hasCatalogSearchCriteria(query({ sort: "title", page: "2" }).data),
      false,
    );
    assert.equal(hasCatalogSearchCriteria(query({ q: "mua ha" }).data), true);
    assert.equal(
      hasCatalogSearchCriteria(query({ status: "ongoing" }).data),
      true,
    );
  });
});

describe("fixture inventory", () => {
  it("contains synthetic catalog data across all required lifecycles", () => {
    assert.ok(storyFixtures.length >= 30 && storyFixtures.length <= 50);
    assert.deepEqual(
      [...new Set(storyFixtures.map((story) => story.lifecycle))].sort(),
      ["completed", "hiatus", "ongoing"],
    );
    assert.deepEqual(
      [...new Set(storyFixtures.map((story) => story.publicationStatus))].sort(),
      ["archived", "draft", "published"],
    );
    assert.ok(storyFixtures.every((story) => story.coverImage.startsWith("/covers/")));
  });
});

describe("Vietnamese search normalization", () => {
  it("ignores case, tone marks, d/đ, and repeated whitespace", () => {
    assert.equal(normalizeSearchText(" tien   hiep "), "tien hiep");
    assert.equal(normalizeSearchText("duong"), normalizeSearchText("Đường"));
  });

  it("does not mutate source fixture values", () => {
    const sourceTitle = storyFixtures[1].title;
    normalizeSearchText(sourceTitle);
    assert.equal(storyFixtures[1].title, sourceTitle);
    assert.equal(sourceTitle, "Đường Lên Thanh Vân");
  });
});

describe("catalog service", () => {
  it("composes the server-only fixture repository", async () => {
    const [categories, stories] = await Promise.all([
      catalogService.listCategories(),
      catalogService.searchStories(query().data),
    ]);

    assert.equal(categories.length, 8);
    assert.equal(stories.pagination.totalItems, 33);
  });

  it("excludes non-published stories and searches both title and author", async () => {
    const service = createFixtureService();
    const titleResults = await service.searchStories(query({ q: "duong" }).data);
    const authorResults = await service.searchStories(
      query({ q: "nguyen lam chi" }).data,
    );
    const draftResults = await service.searchStories(query({ q: "pho nho sau" }).data);

    assert.ok(titleResults.items.some((story) => story.slug === "duong-len-thanh-van"));
    assert.ok(authorResults.items.some((story) => story.slug === "ben-song-co-may"));
    assert.equal(draftResults.pagination.totalItems, 0);
  });

  it("filters by category and lifecycle", async () => {
    const service = createFixtureService();
    const parsed = query({ category: "tinh-cam", status: "completed" });
    const results = await service.searchStories(parsed.data);

    assert.ok(results.items.length > 0);
    assert.ok(
      results.items.every(
        (story) =>
          story.lifecycle === "completed" &&
          story.categories.some((category) => category.slug === "tinh-cam"),
      ),
    );
  });

  it("sorts deterministically and paginates at 24 items", async () => {
    const service = createFixtureService();
    const newest = await service.searchStories(query({ sort: "newest" }).data);
    const titles = await service.searchStories(query({ sort: "title" }).data);

    assert.equal(newest.items.length, 24);
    assert.equal(newest.pagination.pageSize, 24);
    assert.equal(newest.pagination.totalPages, 2);
    assert.equal(newest.items[0]?.slug, "canh-cua-mua-thu-thu-hai");
    assert.equal(titles.items[0]?.title, "Bản Đồ Những Con Đường Mất");

    const updatedTies = await service.searchStories(
      query({ sort: "updated" }).data,
    );
    const tiedIds = updatedTies.items
      .filter((story) => story.catalogUpdatedAt === "2025-03-22T10:30:00.000Z")
      .map((story) => story.id);
    assert.deepEqual(tiedIds, ["story-002", "story-007"]);

    const duplicateTitles = await service.searchStories(
      query({ q: "canh cua mua thu", sort: "title" }).data,
    );
    assert.deepEqual(
      duplicateTitles.items.map((story) => story.id),
      ["story-003", "story-029"],
    );
  });

  it("returns an empty page for an out-of-range request", async () => {
    const service = createFixtureService();
    const results = await service.searchStories(query({ page: "100" }).data);

    assert.equal(results.pagination.range, "out-of-range");
    assert.equal(results.items.length, 0);
    assert.equal(results.pagination.totalItems, 33);
  });

  it("distinguishes an empty first page from a missing later page", async () => {
    const service = createFixtureService();
    const emptyFirstPage = await service.searchStories(
      query({ q: "khong co truyen nay" }).data,
    );
    const emptyLaterPage = await service.searchStories(
      query({ q: "khong co truyen nay", page: "2" }).data,
    );

    assert.equal(emptyFirstPage.pagination.range, "empty");
    assert.equal(emptyLaterPage.pagination.range, "out-of-range");
    assert.equal(emptyLaterPage.items.length, 0);
  });

  it("returns detail/category DTOs without fixture internals", async () => {
    const service = createFixtureService();
    const story = await service.getStoryBySlug("duong-len-thanh-van");
    const category = await service.getCategoryBySlug("tien-hiep");
    const missing = await service.getCategoryStories(
      "missing-category",
      query().data,
    );

    assert.ok(story !== null);
    assert.equal(story.description.includes("chuyến đi"), true);
    assert.equal("authorId" in story, false);
    assert.ok(category !== null && category.publishedStoryCount > 0);
    assert.equal(missing, null);
    assert.equal(await service.getStoryBySlug("pho-nho-sau-con-mua"), null);
  });
});
