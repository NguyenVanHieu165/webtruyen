import Link from "next/link";

import { SearchForm } from "./SearchForm";
import { SiteNavigation } from "./SiteNavigation";

export function SiteHeader() {
  return (
    <header className="border-b border-stone-200 bg-[#f7f5ef]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:px-8">
        <div className="flex min-w-0 items-center justify-between gap-4">
          <Link
            className="flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
            href="/"
          >
            <span
              aria-hidden="true"
              className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-800 text-lg font-black text-white shadow-sm"
            >
              LC
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-lg font-black tracking-tight text-stone-950">
                La Cà Truyện
              </span>
              <span className="block truncate text-xs font-medium text-stone-600">
                Một góc nhỏ để đọc và khám phá
              </span>
            </span>
          </Link>
          <div className="lg:hidden">
            <SiteNavigation />
          </div>
        </div>
        <div className="flex min-w-0 flex-1 justify-end lg:max-w-xl">
          <SearchForm />
        </div>
        <div className="hidden shrink-0 lg:block">
          <SiteNavigation />
        </div>
      </div>
    </header>
  );
}
