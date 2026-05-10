import { FeaturedStory } from "@/components/FeaturedStory";
import { NewsSection } from "@/components/NewsSection";
import { getAiNewsPageData } from "@/lib/ai-news";
import { HN_BASE } from "@/lib/hn";

export const revalidate = 60;

function formatGeneratedAt(iso: string): string {
  return new Date(iso).toLocaleString("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function Home() {
  const { latest, dayBest, weekBest, featured, stats } =
    await getAiNewsPageData();

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <a href="#" className="text-sm font-semibold tracking-tight">
            AI Newsroom
          </a>
          <nav className="flex items-center gap-4 text-sm font-medium text-neutral-600">
            <a href="#latest" className="hover:text-neutral-950">
              最新
            </a>
            <a href="#day-best" className="hover:text-neutral-950">
              24小时
            </a>
            <a href="#week-best" className="hover:text-neutral-950">
              一周
            </a>
            <a
              href={HN_BASE}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-neutral-400 hover:text-neutral-950 sm:inline"
            >
              HN API
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
              Hacker News · AI Digest
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
              AI 新闻雷达
            </h1>
            <p className="max-w-2xl text-base leading-7 text-neutral-600">
              聚合 HN 公开 API 中的 AI、模型、工程与产品报道，按更新时间和社区热度整理成三条新闻流。
            </p>
            <p className="text-sm text-neutral-500">
              更新于 {formatGeneratedAt(stats.generatedAt)} · 服务端 60 秒缓存
            </p>
          </div>

          <dl className="grid overflow-hidden rounded-lg border border-neutral-200 bg-neutral-200 sm:grid-cols-4 lg:grid-cols-2">
            <div className="bg-white p-4">
              <dt className="text-xs font-medium text-neutral-500">扫描条目</dt>
              <dd className="mt-2 text-2xl font-semibold">
                {stats.scannedStories}
              </dd>
            </div>
            <div className="bg-white p-4">
              <dt className="text-xs font-medium text-neutral-500">AI 匹配</dt>
              <dd className="mt-2 text-2xl font-semibold">
                {stats.matchedStories}
              </dd>
            </div>
            <div className="bg-white p-4">
              <dt className="text-xs font-medium text-neutral-500">24小时精选</dt>
              <dd className="mt-2 text-2xl font-semibold">
                {dayBest.length}
              </dd>
            </div>
            <div className="bg-white p-4">
              <dt className="text-xs font-medium text-neutral-500">一周精选</dt>
              <dd className="mt-2 text-2xl font-semibold">
                {weekBest.length}
              </dd>
            </div>
          </dl>
        </section>

        {stats.error && (
          <div className="border-y border-red-200 bg-red-50">
            <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-red-700 sm:px-6 lg:px-8">
              新闻源暂时不可用：{stats.error}
            </div>
          </div>
        )}

        <FeaturedStory item={featured} />

        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_280px] lg:px-8">
          <div className="space-y-14">
            <NewsSection
              id="latest"
              title="最新 AI 新闻"
              subtitle="按 HN newstories 的发布时间排序，优先展示刚出现的 AI 相关报道。"
              items={latest}
              tone="latest"
              showScore
            />
            <NewsSection
              id="day-best"
              title="24 小时最优质"
              subtitle="过去 24 小时内的 AI 报道，按 HN 分数排序，评论数作为同分参考。"
              items={dayBest}
              tone="day"
              showScore
            />
            <NewsSection
              id="week-best"
              title="一周最优质"
              subtitle="过去 7 天内仍有讨论热度的 AI 报道，适合回看本周重点。"
              items={weekBest}
              tone="week"
              showScore
            />
          </div>

          <aside className="space-y-8 lg:sticky lg:top-20 lg:self-start">
            <section className="space-y-3 border-t border-neutral-200 pt-4">
              <h2 className="text-sm font-semibold text-neutral-950">
                主要来源
              </h2>
              {stats.sourceDomains.length === 0 ? (
                <p className="text-sm text-neutral-500">暂无来源统计</p>
              ) : (
                <ul className="space-y-3">
                  {stats.sourceDomains.map((source) => (
                    <li
                      key={source.domain}
                      className="flex items-center justify-between gap-4 text-sm"
                    >
                      <span className="truncate text-neutral-600">
                        {source.domain}
                      </span>
                      <span className="font-medium text-neutral-950">
                        {source.count}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="space-y-3 border-t border-neutral-200 pt-4">
              <h2 className="text-sm font-semibold text-neutral-950">
                API 列表
              </h2>
              <dl className="space-y-2 text-sm text-neutral-600">
                <div className="flex justify-between gap-4">
                  <dt>newstories</dt>
                  <dd className="font-medium text-neutral-950">
                    {stats.feedSizes.newstories}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>topstories</dt>
                  <dd className="font-medium text-neutral-950">
                    {stats.feedSizes.topstories}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>beststories</dt>
                  <dd className="font-medium text-neutral-950">
                    {stats.feedSizes.beststories}
                  </dd>
                </div>
              </dl>
            </section>
          </aside>
        </section>

        <footer className="border-t border-neutral-200 bg-white">
          <p className="mx-auto max-w-7xl px-4 py-6 text-sm text-neutral-500 sm:px-6 lg:px-8">
            数据来自{" "}
            <a
              href={HN_BASE}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-950 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-950"
            >
              Hacker News Firebase API
            </a>
            ，AI 匹配基于标题与链接关键词。
          </p>
        </footer>
      </main>
    </div>
  );
}
