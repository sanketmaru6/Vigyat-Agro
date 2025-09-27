import { type NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import redis from "@/utils/db";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    const exists = await redis.exists("krushi_articles");
    if (!exists) {
      return NextResponse.json([]);
    }

    const articleIds = await redis.smembers("krushi_articles");
    if (articleIds.length === 0) {
      return NextResponse.json([]);
    }

    const pipeline = redis.pipeline();
    articleIds.forEach((id) => pipeline.hgetall(`krushi_articles:${id}`));
    const results: (any | null)[] = await pipeline.exec();

    const articles = results.filter((article) => article !== null);

    // Sort by createdAt descending
    articles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if (authResult) {
    return authResult;
  }

  try {
    const body = await request.json();
    const id = randomUUID();
    const now = new Date().toISOString();
    const article = { id, ...body, createdAt: now, updatedAt: now };

    await redis.sadd("krushi_articles", id);
    await redis.hset(`krushi_articles:${id}`, article);

    return NextResponse.json(article);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to add article" }, { status: 500 });
  }
}
