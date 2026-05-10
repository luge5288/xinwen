import { NewsSection } from "@/components/NewsSection";
import { getAiNewsPageData } from "@/lib/ai-news";
import { HN_BASE } from "@/lib/hn";

export const revalidate = 60;

export default async function Home() {
  const { latest, dayBest, weekBest } = await getAiNewsPageData();

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-fuchsia-600/15 blur-3xl" />
      </div>

      <main className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-14 space-y-4 border-b border-zinc-800 pb-10">
          <p className="text-xs font-medium uppercase tracking-widest text-violet-400/90">
            Hacker News · AI 筛选
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            AI 新闻聚合
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-zinc-400">
            数据来自{" "}
            <a
              href={HN_BASE}
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 underline decoration-violet-500/40 underline-offset-2 hover:decoration-violet-400"
            >
              Firebase HN API
            </a>
            （与仓库 README 一致）。按标题与链接关键词识别 AI
            相关报道；「优质」按站内分数（score）排序。
          </p>
        </header>

        <div className="space-y-16">
          <NewsSection
            title="最新 AI 报道"
            subtitle="来自 newstories，按发布时间从新到旧。"
            items={latest}
            showScore
          />
          <NewsSection
            title="24 小时 · 高票精选"
            subtitle="来自 top / best / new 列表，过去 24 小时内、分数最高的 AI 报道。"
            items={dayBest}
            showScore
          />
          <NewsSection
            title="一周 · 高票精选"
            subtitle="同一数据源，过去 7 天内按分数排序。"
            items={weekBest}
            showScore
          />
        </div>

        <footer className="mt-20 border-t border-zinc-800 pt-8 text-center text-xs text-zinc-600">
          每 60 秒可在服务端重新验证缓存 · 非 HN 官方站点
        </footer>
      </main>
    </div>
  );
}
