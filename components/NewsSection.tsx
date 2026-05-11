import type { HNItem } from "@/lib/hn";
import { NewsCard } from "./NewsCard";

const iconClass =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500";

function SectionIcon({ tone }: { tone: NonNullable<Props["tone"]> }) {
  if (tone === "day") {
    return (
      <span className={iconClass} aria-hidden="true">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 21h8" />
          <path d="M12 17v4" />
          <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
          <path d="M5 6H3a3 3 0 0 0 3 3" />
          <path d="M19 6h2a3 3 0 0 1-3 3" />
        </svg>
      </span>
    );
  }

  if (tone === "week") {
    return (
      <span className={iconClass} aria-hidden="true">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 6v6l4 2" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      </span>
    );
  }

  return (
    <span className={iconClass} aria-hidden="true">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 14a4 4 0 1 1 8 0" />
        <path d="M10 14a2 2 0 1 1 4 0" />
        <path d="M12 2v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="m20 12 2 0" />
        <path d="m17.66 6.34 1.41-1.41" />
        <path d="M7 18h10" />
      </svg>
    </span>
  );
}

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
  emptyHint = "No matching stories yet. Check back soon.",
}: Props) {
  const previewItems = items.slice(0, 6);

  return (
    <section
      id={id}
      className="scroll-mt-24 overflow-hidden rounded-[22px] border border-slate-200/80 bg-white/90 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur"
    >
      <header className="flex items-center justify-between gap-4 px-5 pb-3 pt-5">
        <div className="flex min-w-0 items-center gap-3">
          <SectionIcon tone={tone} />
          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold tracking-tight text-slate-900">
              {title}
            </h2>
            <p className="mt-0.5 line-clamp-1 text-xs font-medium text-slate-500">
              {subtitle}
            </p>
          </div>
        </div>
        <a
          href={`#${id}`}
          className="shrink-0 text-sm font-semibold text-blue-600 underline-offset-4 hover:underline"
        >
          View More ↗
        </a>
      </header>
      {items.length === 0 ? (
        <p className="mx-5 mb-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          {emptyHint}
        </p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {previewItems.map((item, index) => (
            <li key={item.id} className="min-h-[92px]">
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
      <div className="border-t border-slate-100 px-5 py-3 text-right text-xs font-semibold text-slate-400">
        {items.length} stories
      </div>
    </section>
  );
}
