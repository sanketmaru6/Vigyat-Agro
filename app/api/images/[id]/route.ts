import { type NextRequest, NextResponse } from "next/server";
import redis from "@/utils/db";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const image: { data: string; mimeType: string } | null = await redis.hgetall(`images:${params.id}`);

    if (!image) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const buffer = Buffer.from(image.data, "base64");

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": image.mimeType,
      },
    });
  } catch (error: any) {
    console.error("Failed to fetch image:", error);
    return new NextResponse("Failed to fetch image", { status: 500 });
  }
}
