import {
  fetchItems,
  fetchStoryIds,
  isAiStory,
  storyDomain,
  type HNItem,
} from "./hn";

const NOW = () => Math.floor(Date.now() / 1000);
const HOUR = 3600;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const PAGE_DATA_TIMEOUT_MS = 8000;
const STORIES_PER_FEED = 100;

let lastSuccessfulData: AiNewsPageData | null = null;

export type AiNewsPageData = {
  latest: HNItem[];
  dayBest: HNItem[];
  weekBest: HNItem[];
  featured: HNItem | null;
  stats: {
    generatedAt: string;
    scannedStories: number;
    matchedStories: number;
    sourceDomains: Array<{ domain: string; count: number }>;
    feedSizes: {
      newstories: number;
      topstories: number;
      beststories: number;
    };
    error?: string;
  };
};

function uniqueIds(ids: number[]): number[] {
  return [...new Set(ids)];
}

function byNewest(a: HNItem, b: HNItem): number {
  return (b.time ?? 0) - (a.time ?? 0);
}

function byQuality(a: HNItem, b: HNItem): number {
  return (
    (b.score ?? 0) - (a.score ?? 0) ||
    (b.descendants ?? 0) - (a.descendants ?? 0) ||
    byNewest(a, b)
  );
}

function inWindow(item: HNItem, windowSec: number, now = NOW()): boolean {
  return (item.time ?? 0) >= now - windowSec;
}

function sourceDomains(items: HNItem[], limit = 6) {
  const counts = new Map<string, number>();

  for (const item of items) {
    const domain = storyDomain(item);
    counts.set(domain, (counts.get(domain) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([domain, count]) => ({ domain, count }));
}

function emptyData(error?: string): AiNewsPageData {
  return {
    latest: [],
    dayBest: [],
    weekBest: [],
    featured: null,
    stats: {
      generatedAt: new Date().toISOString(),
      scannedStories: 0,
      matchedStories: 0,
      sourceDomains: [],
      feedSizes: {
        newstories: 0,
        topstories: 0,
        beststories: 0,
      },
      error,
    },
  };
}

function messageFromError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Unable to read the news feed";
}

function withError(data: AiNewsPageData, error: string): AiNewsPageData {
  return {
    ...data,
    stats: {
      ...data.stats,
      error,
    },
  };
}

function hasNews(data: AiNewsPageData): boolean {
  return data.latest.length > 0 || data.dayBest.length > 0 || data.weekBest.length > 0;
}

function timeoutData(ms = PAGE_DATA_TIMEOUT_MS): Promise<AiNewsPageData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        lastSuccessfulData
          ? withError(lastSuccessfulData, "Showing the latest cached news while the source refreshes")
          : emptyData("News source took too long to respond")
      );
    }, ms);
  });
}

/** Collect enough AI stories from the new feed in chronological order. */
export async function getLatestAiNews(limit = 36, maxFetch = 180): Promise<HNItem[]> {
  const ids = await fetchStoryIds("newstories");
  const items = await fetchItems(ids.slice(0, maxFetch));
  const ai = items.filter(isAiStory);
  ai.sort(byNewest);
  return ai.slice(0, limit);
}

/**
 * Rank high-quality AI stories in the selected time window by HN score.
 * Combine top and best feeds to cover recent high-scoring content.
 */
export async function getBestAiInWindow(
  windowSec: number,
  limit = 24,
  maxIdsPerFeed = 200
): Promise<HNItem[]> {
  const [topIds, bestIds, newIds] = await Promise.all([
    fetchStoryIds("topstories"),
    fetchStoryIds("beststories"),
    fetchStoryIds("newstories"),
  ]);
  const allIds = uniqueIds([
    ...topIds.slice(0, maxIdsPerFeed),
    ...bestIds.slice(0, maxIdsPerFeed),
    ...newIds.slice(0, maxIdsPerFeed),
  ]);
  const items = await fetchItems(allIds);
  const filtered = items.filter((it) => isAiStory(it) && inWindow(it, windowSec));
  filtered.sort(byQuality);
  return filtered.slice(0, limit);
}

async function collectAiNewsPageData(): Promise<AiNewsPageData> {
  try {
    const generatedAt = new Date().toISOString();
    const [newIds, topIds, bestIds] = await Promise.all([
      fetchStoryIds("newstories"),
      fetchStoryIds("topstories"),
      fetchStoryIds("beststories"),
    ]);

    const latestIds = newIds.slice(0, STORIES_PER_FEED);
    const qualityIds = uniqueIds([
      ...topIds.slice(0, STORIES_PER_FEED),
      ...bestIds.slice(0, STORIES_PER_FEED),
      ...latestIds,
    ]);
    const allIds = uniqueIds([...latestIds, ...qualityIds]);
    const allItems = await fetchItems(allIds);
    const byId = new Map(allItems.map((item) => [item.id, item]));
    const aiItems = allItems.filter(isAiStory);
    const now = NOW();

    const latest = latestIds
      .map((id) => byId.get(id))
      .filter((item): item is HNItem => Boolean(item && isAiStory(item)))
      .sort(byNewest)
      .slice(0, 40);

    const dayBest = aiItems
      .filter((item) => inWindow(item, DAY, now))
      .sort(byQuality)
      .slice(0, 20);

    const weekBest = aiItems
      .filter((item) => inWindow(item, WEEK, now))
      .sort(byQuality)
      .slice(0, 24);

    const featured = dayBest[0] ?? weekBest[0] ?? latest[0] ?? null;

    return {
      latest,
      dayBest,
      weekBest,
      featured,
      stats: {
        generatedAt,
        scannedStories: allItems.length,
        matchedStories: aiItems.length,
        sourceDomains: sourceDomains(aiItems),
        feedSizes: {
          newstories: newIds.length,
          topstories: topIds.length,
          beststories: bestIds.length,
        },
      },
    };
  } catch (error) {
    return emptyData(messageFromError(error));
  }
}

export async function getAiNewsPageData(): Promise<AiNewsPageData> {
  const pending = collectAiNewsPageData().then((data) => {
    if (hasNews(data)) {
      lastSuccessfulData = data;
    }
    return data;
  });

  return Promise.race([pending, timeoutData()]);
}
