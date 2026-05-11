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

export type StoryFeedEndpoint = "newstories" | "topstories" | "beststories";

const AI_PATTERN =
  /\b(ai|agentic|agents?|ml\b|llm|gpt|openai|anthropic|claude|gemini|copilot|neural|deep learning|machine learning|artificial intelligence|transformer|diffusion|stable diffusion|midjourney|langchain|\brag\b|fine-?tuning|inference|nvidia|hugging\s*face|pytorch|tensorflow|mistral|ollama|vision model|multimodal|sora|whisper|embeddings|vector db|semantic search|evals?|tokens?|foundation model|language model)\b/i;

const TOPIC_RULES = [
  {
    label: "模型",
    pattern:
      /\b(llm|gpt|claude|gemini|mistral|language model|foundation model|transformer|multimodal|vision model)\b/i,
  },
  {
    label: "产品",
    pattern: /\b(openai|anthropic|copilot|sora|midjourney|chatgpt|gemini)\b/i,
  },
  {
    label: "工程",
    pattern:
      /\b(rag|langchain|ollama|embeddings|vector db|semantic search|inference|fine-?tuning|evals?|tokens?)\b/i,
  },
  {
    label: "研究",
    pattern:
      /\b(neural|deep learning|machine learning|pytorch|tensorflow|diffusion|stable diffusion)\b/i,
  },
] as const;

export function isAiStory(item: HNItem): boolean {
  if (item.deleted || item.dead || item.type !== "story") return false;
  const text = `${item.title ?? ""} ${item.url ?? ""}`;
  return AI_PATTERN.test(text);
}

export function storyText(item: HNItem): string {
  return `${item.title ?? ""} ${item.url ?? ""}`;
}

export function storyDomain(item: HNItem): string {
  if (!item.url) return "news.ycombinator.com";

  try {
    return new URL(item.url).hostname.replace(/^www\./, "");
  } catch {
    return "news.ycombinator.com";
  }
}

export function storyFaviconUrl(item: HNItem): string {
  const target = item.url ?? discussionUrl(item.id);
  return `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(
    target
  )}&sz=64`;
}

export function storyTopic(item: HNItem): string {
  const text = storyText(item);
  const match = TOPIC_RULES.find(({ pattern }) => pattern.test(text));
  return match?.label ?? "AI";
}

async function fetchJson<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(`${HN_BASE}${path}`, {
      next: { revalidate: 60 },
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HN fetch failed: ${path} ${res.status}`);
    return res.json() as Promise<T>;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchStoryIds(
  endpoint: StoryFeedEndpoint
): Promise<number[]> {
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

const BATCH = 64;

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
