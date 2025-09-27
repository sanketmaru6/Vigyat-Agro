import { type NextRequest, NextResponse } from "next/server"
import redis from "@/utils/db";
import { requireAuth } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const article = await redis.hgetall(`krushi_articles:${params.id}`);
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    return NextResponse.json(article);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch article" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await requireAuth();
  if (authResult) {
    return authResult;
  }

  try {
    const body = await request.json();
    const existing = await redis.hgetall(`krushi_articles:${params.id}`);
    if (!existing) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    const updatedAt = new Date().toISOString();
    const updated = { ...existing, ...body, updatedAt };
    await redis.hset(`krushi_articles:${params.id}`, updated);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await requireAuth();
  if (authResult) {
    return authResult;
  }

  try {
    const article: { image?: string } | null = await redis.hgetall(`krushi_articles:${params.id}`);
    if (article && article.image && article.image.startsWith("/api/images/")) {
      const imageId = article.image.split("/").pop();
      if (imageId) {
        await redis.del(`images:${imageId}`);
      }
    }

    await redis.del(`krushi_articles:${params.id}`);
    await redis.srem("krushi_articles", params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete article:", error);
    return NextResponse.json({ error: error.message || "Failed to delete article" }, { status: 500 });
  }
}
