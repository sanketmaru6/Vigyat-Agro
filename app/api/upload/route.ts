import { type NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import redis from "@/utils/db";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if (authResult) {
    return authResult;
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > 1024 * 1024) {
      return NextResponse.json({ error: "Image size must be less than 1MB" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const mimeType = file.type;
    const id = randomUUID();

    await redis.hset(`images:${id}`, {
      data: base64,
      mimeType: mimeType,
    });

    const url = `/api/images/${id}`;

    return NextResponse.json({ url });
  } catch (error: any) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
