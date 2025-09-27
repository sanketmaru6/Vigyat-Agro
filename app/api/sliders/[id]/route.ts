import { type NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import redis from "@/utils/db";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await requireAuth();
  if (authResult) {
    return authResult;
  }

  try {
    const slider: { image?: string } | null = await redis.hgetall(`sliders:${params.id}`);
    if (slider && slider.image && slider.image.startsWith("/api/images/")) {
      const imageId = slider.image.split("/").pop();
      if (imageId) {
        await redis.del(`images:${imageId}`);
      }
    }

    await redis.del(`sliders:${params.id}`);
    await redis.srem("sliders", params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete slider:", error);
    return NextResponse.json({ error: error.message || "Failed to delete slider" }, { status: 500 });
  }
}
