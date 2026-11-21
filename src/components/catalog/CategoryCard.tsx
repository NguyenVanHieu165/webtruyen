import Link from "next/link";

import type { CategorySummaryDto } from "@/features/catalog/model";

export function CategoryCard({
  category,
}: {
  readonly category: CategorySummaryDto;
}) {
  return (
    <li>
      <Link
        className="block rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-colors hover:border-emerald-300 hover:bg-emerald-50/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        href={"/category/" + category.slug}
      >
        <span className="flex items-baseline justify-between gap-3">
          <span className="font-display text-lg font-extrabold text-stone-950">
            {category.name}
          </span>
          <span className="shrink-0 text-xs font-bold tabular-nums text-emerald-800">
            {category.publishedStoryCount} truyện
          </span>
        </span>
        {category.description ? (
          <span className="mt-2 block line-clamp-2 text-sm leading-6 text-stone-600">
            {category.description}
          </span>
        ) : null}
      </Link>
    </li>
  );
}
