"use client";

import { useState } from "react";

interface VideoMetadata {
  id: string;
  filename: string;
  title: string;
  description: string;
  uploadedAt: string;
  uploadedBy: string;
}

interface VideoGalleryProps {
  videos: VideoMetadata[];
}

function VideoCard({ video }: { video: VideoMetadata }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoUrl = `/showcase/${video.filename}`;
  const uploadDate = new Date(video.uploadedAt).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all">
      {/* Video Player */}
      <div className="aspect-video bg-gray-950 relative group">
        {isPlaying ? (
          <video
            src={videoUrl}
            controls
            autoPlay
            className="w-full h-full object-contain"
            onEnded={() => setIsPlaying(false)}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center cursor-pointer group-hover:bg-gray-900/50 transition"
            onClick={() => setIsPlaying(true)}
          >
            <div className="w-16 h-16 bg-indigo-600/80 hover:bg-indigo-500 rounded-full flex items-center justify-center transition">
              <svg
                className="w-6 h-6 text-white ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{video.title}</h3>
        {video.description && (
          <p className="text-gray-400 text-xs mb-3 line-clamp-3">{video.description}</p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>{uploadDate}</span>
          <a
            href={videoUrl}
            download
            className="text-indigo-400 hover:text-indigo-300 transition"
            title="Download video"
          >
            ↓ Download
          </a>
        </div>
      </div>
    </div>
  );
}

export function VideoGallery({ videos }: VideoGalleryProps) {
  if (videos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-4">🎬</div>
        <p className="text-gray-400">No videos yet. Upload the first one!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}

export default VideoGallery;
