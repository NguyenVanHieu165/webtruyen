import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CatalogFilters } from "@/components/catalog/CatalogFilters";
import { EmptyState } from "@/components/catalog/EmptyState";
import { Pagination } from "@/components/catalog/Pagination";
import { QueryErrorState } from "@/components/catalog/QueryErrorState";
import { StoryGrid } from "@/components/catalog/StoryGrid";
import { catalogService } from "@/features/catalog/catalog.server";
import type { CatalogQuery } from "@/features/catalog/model";
import { parseCategoryQuery } from "@/features/catalog/query-schema";

interface CategoryPageProps {
  readonly params: Promise<{ slug: string }>;
  readonly searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await catalogService.getCategoryBySlug(slug);
  if (category === null) {
    notFound();
  }

  return {
    title: category.name,
    description: category.description ?? "Khám phá truyện trong danh mục.",
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const [{ slug }, rawSearchParams] = await Promise.all([params, searchParams]);
  const parsed = parseCategoryQuery(rawSearchParams);

  return (
    <main className="mx-auto min-w-0 max-w-7xl px-4 py-10 sm:px-6 lg:px-8" id="main-content">
      {!parsed.success ? (
        <QueryErrorState issues={parsed.issues} resetHref={"/category/" + slug} />
      ) : (
        <CategoryContent slug={slug} query={parsed.data} />
      )}
    </main>
  );
}

async function CategoryContent({
  slug,
  query,
}: {
  readonly slug: string;
  readonly query: CatalogQuery;
}) {
  const [category, result] = await Promise.all([
    catalogService.getCategoryBySlug(slug),
    catalogService.getCategoryStories(slug, query),
  ]);

  if (category === null || result === null) {
    notFound();
  }

  return (
    <>
      <header className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-800">
          Danh mục truyện
        </p>
        <h1 className="mt-3 break-words font-display text-4xl font-black tracking-tight text-stone-950 sm:text-5xl">
          {category.name}
        </h1>
        {category.description ? (
          <p className="mt-4 text-base leading-8 text-stone-600">{category.description}</p>
        ) : null}
        <p className="mt-4 text-sm font-semibold text-stone-600">
          {category.publishedStoryCount} truyện published
        </p>
      </header>
      <div className="mt-8">
        <CatalogFilters query={query} variant="category" />
      </div>
      {result.pagination.range === "out-of-range" ? (
        <div className="mt-8">
          <EmptyState
            description="Trang bạn chọn không có trong kết quả hiện tại."
            href={"/category/" + slug}
            linkLabel="Về trang đầu"
            title="Không có trang này"
          />
        </div>
      ) : result.items.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            description="Danh mục này chưa có truyện phù hợp với bộ lọc hiện tại."
            href={"/category/" + slug}
            linkLabel="Xóa bộ lọc"
            title="Chưa có kết quả"
          />
        </div>
      ) : (
        <>
          <section className="mt-8" aria-labelledby="category-results-heading">
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <h2 className="font-display text-2xl font-black text-stone-950" id="category-results-heading">
                Danh sách truyện
              </h2>
              <span className="text-sm text-stone-600">
                Trang {result.pagination.page}/{result.pagination.totalPages}
              </span>
            </div>
            <StoryGrid labelledBy="category-results-heading" stories={result.items} />
          </section>
          <div className="mt-8">
            <Pagination
              basePath={"/category/" + slug}
              currentPage={result.pagination.page}
              query={query}
              totalPages={result.pagination.totalPages}
            />
          </div>
        </>
      )}
    </>
  );
}
