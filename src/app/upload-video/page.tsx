"use client";

import { useState, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB
const ALLOWED_EXTENSIONS = [".mp4", ".mov"];
const MAX_DESCRIPTION_LENGTH = 200;

function UploadVideoForm() {
  const searchParams = useSearchParams();
  const apiKey = searchParams.get("key") || "";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<{
    filename: string;
    url: string;
    message: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (f: File): string | null => {
    const ext = "." + f.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return `Invalid file type. Only MP4 and MOV files are accepted.`;
    }
    if (f.size > MAX_FILE_SIZE) {
      const sizeMB = (f.size / (1024 * 1024)).toFixed(1);
      return `File is too large (${sizeMB} MB). Maximum size is 500 MB.`;
    }
    return null;
  };

  const handleFileChange = (f: File | null) => {
    setFileError(null);
    setUploadSuccess(null);
    if (!f) {
      setFile(null);
      return;
    }
    const err = validateFile(f);
    if (err) {
      setFileError(err);
      setFile(null);
      return;
    }
    setFile(f);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileChange(dropped);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setUploadSuccess(null);

    if (!apiKey) {
      setError("Missing API key. Please use the link provided by your administrator.");
      return;
    }
    if (!title.trim()) {
      setError("Please enter a video title.");
      return;
    }
    if (!file) {
      setError("Please select a video file.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("file", file);

    // Simulate progress (XHR would give real progress, but fetch doesn't)
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 85) return prev;
        return prev + Math.random() * 15;
      });
    }, 300);

    try {
      const res = await fetch(`/api/upload/video?key=${encodeURIComponent(apiKey)}`, {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Upload failed. Please try again.");
        setUploadProgress(0);
        return;
      }

      setUploadProgress(100);
      setUploadSuccess({
        filename: data.filename,
        url: data.url,
        message: data.message,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      clearInterval(progressInterval);
      setError("Network error. Please check your connection and try again.");
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const fileSizeMB = file ? (file.size / (1024 * 1024)).toFixed(1) : null;

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-900 border border-red-500/40 rounded-2xl p-8 text-center">
          <div className="text-red-400 text-4xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold text-red-400 mb-2">Access Denied</h2>
          <p className="text-gray-400 text-sm">
            This page requires a valid API key. Please use the link provided by your
            administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-1.5 mb-4">
            <span className="text-indigo-400 text-xs font-medium uppercase tracking-wider">
              QuestLearn Internal
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Upload Demo Video</h1>
          <p className="text-gray-400 text-sm">
            Add a new video to the QuestLearn showcase. MP4 and MOV only, max 500 MB.
          </p>
        </div>

        {/* Success Banner */}
        {uploadSuccess && (
          <div className="mb-6 bg-green-500/10 border border-green-500/40 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-xl">✅</span>
              <div>
                <p className="text-green-400 font-semibold text-sm">{uploadSuccess.message}</p>
                <p className="text-gray-400 text-xs mt-1">
                  Filename:{" "}
                  <code className="text-green-300 bg-green-500/10 px-1 rounded">
                    {uploadSuccess.filename}
                  </code>
                </p>
                <a
                  href={uploadSuccess.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
                >
                  View video →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/40 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-red-400 text-xl">⚠️</span>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Video Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. CurricuLLM vs Cogniti Demo"
              disabled={isUploading}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Description{" "}
              <span className="text-gray-500 font-normal">
                ({description.length}/{MAX_DESCRIPTION_LENGTH})
              </span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESCRIPTION_LENGTH))}
              placeholder="Brief description of what this video demonstrates..."
              rows={3}
              disabled={isUploading}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none disabled:opacity-50 transition"
            />
          </div>

          {/* File Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Video File <span className="text-red-400">*</span>
            </label>

            {/* Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-indigo-500 bg-indigo-500/10"
                  : file
                  ? "border-green-500/50 bg-green-500/5"
                  : fileError
                  ? "border-red-500/50 bg-red-500/5"
                  : "border-gray-700 hover:border-gray-600 bg-gray-800/50"
              } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".mp4,.mov,video/mp4,video/quicktime"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                disabled={isUploading}
                className="hidden"
              />

              {file ? (
                <div>
                  <div className="text-2xl mb-2">🎬</div>
                  <p className="text-green-400 font-medium text-sm">{file.name}</p>
                  <p className="text-gray-500 text-xs mt-1">{fileSizeMB} MB</p>
                  <p className="text-gray-600 text-xs mt-2">Click to change file</p>
                </div>
              ) : (
                <div>
                  <div className="text-3xl mb-3">📁</div>
                  <p className="text-gray-300 text-sm font-medium">
                    Drop video here or click to browse
                  </p>
                  <p className="text-gray-500 text-xs mt-1">MP4 or MOV · Max 500 MB</p>
                </div>
              )}
            </div>

            {fileError && (
              <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                <span>⚠️</span> {fileError}
              </p>
            )}
          </div>

          {/* Progress Bar */}
          {isUploading && (
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>Uploading...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUploading || !file || !title.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-xl px-6 py-3 text-sm transition-all disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⟳</span> Uploading...
              </span>
            ) : (
              "Upload Video"
            )}
          </button>
        </form>

        <p className="text-center text-gray-600 text-xs mt-4">
          Videos are saved to the QuestLearn showcase folder and immediately accessible.
        </p>
      </div>
    </div>
  );
}

export default function UploadVideoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      }
    >
      <UploadVideoForm />
    </Suspense>
  );
}
