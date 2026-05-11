import { FeaturedStory } from "@/components/FeaturedStory";
import { NewsSection } from "@/components/NewsSection";
import { getAiNewsPageData } from "@/lib/ai-news";
import { HN_BASE } from "@/lib/hn";
import { faqItems, faqJsonLd, websiteJsonLd } from "@/lib/seo";
import type { ReactNode } from "react";

export const revalidate = 60;
export const dynamic = "force-dynamic";

function formatGeneratedAt(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function HnLogo() {
  return (
    <span className="flex h-9 w-9 flex-col items-center justify-center rounded-[10px] bg-[#ff6d2d] text-[11px] font-black leading-[0.86] tracking-tight text-white shadow-sm">
      <span>AI</span>
      <span>NEWS</span>
    </span>
  );
}

function HeroIcon() {
  return (
    <span className="mx-auto flex h-16 w-16 items-center justify-center text-blue-600" aria-hidden="true">
      <svg viewBox="0 0 64 64" className="h-16 w-16" fill="none" stroke="currentColor" strokeWidth="4">
        <path d="M19 48h26a6 6 0 0 0 6-6V12H21a6 6 0 0 0-6 6v26a4 4 0 0 1-4 4h8Z" />
        <path d="M11 48a6 6 0 0 1-6-6V24h10" />
        <path d="M29 24h14" />
        <path d="M29 34h14" />
        <path d="M29 44h8" />
      </svg>
    </span>
  );
}

function HeaderIcon({ label, children }: { label: string; children: ReactNode }) {
  return (
    <a
      href={HN_BASE}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:text-blue-700"
    >
      {children}
    </a>
  );
}

export default async function Home() {
  const { latest, dayBest, weekBest, featured, stats } =
    await getAiNewsPageData();

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#dbeafe_0,#eef6ff_30%,transparent_58%),linear-gradient(135deg,#0f4ca8_0%,#3f36b8_42%,#cf59b8_100%)] p-0 text-slate-950 sm:p-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([websiteJsonLd(), faqJsonLd()]),
        }}
      />
      <main className="min-h-screen rounded-none border border-white/40 bg-[linear-gradient(115deg,rgba(239,246,255,0.96),rgba(255,255,255,0.95)_52%,rgba(250,245,255,0.96))] shadow-[0_30px_120px_rgba(15,23,42,0.25)] sm:rounded-[28px]">
        <header className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-10">
          <a href="#" className="flex items-center gap-3">
            <HnLogo />
            <span className="text-lg font-black tracking-tight text-slate-950">
              AI News
            </span>
          </a>
          <nav className="hidden items-center gap-7 text-[15px] font-bold text-slate-700 md:flex">
            <a href="#hot" className="hover:text-blue-700">
              Hot
            </a>
            <a href="#latest" className="hover:text-blue-700">
              Latest
            </a>
            <a href="#best" className="hover:text-blue-700">
              Best
            </a>
            <a href={HN_BASE} target="_blank" rel="noopener noreferrer" className="hover:text-blue-700">
              Ask
            </a>
            <a
              href={HN_BASE}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-700"
            >
              Show
            </a>
            <a href="https://www.ycombinator.com/jobs" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700">
              Jobs
            </a>
          </nav>
          <div className="hidden items-center gap-3 sm:flex">
            <HeaderIcon label="Open Hacker News API">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </HeaderIcon>
            <HeaderIcon label="Open Hacker News">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10Zm3.68-15.5h2.05l-4.48 5.12 5.27 6.88h-4.13l-3.24-4.18-3.7 4.18H5.4l4.79-5.47L5.14 6.5h4.23l2.93 3.88 3.38-3.88Z" />
              </svg>
            </HeaderIcon>
          </div>
        </header>

        <section className="mx-auto max-w-7xl px-5 pb-10 pt-10 text-center sm:px-8 sm:pb-16 sm:pt-16 lg:px-10">
          <HeroIcon />
          <h1 className="mx-auto mt-8 max-w-4xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-6xl">
            AI News
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg font-semibold leading-8 text-slate-600">
            A focused Hacker News digest for AI, model, engineering, and product stories, organized into fast-scanning feeds.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-bold text-slate-500">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
              Server refreshes every 60 seconds
            </span>
            <span>Updated {formatGeneratedAt(stats.generatedAt)}</span>
          </div>
        </section>

        {stats.error && (
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              News source is temporarily unavailable: {stats.error}
            </div>
          </div>
        )}

        <section className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-8 lg:grid-cols-3 lg:px-10">
          <NewsSection
            id="hot"
            title="Hot"
            subtitle="AI stories still drawing attention this week"
            items={weekBest}
            tone="day"
            showScore
          />
          <NewsSection
            id="latest"
            title="Latest"
            subtitle="Fresh stories sorted by publish time"
            items={latest}
            tone="week"
            showScore
          />
          <NewsSection
            id="best"
            title="Best"
            subtitle="Top-scoring stories from the last 24 hours"
            items={dayBest}
            tone="latest"
            showScore
          />
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[1fr_320px] lg:px-10">
          <div className="space-y-6">
            <FeaturedStory item={featured} />
            <div className="grid gap-4 rounded-[24px] border border-slate-200 bg-white/80 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.05)] sm:grid-cols-4">
              {[
                ["Scanned", stats.scannedStories],
                ["AI Matches", stats.matchedStories],
                ["Latest", latest.length],
                ["Best Picks", weekBest.length],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="text-xs font-bold text-slate-500">{label}</p>
                  <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <section className="rounded-[24px] border border-slate-200 bg-white/90 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur">
              <h2 className="text-base font-black text-slate-950">Top Sources</h2>
              {stats.sourceDomains.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">No source data yet</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {stats.sourceDomains.map((source) => (
                    <li
                      key={source.domain}
                      className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm"
                    >
                      <span className="truncate font-semibold text-slate-600">
                        {source.domain}
                      </span>
                      <span className="font-black text-slate-950">
                        {source.count}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-[24px] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_18px_60px_rgba(15,23,42,0.12)]">
              <h2 className="text-base font-black">API Status</h2>
              <dl className="mt-4 space-y-3 text-sm text-slate-300">
                <div className="flex justify-between gap-4">
                  <dt>newstories</dt>
                  <dd className="font-black text-white">
                    {stats.feedSizes.newstories}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>topstories</dt>
                  <dd className="font-black text-white">
                    {stats.feedSizes.topstories}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>beststories</dt>
                  <dd className="font-black text-white">
                    {stats.feedSizes.beststories}
                  </dd>
                </div>
              </dl>
            </section>
          </aside>
        </section>

        <footer className="mx-auto max-w-7xl px-5 pb-8 pt-4 sm:px-8 lg:px-10">
          <section className="mb-6">
            <h2 className="text-xl font-black text-slate-950">FAQ</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {faqItems.map((item) => (
                <details
                  key={item.question}
                  className="rounded-md border border-slate-200 bg-white/75 px-5 py-4 text-left shadow-[0_12px_36px_rgba(15,23,42,0.04)]"
                >
                  <summary className="cursor-pointer text-sm font-black text-slate-950">
                    {item.question}
                  </summary>
                  <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
          <p className="rounded-[22px] border border-slate-200 bg-white/70 px-5 py-4 text-sm font-medium text-slate-500">
            Data from{" "}
            <a
              href={HN_BASE}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-950 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-950"
            >
              Hacker News Firebase API
            </a>
            . AI matching is based on title and URL keywords.
          </p>
        </footer>
      </main>
    </div>
  );
}
