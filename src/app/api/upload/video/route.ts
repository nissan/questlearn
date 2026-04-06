import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB
const ALLOWED_TYPES = ["video/mp4", "video/quicktime"]; // mp4, mov
const ALLOWED_EXTENSIONS = [".mp4", ".mov"];

interface VideoMetadata {
  id: string;
  filename: string;
  title: string;
  description: string;
  uploadedAt: string;
  uploadedBy: string;
}

interface ShowcaseData {
  videos: VideoMetadata[];
}

function sanitizeFilename(name: string): string {
  // Remove path traversal attempts and special chars
  return name
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/\.{2,}/g, ".")
    .replace(/^[.-]+/, "")
    .slice(0, 100);
}

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    const expectedKey = process.env.UPLOAD_VIDEO_KEY;

    if (!expectedKey) {
      return NextResponse.json(
        { success: false, error: "Server misconfiguration: upload key not set" },
        { status: 500 }
      );
    }

    if (!key || key !== expectedKey) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: invalid or missing API key" },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const file = formData.get("file") as File | null;

    // Validate required fields
    if (!title || title.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Missing required field: title" },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Missing required field: file" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      return NextResponse.json(
        {
          success: false,
          error: `File too large: ${sizeMB} MB. Maximum allowed size is 500 MB.`,
        },
        { status: 400 }
      );
    }

    // Validate file type
    const fileExt = path.extname(file.name).toLowerCase();
    const isValidType =
      ALLOWED_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.includes(fileExt);

    if (!isValidType) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid file type: ${file.type || fileExt}. Only MP4 and MOV files are allowed.`,
        },
        { status: 400 }
      );
    }

    // Sanitize filename and generate unique name
    const baseName = sanitizeFilename(path.basename(file.name, fileExt));
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const safeFilename = `${timestamp}-${baseName}${fileExt.toLowerCase()}`;

    // Ensure showcase directory exists
    const showcaseDir = path.join(process.cwd(), "public", "showcase");
    if (!existsSync(showcaseDir)) {
      await mkdir(showcaseDir, { recursive: true });
    }

    // Save video file
    const filePath = path.join(showcaseDir, safeFilename);
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, fileBuffer);

    // Update metadata JSON
    const metadataPath = path.join(process.cwd(), "src", "lib", "showcase-videos.json");
    let showcaseData: ShowcaseData = { videos: [] };

    try {
      const existing = await readFile(metadataPath, "utf-8");
      showcaseData = JSON.parse(existing);
    } catch {
      // File doesn't exist or invalid JSON — start fresh
      showcaseData = { videos: [] };
    }

    const videoId = randomUUID();
    const videoMetadata: VideoMetadata = {
      id: videoId,
      filename: safeFilename,
      title: title.trim(),
      description: description ? description.trim().slice(0, 200) : "",
      uploadedAt: new Date().toISOString(),
      uploadedBy: "Anusha",
    };

    showcaseData.videos.push(videoMetadata);
    await writeFile(metadataPath, JSON.stringify(showcaseData, null, 2) + "\n");

    return NextResponse.json({
      success: true,
      videoId,
      filename: safeFilename,
      message: `Video "${title}" uploaded successfully!`,
      url: `/showcase/${safeFilename}`,
    });
  } catch (error) {
    console.error("Video upload error:", error);
    return NextResponse.json(
      { success: false, error: "Upload failed: internal server error" },
      { status: 500 }
    );
  }
}

// Required for Next.js App Router to handle large file uploads (500MB)
export const maxDuration = 60; // seconds
export const dynamic = "force-dynamic";
