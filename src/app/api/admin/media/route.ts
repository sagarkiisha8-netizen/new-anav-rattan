import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getMediaItems, deleteMediaItem, updateMediaItem, getSiteContent } from '@/lib/db';
import { getImageUsages, isProtectedDefaultAsset } from '@/lib/imageUsage';

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [media, content] = await Promise.all([
      getMediaItems(),
      getSiteContent(),
    ]);

    // Enrich each media item with live section usages and protection status
    const enrichedMedia = media.map((item) => {
      const usages = getImageUsages(item.url, content);
      const isProtected = isProtectedDefaultAsset(item.url);
      return {
        ...item,
        usages,
        usageCount: usages.length,
        isProtected,
        safeToDelete: !isProtected && usages.length === 0,
      };
    });

    return NextResponse.json(
      { media: enrichedMedia, images: enrichedMedia },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (err: unknown) {
    console.error("GET /api/admin/media error:", err);
    return NextResponse.json({ error: "Failed to fetch media assets" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, title, alt, caption } = body;
    if (!id) {
      return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
    }

    const updated = await updateMediaItem(id, {
      ...(title !== undefined ? { title } : {}),
      ...(alt !== undefined ? { alt } : {}),
      ...(caption !== undefined ? { caption } : {}),
    });

    if (!updated) {
      return NextResponse.json({ error: 'Media item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: updated });
  } catch (err: unknown) {
    console.error("PATCH /api/admin/media error:", err);
    return NextResponse.json({ error: "Failed to update media item" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let id: string | null = null;
    let force = false;
    let forceProtected = false;
    let unlinkUsages = false;

    // Check query params first
    const { searchParams } = new URL(request.url);
    id = searchParams.get('id') || searchParams.get('url');
    if (searchParams.get('force') === 'true') force = true;
    if (searchParams.get('forceProtected') === 'true') forceProtected = true;
    if (searchParams.get('unlinkUsages') === 'true') unlinkUsages = true;

    // Also support JSON body if provided
    try {
      const body = await request.json();
      if (body.id) id = body.id;
      if (body.url && !id) id = body.url;
      if (body.force !== undefined) force = Boolean(body.force);
      if (body.forceProtected !== undefined) forceProtected = Boolean(body.forceProtected);
      if (body.unlinkUsages !== undefined) unlinkUsages = Boolean(body.unlinkUsages);
    } catch {
      // Body may be empty on query-param DELETE
    }

    if (!id) {
      return NextResponse.json({ error: 'Media ID or URL is required' }, { status: 400 });
    }

    const mediaList = await getMediaItems();
    const targetItem = mediaList.find((m) => m.id === id || m.url === id || m.filename === id);

    if (!targetItem) {
      return NextResponse.json({ error: 'Media asset not found in catalog' }, { status: 404 });
    }

    // Check if protected default system asset
    const isProtected = isProtectedDefaultAsset(targetItem.url);
    if (isProtected && !forceProtected) {
      return NextResponse.json(
        {
          error: `"${targetItem.filename}" is a protected default system asset. Deleting it requires explicit administrator override.`,
          isProtected: true,
          requireConfirmation: true,
        },
        { status: 403 }
      );
    }

    // Check current usage across the website
    const content = await getSiteContent();
    const usages = getImageUsages(targetItem.url, content);

    if (usages.length > 0 && !force && !unlinkUsages) {
      return NextResponse.json(
        {
          error: `Cannot delete "${targetItem.filename}" because it is currently used in ${usages.length} section(s).`,
          inUse: true,
          usages,
          requireConfirmation: true,
        },
        { status: 409 }
      );
    }

    // Perform deletion with unlinking if requested
    const result = await deleteMediaItem(targetItem.id, { unlinkFromContent: unlinkUsages });
    if (!result.success) {
      return NextResponse.json({ error: 'Failed to delete media asset from storage' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Deleted "${targetItem.filename}" successfully from media library and storage.`,
      unlinkedFromSections: unlinkUsages ? usages.length : 0,
      deletedItem: result.deletedItem,
    });
  } catch (err: unknown) {
    console.error("DELETE /api/admin/media error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete media item' },
      { status: 500 }
    );
  }
}
