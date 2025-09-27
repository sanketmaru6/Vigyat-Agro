import { type NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import redis from "@/utils/db";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    const exists = await redis.exists("crops");
    if (!exists) {
      return NextResponse.json([]);
    }

    const cropIds = await redis.smembers("crops");
    if (cropIds.length === 0) {
      return NextResponse.json([]);
    }

    const pipeline = redis.pipeline();
    cropIds.forEach((id) => pipeline.hgetall(`crops:${id}`));
    const results: (any | null)[] = await pipeline.exec();

    const crops = results.filter((crop) => crop !== null);

    // Sort by createdAt descending
    crops.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(crops);
  } catch (error) {
    console.error("Failed to fetch crops:", error);
    return NextResponse.json({ error: "Failed to fetch crops" }, { status: 500 });
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
    const crop = { id, ...body, createdAt: now, updatedAt: now };

    await redis.sadd("crops", id);
    await redis.hset(`crops:${id}`, crop);

    return NextResponse.json(crop);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to add crop" }, { status: 500 });
  }
}
