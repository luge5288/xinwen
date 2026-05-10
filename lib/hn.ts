/**
 * Hacker News Firebase API（与仓库 README 一致）
 * https://hacker-news.firebaseio.com/v0/
 */

export const HN_BASE = "https://hacker-news.firebaseio.com/v0";

export type HNItem = {
  id: number;
  type?: string;
  title?: string;
  url?: string;
  score?: number;
  time?: number;
  by?: string;
  descendants?: number;
  dead?: boolean;
  deleted?: boolean;
};

const AI_PATTERN =
  /\b(ai|ml\b|llm|gpt|openai|anthropic|claude|gemini|copilot|neural|deep learning|machine learning|artificial intelligence|transformer|diffusion|stable diffusion|midjourney|langchain|\brag\b|fine-?tuning|inference|nvidia|hugging\s*face|pytorch|tensorflow|mistral|ollama|vision model|multimodal|sora|whisper|embeddings|vector db|semantic search)\b/i;

export function isAiStory(item: HNItem): boolean {
  if (item.deleted || item.dead || item.type !== "story") return false;
  const text = `${item.title ?? ""} ${item.url ?? ""}`;
  return AI_PATTERN.test(text);
}

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${HN_BASE}${path}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`HN fetch failed: ${path} ${res.status}`);
  return res.json() as Promise<T>;
}

export async function fetchStoryIds(endpoint: string): Promise<number[]> {
  return fetchJson<number[]>(`/${endpoint}.json`);
}

export async function fetchItem(id: number): Promise<HNItem | null> {
  try {
    const item = await fetchJson<HNItem | null>(`/item/${id}.json`);
    return item;
  } catch {
    return null;
  }
}

const BATCH = 24;

export async function fetchItems(ids: number[]): Promise<HNItem[]> {
  const out: HNItem[] = [];
  for (let i = 0; i < ids.length; i += BATCH) {
    const slice = ids.slice(i, i + BATCH);
    const batch = await Promise.all(slice.map((id) => fetchItem(id)));
    for (const item of batch) {
      if (item) out.push(item);
    }
  }
  return out;
}

export function discussionUrl(id: number): string {
  return `https://news.ycombinator.com/item?id=${id}`;
}

export function storyHref(item: HNItem): string {
  if (item.url) return item.url;
  return discussionUrl(item.id);
}
