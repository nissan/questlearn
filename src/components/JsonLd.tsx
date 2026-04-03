export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "QuestLearn",
    url: "https://questlearn-nu.vercel.app",
    description:
      "QuestLearn is an AI-powered active learning platform for Years 8–10. Students pick a topic and learning format; CurricuLLM-AU generates personalised quizzes, flashcards, Socratic dialogues, concept maps, and debates grounded in the Australian curriculum.",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
    },
    creator: {
      "@type": "Organization",
      name: "Redditech",
      url: "https://reddi.tech",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "AUD",
    },
    featureList: [
      "AI-generated quizzes",
      "Adaptive flashcards",
      "Socratic dialogue tutor",
      "Concept maps",
      "Debate practice",
      "Teacher engagement heatmap",
      "Active recall methodology",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
