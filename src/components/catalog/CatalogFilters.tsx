import type {
  CatalogQuery,
  CategorySummaryDto,
} from "@/features/catalog/model";

import { lifecycleLabels, sortLabels } from "@/lib/catalog-ui";

type CatalogFiltersProps =
  | {
      readonly variant: "search";
      readonly query: CatalogQuery;
      readonly categories: readonly CategorySummaryDto[];
    }
  | {
      readonly variant: "category";
      readonly query: CatalogQuery;
    };

export function CatalogFilters(props: CatalogFiltersProps) {
  const query = props.query;
  const action = props.variant === "search" ? "/search" : undefined;

  return (
    <form
      action={action}
      className="grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4"
      method="get"
    >
      {props.variant === "search" ? (
        <div className="min-w-0">
          <label className="mb-1.5 block text-sm font-bold text-stone-800" htmlFor="catalog-category">
            Thể loại
          </label>
          <select
            className="min-h-11 w-full rounded-xl border border-stone-300 bg-white px-3 text-sm text-stone-900 outline-none focus-visible:border-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-700/30"
            defaultValue={query.category ?? ""}
            id="catalog-category"
            name="category"
          >
            <option value="">Tất cả thể loại</option>
            {props.categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      <div className="min-w-0">
        <label className="mb-1.5 block text-sm font-bold text-stone-800" htmlFor="catalog-status">
          Trạng thái
        </label>
        <select
          className="min-h-11 w-full rounded-xl border border-stone-300 bg-white px-3 text-sm text-stone-900 outline-none focus-visible:border-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-700/30"
          defaultValue={query.status ?? ""}
          id="catalog-status"
          name="status"
        >
          <option value="">Mọi trạng thái</option>
          {Object.entries(lifecycleLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="min-w-0">
        <label className="mb-1.5 block text-sm font-bold text-stone-800" htmlFor="catalog-sort">
          Sắp xếp
        </label>
        <select
          className="min-h-11 w-full rounded-xl border border-stone-300 bg-white px-3 text-sm text-stone-900 outline-none focus-visible:border-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-700/30"
          defaultValue={query.sort}
          id="catalog-sort"
          name="sort"
        >
          {Object.entries(sortLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      {props.variant === "search" && query.q.length > 0 ? (
        <input name="q" type="hidden" value={query.q} />
      ) : null}
      <input name="page" type="hidden" value="1" />
      <button
        className="min-h-11 self-end rounded-xl bg-stone-900 px-4 text-sm font-bold text-white transition-colors hover:bg-stone-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        type="submit"
      >
        Áp dụng
      </button>
    </form>
  );
}
