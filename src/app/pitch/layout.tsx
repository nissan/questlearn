import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pitch Deck",
  description:
    "QuestLearn — Cambridge EduX Hackathon 2026 pitch deck. AI-Incorporated Active Learning for Years 8–10, powered by CurricuLLM-AU and Laurillard's Conversational Framework.",
  openGraph: {
    title: "QuestLearn — Hackathon Pitch Deck",
    description:
      "Cambridge EduX Hackathon 2026 · Challenge 2: AI-Incorporated Active Learning. See how QuestLearn is transforming education with personalised AI-driven learning.",
    images: [{ url: "/og-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "QuestLearn — Hackathon Pitch Deck",
    images: ["/og-image.png"],
  },
};

export default function PitchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
