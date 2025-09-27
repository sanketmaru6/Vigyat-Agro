import { type NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import redis from "@/utils/db";

export async function GET() {
  try {
    const exists = await redis.exists("store_info:main");
    if (!exists) {
      return NextResponse.json({});
    }
    const info = await redis.hgetall("store_info:main");
    return NextResponse.json(info || {});
  } catch (error) {
    console.error("Failed to fetch store info:", error);
    return NextResponse.json({ error: "Failed to fetch store info" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authResult = await requireAuth();
  if (authResult) {
    return authResult;
  }

  try {
    const body = await request.json();

    const existing = await redis.hgetall("store_info:main");
    const now = new Date().toISOString();
    const storeInfo = {
      id: "main",
      ...(existing || {}),
      ...body,
      updatedAt: now,
      createdAt: existing?.createdAt || now,
    };

    await redis.hset("store_info:main", storeInfo);
    return NextResponse.json(storeInfo);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save store info" }, { status: 500 });
  }
}
