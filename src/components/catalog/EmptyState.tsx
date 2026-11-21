import Link from "next/link";

export function EmptyState({
  title,
  description,
  href = "/search",
  linkLabel = "Khám phá catalog",
}: {
  readonly title: string;
  readonly description: string;
  readonly href?: string;
  readonly linkLabel?: string;
}) {
  return (
    <section className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
      <h2 className="font-display text-xl font-extrabold text-stone-950">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-stone-600">{description}</p>
      <Link
        className="mt-5 inline-flex rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        href={href}
      >
        {linkLabel}
      </Link>
    </section>
  );
}
