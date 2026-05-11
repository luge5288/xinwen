import type { HNItem } from "@/lib/hn";
import {
  discussionUrl,
  storyDomain,
  storyHref,
  storyTopic,
} from "@/lib/hn";

function formatAbsoluteTime(ts: number | undefined): string {
  if (!ts) return "—";
  const d = new Date(ts * 1000);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelativeTime(ts: number | undefined): string {
  if (!ts) return "just now";

  const diff = Math.max(0, Math.floor(Date.now() / 1000) - ts);
  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

type Props = {
  item: HNItem;
  rank?: number;
  showScore?: boolean;
  tone?: "latest" | "day" | "week";
};

const toneClass = {
  latest: "before:bg-blue-500",
  day: "before:bg-rose-500",
  week: "before:bg-violet-500",
};

export function NewsCard({
  item,
  rank,
  showScore = true,
  tone = "latest",
}: Props) {
  const href = storyHref(item);
  const domain = storyDomain(item);
  const title = item.title ?? "Untitled story";

  return (
    <article
      className={`group relative rounded-md px-5 py-4 transition hover:bg-slate-50/85 before:absolute before:left-0 before:top-6 before:h-1.5 before:w-1.5 before:rounded-full ${toneClass[tone]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="line-clamp-2 text-[15px] font-semibold leading-6 text-slate-900 decoration-slate-400 underline-offset-4 group-hover:underline"
        >
          {title}
        </a>
        <span className="mt-1 shrink-0 text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-600">
          ↗
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-medium text-slate-500">
        {rank != null && (
          <span className="text-slate-400">#{String(rank).padStart(2, "0")}</span>
        )}
        {showScore && <span>{item.score ?? 0} pts</span>}
        <span className="h-1 w-1 rounded-full bg-emerald-400" aria-hidden="true" />
        <span className="max-w-28 truncate">{domain}</span>
        <span className="h-1 w-1 rounded-full bg-violet-400" aria-hidden="true" />
        <span>{storyTopic(item)}</span>
        <span className="h-1 w-1 rounded-full bg-slate-300" aria-hidden="true" />
        <time dateTime={item.time ? new Date(item.time * 1000).toISOString() : undefined}>
          {formatRelativeTime(item.time)}
        </time>
        <a
          href={discussionUrl(item.id)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 underline-offset-4 hover:text-blue-600 hover:underline"
        >
          {item.descendants ?? 0} comments
        </a>
        <span className="sr-only">{formatAbsoluteTime(item.time)}</span>
      </div>
    </article>
  );
}
