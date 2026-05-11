import { describe, expect, it } from "vitest";
import {
  discussionUrl,
  isAiStory,
  storyDomain,
  storyFaviconUrl,
  storyHref,
  storyTopic,
  type HNItem,
} from "@/lib/hn";

function story(overrides: Partial<HNItem> & { id: number }): HNItem {
  return {
    type: "story",
    ...overrides,
  };
}

describe("isAiStory", () => {
  it("returns false for non-stories and removed items", () => {
    expect(isAiStory(story({ id: 1, type: "comment", title: "GPT-4" }))).toBe(
      false
    );
    expect(isAiStory(story({ id: 2, title: "LLM news", deleted: true }))).toBe(
      false
    );
    expect(isAiStory(story({ id: 3, title: "agents", dead: true }))).toBe(
      false
    );
  });

  it("matches AI-related titles or URLs", () => {
    expect(isAiStory(story({ id: 10, title: "New LLM benchmark results" }))).toBe(
      true
    );
    expect(
      isAiStory(
        story({ id: 11, title: "Some post", url: "https://arxiv.org/abs/123" })
      )
    ).toBe(false);
    expect(
      isAiStory(
        story({
          id: 12,
          title: "Discussion",
          url: "https://example.com/pytorch-tutorial",
        })
      )
    ).toBe(true);
  });
});

describe("storyDomain", () => {
  it("extracts hostname without www", () => {
    expect(
      storyDomain(story({ id: 1, url: "https://www.example.com/path" }))
    ).toBe("example.com");
  });

  it("falls back for Ask HN style (no url)", () => {
    expect(storyDomain(story({ id: 2, title: "Ask HN" }))).toBe(
      "news.ycombinator.com"
    );
  });

  it("falls back on invalid URL", () => {
    expect(storyDomain(story({ id: 3, url: "not-a-url" }))).toBe(
      "news.ycombinator.com"
    );
  });
});

describe("storyHref and discussionUrl", () => {
  it("uses external url when present", () => {
    expect(
      storyHref(story({ id: 42, url: "https://openai.com/blog/x" }))
    ).toBe("https://openai.com/blog/x");
  });

  it("uses HN discussion when no url", () => {
    expect(storyHref(story({ id: 99, title: "Show HN" }))).toBe(
      "https://news.ycombinator.com/item?id=99"
    );
    expect(discussionUrl(99)).toBe("https://news.ycombinator.com/item?id=99");
  });
});

describe("storyFaviconUrl", () => {
  it("encodes target url for Google favicon service", () => {
    const item = story({
      id: 1,
      url: "https://a.com/x y",
    });
    expect(storyFaviconUrl(item)).toContain(encodeURIComponent("https://a.com/x y"));
    expect(storyFaviconUrl(item)).toContain("https://www.google.com/s2/favicons");
  });
});

describe("storyTopic", () => {
  it("labels by keyword rules", () => {
    expect(
      storyTopic(story({ id: 1, title: "Gemini 2.0 ships" }))
    ).toBe("Products");
    expect(
      storyTopic(story({ id: 2, title: "RAG patterns for production" }))
    ).toBe("Engineering");
    expect(
      storyTopic(story({ id: 3, title: "Interesting AI thing", url: "https://x.com" }))
    ).toBe("AI");
  });
});
