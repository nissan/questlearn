import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Start a QuestLearn session — pick your topic, choose your format (quiz, flashcards, Socratic dialogue, concept map, or debate), and let AI guide you to mastery.",
  openGraph: {
    title: "QuestLearn — Start Learning",
    description:
      "Pick a topic. Choose your format. Let CurricuLLM-AU build you a personalised learning experience.",
    images: [{ url: "/og-image.png" }],
  },
};

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
