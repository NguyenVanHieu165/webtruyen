import Link from "next/link";

import type { CatalogQuery } from "@/features/catalog/model";

function pageHref(
  basePath: string,
  query: CatalogQuery,
  page: number,
): string {
  const params = new URLSearchParams();
  if (basePath === "/search" && query.q.length > 0) {
    params.set("q", query.q);
  }
  if (basePath === "/search" && query.category) {
    params.set("category", query.category);
  }
  if (query.status) {
    params.set("status", query.status);
  }
  if (query.sort !== "updated") {
    params.set("sort", query.sort);
  }
  params.set("page", String(page));
  return basePath + "?" + params.toString();
}

export function Pagination({
  basePath,
  query,
  totalPages,
  currentPage,
}: {
  readonly basePath: string;
  readonly query: CatalogQuery;
  readonly totalPages: number;
  readonly currentPage: number;
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav aria-label="Phân trang" className="flex flex-wrap items-center gap-2">
      {currentPage > 1 ? (
        <Link
          className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-bold text-stone-800 hover:border-emerald-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          href={pageHref(basePath, query, currentPage - 1)}
        >
          Trang trước
        </Link>
      ) : null}
      <ol className="flex items-center gap-1" aria-label="Các trang">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <li key={page}>
            <Link
              aria-current={page === currentPage ? "page" : undefined}
              className={
                "grid size-10 place-items-center rounded-lg text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 " +
                (page === currentPage
                  ? "bg-emerald-800 text-white"
                  : "border border-stone-300 bg-white text-stone-800 hover:border-emerald-600")
              }
              href={pageHref(basePath, query, page)}
            >
              {page}
            </Link>
          </li>
        ))}
      </ol>
      {currentPage < totalPages ? (
        <Link
          className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-bold text-stone-800 hover:border-emerald-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          href={pageHref(basePath, query, currentPage + 1)}
        >
          Trang sau
        </Link>
      ) : null}
    </nav>
  );
}
