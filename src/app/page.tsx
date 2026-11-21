import Link from "next/link";

import { CategoryCard } from "@/components/catalog/CategoryCard";
import { EmptyState } from "@/components/catalog/EmptyState";
import { StoryGrid } from "@/components/catalog/StoryGrid";
import { SearchForm } from "@/components/site/SearchForm";
import type { CatalogQuery } from "@/features/catalog/model";
import { catalogService } from "@/features/catalog/catalog.server";

const featuredQuery: CatalogQuery = {
  q: "",
  sort: "newest",
  page: 1,
};

const latestQuery: CatalogQuery = {
  q: "",
  sort: "updated",
  page: 1,
};

export default async function HomePage() {
  const [categories, featured, latest] = await Promise.all([
    catalogService.listCategories(),
    catalogService.searchStories(featuredQuery),
    catalogService.searchStories(latestQuery),
  ]);

  return (
    <main className="mx-auto min-w-0 max-w-7xl px-4 py-10 sm:px-6 lg:px-8" id="main-content">
      <section className="grid gap-8 rounded-3xl bg-emerald-950 px-6 py-10 text-white shadow-sm sm:px-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end lg:py-14">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">
            Catalog V1-A
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-black tracking-tight sm:text-6xl">
            Đọc một chút, khám phá thêm nhiều điều.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-emerald-100 sm:text-lg">
            La Cà Truyện là một catalog thử nghiệm với những câu chuyện hư cấu,
            được sắp xếp để bạn dễ tìm và dễ bắt đầu.
          </p>
        </div>
        <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
          <p className="mb-3 text-sm font-bold text-emerald-100">Tìm nhanh trong catalog</p>
          <SearchForm id="homepage-search" />
        </div>
      </section>

      <section className="mt-12" aria-labelledby="featured-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-800">
              Chọn ngẫu hứng
            </p>
            <h2 className="mt-2 font-display text-3xl font-black text-stone-950" id="featured-heading">
              Truyện nổi bật
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Chọn theo ngày xuất bản gần nhất; thứ tự được giữ ổn định khi ngày trùng nhau.
            </p>
          </div>
          <Link
            className="rounded-lg text-sm font-bold text-emerald-800 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
            href="/search?sort=newest&page=1"
          >
            Xem toàn bộ
          </Link>
        </div>
        {featured.items.length > 0 ? (
          <div className="mt-6">
            <StoryGrid labelledBy="featured-heading" stories={featured.items.slice(0, 6)} />
          </div>
        ) : (
          <div className="mt-6">
            <EmptyState
              description="Catalog chưa có truyện published để hiển thị."
              title="Chưa có truyện nổi bật"
            />
          </div>
        )}
      </section>

      <section className="mt-14" aria-labelledby="latest-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-800">
              Cập nhật đều đặn
            </p>
            <h2 className="mt-2 font-display text-3xl font-black text-stone-950" id="latest-heading">
              Mới cập nhật
            </h2>
          </div>
          <Link
            className="rounded-lg text-sm font-bold text-emerald-800 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
            href="/search?page=1"
          >
            Khám phá thêm
          </Link>
        </div>
        <div className="mt-6">
          <StoryGrid labelledBy="latest-heading" stories={latest.items.slice(0, 6)} />
        </div>
      </section>

      <section className="mt-14" aria-labelledby="categories-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-800">
              Chọn theo gu
            </p>
            <h2 className="mt-2 font-display text-3xl font-black text-stone-950" id="categories-heading">
              Danh mục truyện
            </h2>
          </div>
          <span className="text-sm text-stone-600">{categories.length} danh mục</span>
        </div>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard category={category} key={category.id} />
          ))}
        </ul>
      </section>

      <section className="mt-14" aria-labelledby="catalog-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-800">
              Catalog công khai
            </p>
            <h2 className="mt-2 font-display text-3xl font-black text-stone-950" id="catalog-heading">
              Danh sách truyện
            </h2>
          </div>
          <span className="text-sm text-stone-600">{latest.pagination.totalItems} truyện published</span>
        </div>
        <div className="mt-6">
          <StoryGrid labelledBy="catalog-heading" stories={latest.items.slice(0, 8)} />
        </div>
      </section>
    </main>
  );
}
