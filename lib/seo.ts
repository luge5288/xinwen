export const siteConfig = {
  name: "AI News",
  defaultUrl: "http://localhost:3000",
  description:
    "A fast-scanning AI news digest built from Hacker News stories about models, agents, engineering, research, and AI products.",
  keywords: [
    "AI news",
    "Hacker News AI",
    "LLM news",
    "machine learning news",
    "AI engineering",
    "AI research",
    "OpenAI news",
    "Claude news",
    "Gemini news",
  ],
};

export function getSiteUrl(): string {
  const vercelUrl =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (vercelUrl ? `https://${vercelUrl}` : siteConfig.defaultUrl);

  try {
    const url = new URL(raw);
    return url.origin;
  } catch {
    return siteConfig.defaultUrl;
  }
}

export const faqItems = [
  {
    question: "What is AI News?",
    answer:
      "AI News is a focused digest of artificial intelligence stories from Hacker News, organized into hot, latest, and best-performing feeds.",
  },
  {
    question: "How often does AI News update?",
    answer:
      "The site refreshes server-side data every 60 seconds, so new AI stories and score changes can appear shortly after Hacker News updates.",
  },
  {
    question: "Where does the news data come from?",
    answer:
      "The site uses the public Hacker News Firebase API and links each story to its original source and Hacker News discussion thread.",
  },
  {
    question: "How are AI stories selected?",
    answer:
      "Stories are matched by AI-related title and URL keywords, including terms for large language models, agents, machine learning, inference, embeddings, and major AI products.",
  },
  {
    question: "Is AI News affiliated with Hacker News or Y Combinator?",
    answer:
      "No. AI News is an independent project that uses the public Hacker News API and provides attribution to the original data source.",
  },
];

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function websiteJsonLd(siteUrl = getSiteUrl()) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteUrl,
    description: siteConfig.description,
    inLanguage: "en-US",
  };
}
