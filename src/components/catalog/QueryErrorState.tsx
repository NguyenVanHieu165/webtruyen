import Link from "next/link";

import type { QueryValidationIssue } from "@/features/catalog/query-schema";

export function QueryErrorState({
  issues,
  resetHref,
}: {
  readonly issues: readonly QueryValidationIssue[];
  readonly resetHref: string;
}) {
  return (
    <section
      aria-labelledby="catalog-query-error-title"
      className="rounded-2xl border border-amber-300 bg-amber-50 p-6"
      role="alert"
    >
      <h1 className="font-display text-xl font-extrabold text-amber-950" id="catalog-query-error-title">
        Tham số tìm kiếm chưa hợp lệ
      </h1>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-amber-900">
        {issues.map((issue) => (
          <li key={issue.field + "-" + issue.code}>
            <span className="font-bold">{issue.field}:</span> {issue.message}
          </li>
        ))}
      </ul>
      <Link
        className="mt-5 inline-flex rounded-xl bg-amber-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-amber-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-900"
        href={resetHref}
      >
        Đặt lại bộ lọc
      </Link>
    </section>
  );
}
