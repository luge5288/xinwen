import Image from "next/image";
import type { HNItem } from "@/lib/hn";
import {
  discussionUrl,
  storyDomain,
  storyFaviconUrl,
  storyHref,
  storyTopic,
} from "@/lib/hn";

function formatAbsoluteTime(ts: number | undefined): string {
  if (!ts) return "—";
  const d = new Date(ts * 1000);
  return d.toLocaleString("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelativeTime(ts: number | undefined): string {
  if (!ts) return "刚刚";

  const diff = Math.max(0, Math.floor(Date.now() / 1000) - ts);
  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))} 分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`;
  return `${Math.floor(diff / 86400)} 天前`;
}

type Props = {
  item: HNItem;
  rank?: number;
  showScore?: boolean;
  tone?: "latest" | "day" | "week";
};

const toneClass = {
  latest: "border-l-sky-500",
  day: "border-l-amber-500",
  week: "border-l-emerald-500",
};

export function NewsCard({
  item,
  rank,
  showScore = true,
  tone = "latest",
}: Props) {
  const href = storyHref(item);
  const domain = storyDomain(item);
  const title = item.title ?? "未命名条目";

  return (
    <article
      className={`group flex h-full flex-col rounded-lg border border-l-4 border-neutral-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-900 hover:shadow-md ${toneClass[tone]}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50">
          <Image
            src={storyFaviconUrl(item)}
            alt=""
            width={24}
            height={24}
            className="h-6 w-6"
            loading="lazy"
            unoptimized
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-neutral-500">
            {rank != null && (
              <span className="font-mono text-neutral-900">
                #{String(rank).padStart(2, "0")}
              </span>
            )}
            <span className="truncate">{domain}</span>
            <span aria-hidden="true">·</span>
            <span>{storyTopic(item)}</span>
          </div>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-base font-semibold leading-snug text-neutral-950 decoration-neutral-950/30 underline-offset-4 group-hover:underline"
          >
            {title}
          </a>
        </div>
      </div>

      <div className="mt-4 flex flex-1 flex-col justify-end gap-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
          {showScore && (
            <span className="font-medium text-neutral-900">
              {item.score ?? 0} 分
            </span>
          )}
          <span>{item.descendants ?? 0} 评论</span>
          <span>{item.by ?? "—"}</span>
          <time dateTime={item.time ? new Date(item.time * 1000).toISOString() : undefined}>
            {formatRelativeTime(item.time)}
          </time>
          <span className="text-neutral-400">{formatAbsoluteTime(item.time)}</span>
        </div>

        <div className="flex items-center gap-3 text-xs font-medium">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-950"
          >
            原文
          </a>
          <a
            href={discussionUrl(item.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 underline decoration-neutral-300 underline-offset-4 hover:text-neutral-950 hover:decoration-neutral-950"
          >
            HN 讨论
          </a>
        </div>
      </div>
    </article>
  );
}
