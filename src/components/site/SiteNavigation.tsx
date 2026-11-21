import Link from "next/link";

const navigationItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/search", label: "Khám phá" },
] as const;

export function SiteNavigation() {
  return (
    <nav aria-label="Điều hướng chính">
      <ul className="flex flex-wrap items-center gap-1">
        {navigationItems.map((item) => (
          <li key={item.href}>
            <Link
              className="rounded-full px-3 py-2 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100 hover:text-stone-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
              href={item.href}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
