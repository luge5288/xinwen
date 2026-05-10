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

  return new Date(ts * 1000).toLocaleString("zh-CN", {
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
      <section className="border-y border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-sm text-neutral-500">
            当前没有拿到 AI 新闻条目，等新闻源恢复后这里会显示今日头条。
          </p>
        </div>
      </section>
    );
  }

  const href = storyHref(item);
  const title = item.title ?? "未命名条目";

  return (
    <section className="border-y border-neutral-200 bg-white">
      <article className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.25fr_0.75fr] lg:px-8">
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-neutral-500">
            <span className="font-semibold text-neutral-950">今日头条</span>
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
            className="block text-balance text-3xl font-semibold leading-tight tracking-tight text-neutral-950 decoration-neutral-950/25 underline-offset-4 hover:underline sm:text-4xl"
          >
            {title}
          </a>
        </div>

        <div className="flex flex-col justify-between gap-5 border-t border-neutral-200 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50">
              <img
                src={storyFaviconUrl(item)}
                alt=""
                width={28}
                height={28}
                className="h-7 w-7"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-950">
                {item.score ?? 0} 分
              </p>
              <p className="text-sm text-neutral-500">
                {item.descendants ?? 0} 条讨论 · {item.by ?? "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-950 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-950"
            >
              打开原文
            </a>
            <a
              href={discussionUrl(item.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 underline decoration-neutral-300 underline-offset-4 hover:text-neutral-950 hover:decoration-neutral-950"
            >
              查看 HN 讨论
            </a>
          </div>
        </div>
      </article>
    </section>
  );
}
