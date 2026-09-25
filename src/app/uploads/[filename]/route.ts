import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const MIME_MAP: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  if (!filename) {
    return NextResponse.json({ error: "Filename is required" }, { status: 400 });
  }

  // Prevent path traversal
  const sanitized = path.basename(filename);

  // Check candidate locations: public/uploads and /tmp/uploads
  const candidates = [
    path.join(process.cwd(), "public", "uploads", sanitized),
    path.join("/tmp", "uploads", sanitized),
  ];

  for (const filePath of candidates) {
    try {
      const data = await fs.readFile(/*turbopackIgnore: true*/ filePath);
      const ext = path.extname(sanitized).toLowerCase();
      const contentType = MIME_MAP[ext] || "application/octet-stream";

      return new NextResponse(data, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      // Continue to next candidate
    }
  }

  // Fallback to persistent blob storage (Netlify Blobs)
  try {
    const { getMediaBlob } = await import("@/lib/db");
    const blob = await getMediaBlob(sanitized);
    if (blob && blob.buffer) {
      return new NextResponse(blob.buffer, {
        headers: {
          "Content-Type": blob.contentType || "application/octet-stream",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }
  } catch {
    // Ignore and proceed to 404
  }

  return NextResponse.json({ error: "File not found" }, { status: 404 });
}
