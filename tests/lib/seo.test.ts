import { afterEach, describe, expect, it, vi } from "vitest";
import {
  faqJsonLd,
  getSiteUrl,
  siteConfig,
  websiteJsonLd,
} from "@/lib/seo";

describe("getSiteUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses site default when no env is set", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
    expect(getSiteUrl()).toBe(siteConfig.defaultUrl);
  });

  it("prefers NEXT_PUBLIC_SITE_URL origin", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://news.example.com/base");
    expect(getSiteUrl()).toBe("https://news.example.com");
  });

  it("falls back to default on invalid URL", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", ":::not-a-url");
    expect(getSiteUrl()).toBe(siteConfig.defaultUrl);
  });

  it("uses VERCEL_PROJECT_PRODUCTION_URL when site url unset", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "my-app.vercel.app");
    expect(getSiteUrl()).toBe("https://my-app.vercel.app");
  });
});

describe("JSON-LD helpers", () => {
  it("faqJsonLd matches FAQPage shape", () => {
    const data = faqJsonLd();
    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@type"]).toBe("FAQPage");
    expect(Array.isArray(data.mainEntity)).toBe(true);
    expect(data.mainEntity.length).toBeGreaterThan(0);
    expect(data.mainEntity[0]).toMatchObject({
      "@type": "Question",
      acceptedAnswer: { "@type": "Answer" },
    });
  });

  it("websiteJsonLd uses provided site url", () => {
    const data = websiteJsonLd("https://custom.example");
    expect(data.url).toBe("https://custom.example");
    expect(data.name).toBe(siteConfig.name);
    expect(data["@type"]).toBe("WebSite");
  });
});
