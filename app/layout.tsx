import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 新闻雷达 · Hacker News",
  description:
    "基于 Hacker News 公开 API 的 AI 相关报道：最新新闻、24 小时精选、一周精选。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
