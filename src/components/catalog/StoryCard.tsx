import Image from "next/image";
import Link from "next/link";

import type { StoryCardDto } from "@/features/catalog/model";
import { formatDateVi, lifecycleLabels } from "@/lib/catalog-ui";

export function StoryCard({ story }: { readonly story: StoryCardDto }) {
  return (
    <li className="group min-w-0">
      <Link
        className="flex h-full min-w-0 gap-4 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm transition-transform hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        href={"/story/" + story.slug}
      >
        <Image
          alt={"Bìa minh họa cho " + story.title}
          className="h-36 w-24 shrink-0 rounded-xl object-cover sm:h-44 sm:w-28"
          height={720}
          loading="lazy"
          sizes="112px"
          src={story.coverImage}
          width={480}
        />
        <span className="flex min-w-0 flex-col py-1">
          <span className="line-clamp-3 font-display text-base font-extrabold leading-6 text-stone-950 sm:text-lg">
            {story.title}
          </span>
          <span className="mt-2 truncate text-sm font-semibold text-emerald-800">
            {story.author}
          </span>
          <span className="mt-auto pt-3 text-xs text-stone-600">
            {lifecycleLabels[story.lifecycle]}
          </span>
          <span className="mt-1 text-xs text-stone-500">
            Cập nhật {formatDateVi(story.catalogUpdatedAt)}
          </span>
        </span>
      </Link>
    </li>
  );
}
