import Image from "next/image";
import type { HNItem } from "@/lib/hn";
import {
  discussionUrl,
  storyDomain,
  storyFaviconUrl,
  storyHref,
  storyTopic,
} from "@/lib/hn";

function formatTime(ts: number | undefined): string {
  if (!ts) return "—";

  return new Date(ts * 1000).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Props = {
  item: HNItem | null;
};

export function FeaturedStory({ item }: Props) {
  if (!item) {
    return (
      <section className="rounded-[24px] border border-slate-200 bg-white/85 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
        <p className="text-sm text-slate-500">
          No AI stories are available yet. The lead story will appear here when the feed recovers.
        </p>
      </section>
    );
  }

  const href = storyHref(item);
  const title = item.title ?? "Untitled story";

  return (
    <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white/90 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur">
      <article className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.2fr_0.8fr] lg:p-8">
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium text-slate-500">
            <span className="rounded-full bg-blue-50 px-3 py-1 font-bold text-blue-700">
              Lead Story
            </span>
            <span>{storyTopic(item)}</span>
            <span>{storyDomain(item)}</span>
            <time dateTime={item.time ? new Date(item.time * 1000).toISOString() : undefined}>
              {formatTime(item.time)}
            </time>
          </div>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-balance text-2xl font-bold leading-tight tracking-tight text-slate-950 decoration-slate-950/25 underline-offset-4 hover:underline sm:text-4xl"
          >
            {title}
          </a>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500">
            The strongest story appears here first, then the feeds below make it easy to scan across topics.
          </p>
        </div>

        <div className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-100 bg-slate-50/75 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white">
              <Image
                src={storyFaviconUrl(item)}
                alt=""
                width={28}
                height={28}
                className="h-7 w-7"
                unoptimized
              />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-950">
                {item.score ?? 0} pts
              </p>
              <p className="text-sm text-slate-500">
                {item.descendants ?? 0} comments · {item.by ?? "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-slate-950 px-4 py-2 text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Open Story
            </a>
            <a
              href={discussionUrl(item.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 underline decoration-slate-300 underline-offset-4 hover:text-slate-950 hover:decoration-slate-950"
            >
              View HN Discussion
            </a>
          </div>
        </div>
      </article>
    </section>
  );
}
