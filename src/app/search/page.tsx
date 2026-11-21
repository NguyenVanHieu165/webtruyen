import type { Metadata } from "next";

import { CatalogFilters } from "@/components/catalog/CatalogFilters";
import { CategoryCard } from "@/components/catalog/CategoryCard";
import { EmptyState } from "@/components/catalog/EmptyState";
import { Pagination } from "@/components/catalog/Pagination";
import { QueryErrorState } from "@/components/catalog/QueryErrorState";
import { StoryGrid } from "@/components/catalog/StoryGrid";
import { SearchForm } from "@/components/site/SearchForm";
import { catalogService } from "@/features/catalog/catalog.server";
import type { CatalogQuery } from "@/features/catalog/model";
import {
  hasCatalogSearchCriteria,
  parseSearchQuery,
} from "@/features/catalog/query-schema";

export const metadata: Metadata = {
  title: "Khám phá truyện",
  description: "Tìm kiếm và lọc catalog truyện của La Cà Truyện.",
};

interface SearchPageProps {
  readonly searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const rawSearchParams = await searchParams;
  const parsed = parseSearchQuery(rawSearchParams);

  return (
    <main className="mx-auto min-w-0 max-w-7xl px-4 py-10 sm:px-6 lg:px-8" id="main-content">
      {!parsed.success ? (
        <QueryErrorState issues={parsed.issues} resetHref="/search" />
      ) : (
        <SearchContent query={parsed.data} />
      )}
    </main>
  );
}

async function SearchContent({
  query,
}: {
  readonly query: CatalogQuery;
}) {
  const [categories, result] = await Promise.all([
    catalogService.listCategories(),
    catalogService.searchStories(query),
  ]);
  const hasSearchIntent = hasCatalogSearchCriteria(query);

  return (
    <>
      <header className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-800">
          Khám phá catalog
        </p>
        <h1 className="mt-3 font-display text-4xl font-black tracking-tight text-stone-950 sm:text-5xl">
          Tìm câu chuyện tiếp theo
        </h1>
        <p className="mt-4 text-base leading-8 text-stone-600">
          Tìm theo tiêu đề hoặc tác giả, rồi thu hẹp kết quả theo danh mục và trạng thái.
        </p>
      </header>
      <div className="mt-8 max-w-2xl">
        <SearchForm
          defaultQuery={query.q}
          id="catalog-search"
          preserveFilters={{
            category: query.category,
            sort: query.sort,
            status: query.status,
          }}
        />
      </div>
      <div className="mt-6">
        <CatalogFilters categories={categories} query={query} variant="search" />
      </div>
      {!hasSearchIntent ? (
        <div className="mt-8">
          <EmptyState
            description="Nhập từ khóa hoặc chọn một bộ lọc để bắt đầu khám phá những truyện trong catalog."
            title="Bạn muốn tìm gì?"
          />
        </div>
      ) : result.pagination.range === "out-of-range" ? (
        <div className="mt-8">
          <EmptyState
            description="Trang bạn chọn không có trong kết quả hiện tại."
            href="/search"
            linkLabel="Về trang tìm kiếm"
            title="Không có trang này"
          />
        </div>
      ) : result.items.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            description="Thử một từ khóa khác hoặc bỏ bớt bộ lọc để xem thêm kết quả."
            href="/search"
            linkLabel="Xóa bộ lọc"
            title="Không tìm thấy truyện phù hợp"
          />
        </div>
      ) : (
        <>
          <section className="mt-8" aria-labelledby="search-results-heading">
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <h2 className="font-display text-2xl font-black text-stone-950" id="search-results-heading">
                Kết quả tìm kiếm
              </h2>
              <span className="text-sm text-stone-600">
                {result.pagination.totalItems} truyện · trang {result.pagination.page}/{result.pagination.totalPages}
              </span>
            </div>
            <StoryGrid labelledBy="search-results-heading" stories={result.items} />
          </section>
          <div className="mt-8">
            <Pagination
              basePath="/search"
              currentPage={result.pagination.page}
              query={query}
              totalPages={result.pagination.totalPages}
            />
          </div>
        </>
      )}
      <section className="mt-14" aria-labelledby="search-categories-heading">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl font-black text-stone-950" id="search-categories-heading">
            Hoặc chọn danh mục
          </h2>
          <span className="text-sm text-stone-600">{categories.length} danh mục</span>
        </div>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard category={category} key={category.id} />
          ))}
        </ul>
      </section>
    </>
  );
}
