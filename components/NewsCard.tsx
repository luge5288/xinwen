import type { HNItem } from "@/lib/hn";
import { discussionUrl, storyHref } from "@/lib/hn";

function formatTime(ts: number | undefined): string {
  if (!ts) return "—";
  const d = new Date(ts * 1000);
  return d.toLocaleString("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Props = {
  item: HNItem;
  showScore?: boolean;
};

export function NewsCard({ item, showScore = true }: Props) {
  const href = storyHref(item);
  const external = Boolean(item.url);

  return (
    <article className="group rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 transition hover:border-violet-500/40 hover:bg-zinc-900/70">
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="block text-base font-medium leading-snug text-zinc-100 decoration-violet-400/60 underline-offset-2 hover:underline"
      >
        {item.title}
      </a>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
        {showScore && (
          <span className="text-amber-400/90">
            {item.score ?? 0} 分
          </span>
        )}
        <span>{item.by ?? "—"}</span>
        <span>{formatTime(item.time)}</span>
        {item.descendants != null && (
          <a
            href={discussionUrl(item.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-400/80 hover:text-violet-300"
          >
            {item.descendants} 评论
          </a>
        )}
      </div>
    </article>
  );
}
