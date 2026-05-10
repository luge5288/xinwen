import {
  fetchItems,
  fetchStoryIds,
  isAiStory,
  type HNItem,
} from "./hn";

const NOW = () => Math.floor(Date.now() / 1000);
const HOUR = 3600;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

function uniqueIds(ids: number[]): number[] {
  return [...new Set(ids)];
}

/** 从 new 列表按时间顺序收集足够数量的 AI 报道 */
export async function getLatestAiNews(limit = 36, maxFetch = 180): Promise<HNItem[]> {
  const ids = await fetchStoryIds("newstories");
  const items = await fetchItems(ids.slice(0, maxFetch));
  const ai = items.filter(isAiStory);
  ai.sort((a, b) => (b.time ?? 0) - (a.time ?? 0));
  return ai.slice(0, limit);
}

/**
 * 在时间窗内按 HN score 排序的「优质」AI 报道。
 * 合并 top / best 列表以覆盖近期高票内容。
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
  const cutoff = NOW() - windowSec;
  const filtered = items.filter(
    (it) => isAiStory(it) && (it.time ?? 0) >= cutoff
  );
  filtered.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  return filtered.slice(0, limit);
}

export async function getAiNewsPageData() {
  const [latest, dayBest, weekBest] = await Promise.all([
    getLatestAiNews(40, 200),
    getBestAiInWindow(DAY, 20, 250),
    getBestAiInWindow(WEEK, 24, 300),
  ]);
  return { latest, dayBest, weekBest };
}
