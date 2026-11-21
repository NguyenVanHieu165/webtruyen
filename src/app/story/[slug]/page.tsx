import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StoryDetail } from "@/components/catalog/StoryDetail";
import { catalogService } from "@/features/catalog/catalog.server";

interface StoryPageProps {
  readonly params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = await catalogService.getStoryBySlug(slug);
  if (story === null) {
    notFound();
  }

  return { title: story.title, description: story.description };
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const story = await catalogService.getStoryBySlug(slug);

  if (story === null) {
    notFound();
  }

  return (
    <main className="mx-auto min-w-0 max-w-7xl px-4 py-10 sm:px-6 lg:px-8" id="main-content">
      <StoryDetail story={story} />
    </main>
  );
}
