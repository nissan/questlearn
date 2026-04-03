import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teacher Hub",
  description:
    "QuestLearn Teacher Hub — real-time heatmaps, student engagement insights, and AI-summarised conversation analytics to inform your teaching.",
  openGraph: {
    title: "QuestLearn — Teacher Hub",
    description:
      "Live student engagement heatmaps, topic difficulty signals, and AI-powered conversation insights — all in one dashboard.",
    images: [{ url: "/og-image.png" }],
  },
  robots: { index: false, follow: false },
};

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
