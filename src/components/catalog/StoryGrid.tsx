import type { StoryCardDto } from "@/features/catalog/model";

import { StoryCard } from "./StoryCard";

export function StoryGrid({
  stories,
  labelledBy,
}: {
  readonly stories: readonly StoryCardDto[];
  readonly labelledBy?: string;
}) {
  return (
    <ul
      aria-labelledby={labelledBy}
      className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} />
      ))}
    </ul>
  );
}
