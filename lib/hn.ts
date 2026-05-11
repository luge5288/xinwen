import https from "node:https";

/**
 * Hacker News Firebase API.
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
    label: "Models",
    pattern:
      /\b(llm|gpt|claude|gemini|mistral|language model|foundation model|transformer|multimodal|vision model)\b/i,
  },
  {
    label: "Products",
    pattern: /\b(openai|anthropic|copilot|sora|midjourney|chatgpt|gemini)\b/i,
  },
  {
    label: "Engineering",
    pattern:
      /\b(rag|langchain|ollama|embeddings|vector db|semantic search|inference|fine-?tuning|evals?|tokens?)\b/i,
  },
  {
    label: "Research",
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

let preferHttpsFallback = false;

function fetchJsonWithHttpsFallback<T>(path: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const req = https.get(
      `${HN_BASE}${path}`,
      {
        rejectUnauthorized: false,
        timeout: 8000,
      },
      (res) => {
        const { statusCode = 0 } = res;
        let body = "";

        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => {
          if (statusCode < 200 || statusCode >= 300) {
            reject(new Error(`HN fallback failed: ${path} ${statusCode}`));
            return;
          }

          try {
            resolve(JSON.parse(body) as T);
          } catch (error) {
            reject(error);
          }
        });
      }
    );

    req.on("timeout", () => {
      req.destroy(new Error(`HN fallback timed out: ${path}`));
    });
    req.on("error", reject);
  });
}

async function fetchJson<T>(path: string): Promise<T> {
  if (preferHttpsFallback) {
    return fetchJsonWithHttpsFallback<T>(path);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(`${HN_BASE}${path}`, {
      next: { revalidate: 60 },
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HN fetch failed: ${path} ${res.status}`);
    return res.json() as Promise<T>;
  } catch {
    preferHttpsFallback = true;
    return fetchJsonWithHttpsFallback<T>(path);
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
