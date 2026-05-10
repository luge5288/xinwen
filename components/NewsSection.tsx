import type { HNItem } from "@/lib/hn";
import { NewsCard } from "./NewsCard";

type Props = {
  id: string;
  title: string;
  subtitle: string;
  items: HNItem[];
  showScore?: boolean;
  tone?: "latest" | "day" | "week";
  emptyHint?: string;
};

export function NewsSection({
  id,
  title,
  subtitle,
  items,
  showScore = true,
  tone = "latest",
  emptyHint = "暂无匹配条目，请稍后刷新。",
}: Props) {
  return (
    <section id={id} className="scroll-mt-24 space-y-4">
      <header className="flex flex-col gap-2 border-b border-neutral-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
            {title}
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-neutral-600">
            {subtitle}
          </p>
        </div>
        <p className="text-sm font-medium text-neutral-500">{items.length} 条</p>
      </header>
      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-300 bg-white px-4 py-8 text-center text-sm text-neutral-500">
          {emptyHint}
        </p>
      ) : (
        <ul className="grid gap-3 lg:grid-cols-2">
          {items.map((item, index) => (
            <li key={item.id}>
              <NewsCard
                item={item}
                rank={index + 1}
                showScore={showScore}
                tone={tone}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
