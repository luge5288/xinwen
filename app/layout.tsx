import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI News · Hacker News",
  description:
    "AI stories from the Hacker News public API: latest news, 24-hour picks, and weekly highlights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
