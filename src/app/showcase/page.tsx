import { VideoGallery } from "@/components/showcase/VideoGallery";
import showcaseData from "@/lib/showcase-videos.json";

export const metadata = {
  title: "Showcase — QuestLearn Demo Videos",
  description: "Watch QuestLearn demo videos and walkthroughs.",
  robots: { index: false, follow: false },
};

export default function ShowcasePage() {
  const { videos } = showcaseData;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-1.5 mb-4">
            <span className="text-indigo-400 text-xs font-medium uppercase tracking-wider">
              QuestLearn
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Demo Showcase</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Explore QuestLearn in action — demos, walkthroughs, and feature previews.
          </p>
        </div>

        {/* Video count */}
        {videos.length > 0 && (
          <p className="text-sm text-gray-500 mb-6">
            {videos.length} video{videos.length !== 1 ? "s" : ""} available
          </p>
        )}

        {/* Gallery */}
        <VideoGallery videos={videos} />
      </div>
    </div>
  );
}
