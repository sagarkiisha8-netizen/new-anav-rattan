import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getSiteContent, updateSiteContent } from "@/lib/db";
import { SiteContent } from "@/lib/types";

// Public GET so public pages or client components can fetch latest content
export async function GET() {
  try {
    const content = await getSiteContent();
    return NextResponse.json({ ...content, content });
  } catch (err: any) {
    console.error("Error reading content:", err);
    return NextResponse.json({ error: "Failed to read content" }, { status: 500 });
  }
}

// Protected PUT to update entire or partial content
export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const current = await getSiteContent();

    // If whole content or section update
    const updatedContent: SiteContent = {
      ...current,
      ...body,
    };

    await updateSiteContent(updatedContent);
    return NextResponse.json({ success: true, content: updatedContent });
  } catch (err: any) {
    console.error("Error updating content:", err);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
