import type { CatalogQuery } from "@/features/catalog/model";

interface SearchFormProps {
  readonly id?: string;
  readonly defaultQuery?: string;
  readonly preserveFilters?: Pick<CatalogQuery, "category" | "status" | "sort">;
}

export function SearchForm({
  id = "site-search",
  defaultQuery = "",
  preserveFilters,
}: SearchFormProps) {
  return (
    <form
      action="/search"
      className="flex w-full min-w-0 items-end gap-2"
      method="get"
    >
      <div className="min-w-0 flex-1">
        <label className="sr-only" htmlFor={id}>
          Tìm kiếm truyện hoặc tác giả
        </label>
        <input
          autoComplete="off"
          className="min-h-11 w-full min-w-0 rounded-xl border border-stone-300 bg-white px-3.5 text-sm text-stone-950 shadow-sm outline-none placeholder:text-stone-500 focus-visible:border-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-700/30"
          defaultValue={defaultQuery}
          id={id}
          name="q"
          placeholder="Tìm truyện hoặc tác giả…"
          type="search"
        />
      </div>
      {preserveFilters?.category ? (
        <input name="category" type="hidden" value={preserveFilters.category} />
      ) : null}
      {preserveFilters?.status ? (
        <input name="status" type="hidden" value={preserveFilters.status} />
      ) : null}
      {preserveFilters?.sort && preserveFilters.sort !== "updated" ? (
        <input name="sort" type="hidden" value={preserveFilters.sort} />
      ) : null}
      <input name="page" type="hidden" value="1" />
      <button
        className="min-h-11 shrink-0 rounded-xl bg-emerald-800 px-4 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        type="submit"
      >
        Tìm
      </button>
    </form>
  );
}
