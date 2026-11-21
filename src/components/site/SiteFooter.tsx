import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-stone-950 text-stone-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div>
          <p className="font-display text-lg font-black text-white">La Cà Truyện</p>
          <p className="mt-1 max-w-md text-sm leading-6 text-stone-400">
            Catalog thử nghiệm dùng dữ liệu hư cấu, được xây dựng độc lập cho V1-A.
          </p>
        </div>
        <Link
          className="w-fit rounded-lg text-sm font-semibold text-emerald-300 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300"
          href="/search"
        >
          Khám phá catalog
        </Link>
      </div>
    </footer>
  );
}
