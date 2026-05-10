import type { HNItem } from "@/lib/hn";
import { NewsCard } from "./NewsCard";

type Props = {
  title: string;
  subtitle: string;
  items: HNItem[];
  showScore?: boolean;
  emptyHint?: string;
};

export function NewsSection({
  title,
  subtitle,
  items,
  showScore = true,
  emptyHint = "暂无匹配条目，请稍后刷新。",
}: Props) {
  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-white">
          {title}
        </h2>
        <p className="text-sm text-zinc-500">{subtitle}</p>
      </header>
      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-700 px-4 py-8 text-center text-sm text-zinc-500">
          {emptyHint}
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-1 lg:grid-cols-2">
          {items.map((item) => (
            <li key={item.id}>
              <NewsCard item={item} showScore={showScore} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
