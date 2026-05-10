import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI 新闻 · Hacker News",
  description:
    "基于 Hacker News 公开 API 的 AI 相关报道：最新、24 小时内高票、一周内高票。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${sans.variable} ${mono.variable}`}>
      <body className="bg-zinc-950 font-sans text-zinc-200">{children}</body>
    </html>
  );
}
