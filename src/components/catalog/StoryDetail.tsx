import Image from "next/image";
import Link from "next/link";

import type { StoryDetailDto } from "@/features/catalog/model";
import { formatDateVi, lifecycleLabels } from "@/lib/catalog-ui";

export function StoryDetail({ story }: { readonly story: StoryDetailDto }) {
  return (
    <article className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
      <Image
        alt={"Bìa minh họa cho " + story.title}
        className="mx-auto h-[300px] w-[200px] rounded-2xl object-cover shadow-md lg:mx-0"
        height={720}
        priority
        sizes="(min-width: 1024px) 220px, 200px"
        src={story.coverImage}
        width={480}
      />
      <div className="min-w-0">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-800">
          {lifecycleLabels[story.lifecycle]}
        </p>
        <h1 className="mt-3 break-words font-display text-4xl font-black tracking-tight text-stone-950 sm:text-5xl">
          {story.title}
        </h1>
        <p className="mt-3 text-base font-semibold text-stone-700">{story.author}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {story.categories.map((category) => (
            <Link
              className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-900 hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
              href={"/category/" + category.slug}
              key={category.slug}
            >
              {category.name}
            </Link>
          ))}
        </div>
        <p className="mt-7 max-w-3xl whitespace-pre-line text-base leading-8 text-stone-700">
          {story.description}
        </p>
        <dl className="mt-8 grid gap-4 border-t border-stone-200 pt-6 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-bold text-stone-500">Xuất bản</dt>
            <dd className="mt-1 font-semibold text-stone-900">{formatDateVi(story.publishedAt)}</dd>
          </div>
          <div>
            <dt className="font-bold text-stone-500">Cập nhật catalog</dt>
            <dd className="mt-1 font-semibold text-stone-900">{formatDateVi(story.catalogUpdatedAt)}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
