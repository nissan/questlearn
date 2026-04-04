import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
import { PostHogProvider } from "@/components/PostHogProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://questlearn-nu.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "QuestLearn — AI-Powered Active Learning",
    template: "%s | QuestLearn",
  },
  description:
    "QuestLearn is an AI-powered learning platform for Years 8–10. Pick a topic, choose your format, and let CurricuLLM-AU guide you through Socratic active learning — then track your progress with real teacher insights.",
  keywords: [
    "AI learning",
    "active learning",
    "education technology",
    "CurricuLLM",
    "Socratic learning",
    "Years 8 10",
    "personalised learning",
    "edtech",
    "Lumina OS",
  ],
  authors: [{ name: "Redditech", url: "https://reddi.tech" }],
  creator: "Redditech",
  publisher: "Redditech",
  category: "Education",
  applicationName: "QuestLearn",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: BASE_URL,
    siteName: "QuestLearn",
    title: "QuestLearn — AI-Powered Active Learning for Years 8–10",
    description:
      "Learning sticks when you work for it. QuestLearn uses AI to generate personalised quizzes, flashcards, Socratic dialogue and more — built for active recall, not passive reading.",
    images: [
      {
        url: "/og-image.png",
        width: 1536,
        height: 1024,
        alt: "QuestLearn — AI-Powered Active Learning for Years 8–10",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QuestLearn — AI-Powered Active Learning",
    description:
      "Learning sticks when you work for it. Powered by CurricuLLM-AU.",
    images: ["/og-image.png"],
    creator: "@redditech",
    site: "@redditech",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/lumina-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/lumina-192.png", sizes: "192x192" }],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#f59e0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-AU"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="QuestLearn" />
        <link rel="apple-touch-icon" href="/icons/lumina-192.png" />
      </head>
      <body className="min-h-full flex flex-col">
        <JsonLd />
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
