import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NewsCard } from "@/components/NewsCard";
import type { HNItem } from "@/lib/hn";

const baseItem: HNItem = {
  id: 4242,
  type: "story",
  title: "Claude agents in production",
  url: "https://www.anthropic.com/news/example",
  score: 512,
  time: 1_700_000_000,
  descendants: 128,
};

describe("NewsCard", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders title and external link", () => {
    const nowSec = baseItem.time! + 120;
    vi.spyOn(Date, "now").mockReturnValue(nowSec * 1000);

    render(<NewsCard item={baseItem} rank={1} tone="latest" />);

    const link = screen.getByRole("link", { name: /Claude agents in production/i });
    expect(link).toHaveAttribute("href", baseItem.url);
    expect(link).toHaveAttribute("target", "_blank");
    expect(screen.getByText("#01")).toBeInTheDocument();
    expect(screen.getByText("512 pts")).toBeInTheDocument();
    expect(screen.getByText("2 min ago")).toBeInTheDocument();
  });

  it("links comments to HN discussion", () => {
    vi.spyOn(Date, "now").mockReturnValue((baseItem.time! + 60) * 1000);

    render(<NewsCard item={baseItem} showScore={false} />);

    const discuss = screen.getByRole("link", { name: /128 comments/i });
    expect(discuss).toHaveAttribute(
      "href",
      `https://news.ycombinator.com/item?id=${baseItem.id}`
    );
  });
});
