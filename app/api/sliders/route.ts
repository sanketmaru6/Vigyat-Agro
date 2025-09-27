import { type NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import redis from "@/utils/db";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    const sliderIds = await redis.smembers("sliders");
    if (sliderIds.length === 0) {
      return NextResponse.json([]);
    }
    const pipeline = redis.pipeline();
    sliderIds.forEach((id) => pipeline.hgetall(`sliders:${id}`));
    const sliders: any[] = await pipeline.exec();

    sliders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(sliders.filter(s => s !== null));
  } catch (error) {
    console.error("Failed to fetch sliders:", error);
    return NextResponse.json({ error: "Failed to fetch sliders" }, { status: 500 });
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
    const slider = { id, ...body, createdAt: now, updatedAt: now };

    await redis.sadd("sliders", id);
    await redis.hset(`sliders:${id}`, slider);

    return NextResponse.json(slider);
  } catch (error: any) {
    console.error("Failed to add slider:", error);
    return NextResponse.json({ error: error.message || "Failed to add slider" }, { status: 500 });
  }
}
