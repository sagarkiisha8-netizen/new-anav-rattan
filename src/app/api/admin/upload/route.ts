import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getAdminSession } from "@/lib/auth";
import { addMediaItem } from "@/lib/db";
import { MediaItem } from "@/lib/types";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string) || "";
    const alt = (formData.get("alt") as string) || "";
    const caption = (formData.get("caption") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Only image files (JPEG, PNG, WebP, SVG, GIF) are allowed" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size exceeds 10MB limit" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").toLowerCase();
    const uniqueName = `${Date.now()}-${cleanName}`;
    
    // Serverless-resilient upload directory
    const isServerless = Boolean(process.env.NETLIFY || process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
    let uploadDir = process.env.UPLOAD_DIR || (isServerless ? path.join("/tmp", "uploads") : path.join(process.cwd(), "public", "uploads"));

    try {
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, uniqueName), buffer);
    } catch {
      // If primary upload directory is read-only (serverless), fallback to /tmp/uploads
      uploadDir = path.join("/tmp", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, uniqueName), buffer);
    }

    const relativeUrl = `/uploads/${uniqueName}`;

    const mediaItem: MediaItem = {
      id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      url: relativeUrl,
      filename: uniqueName,
      title: title || file.name,
      alt: alt || title || file.name,
      caption: caption || undefined,
      sizeBytes: file.size,
      size: file.size,
      mimeType: file.type || 'image/jpeg',
      uploadedAt: new Date().toISOString()
    };

    await addMediaItem(mediaItem);

    return NextResponse.json({ success: true, item: mediaItem, mediaItem });
  } catch (err: unknown) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
