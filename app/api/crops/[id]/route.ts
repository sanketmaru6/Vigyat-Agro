import { type NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import redis from "@/utils/db";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const crop = await redis.hgetall(`crops:${params.id}`);
    if (!crop) {
      return NextResponse.json({ error: "Crop not found" }, { status: 404 });
    }
    return NextResponse.json(crop);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch crop" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await requireAuth();
  if (authResult) {
    return authResult;
  }

  try {
    const body = await request.json();
    const existing = await redis.hgetall(`crops:${params.id}`);
    if (!existing) {
      return NextResponse.json({ error: "Crop not found" }, { status: 404 });
    }
    const updatedAt = new Date().toISOString();
    const updated = { ...existing, ...body, updatedAt };
    await redis.hset(`crops:${params.id}`, updated);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update crop" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await requireAuth();
  if (authResult) {
    return authResult;
  }

  try {
    const crop: { image?: string } | null = await redis.hgetall(`crops:${params.id}`);
    if (crop && crop.image && crop.image.startsWith("/api/images/")) {
      const imageId = crop.image.split("/").pop();
      if (imageId) {
        await redis.del(`images:${imageId}`);
      }
    }

    await redis.del(`crops:${params.id}`);
    await redis.srem("crops", params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete crop:", error);
    return NextResponse.json({ error: error.message || "Failed to delete crop" }, { status: 500 });
  }
}
