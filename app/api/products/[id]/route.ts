import { type NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import redis from "@/utils/db";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await redis.hgetall(`products:${params.id}`);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await requireAuth();
  if (authResult) {
    return authResult;
  }

  try {
    const body = await request.json();
    const existing = await redis.hgetall(`products:${params.id}`);
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const updatedAt = new Date().toISOString();
    const updated = { ...existing, ...body, updatedAt };
    await redis.hset(`products:${params.id}`, updated);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await requireAuth();
  if (authResult) {
    return authResult;
  }

  try {
    const product: { image?: string } | null = await redis.hgetall(`products:${params.id}`);
    if (product && product.image && product.image.startsWith("/api/images/")) {
      const imageId = product.image.split("/").pop();
      if (imageId) {
        await redis.del(`images:${imageId}`);
      }
    }

    await redis.del(`products:${params.id}`);
    await redis.srem("products", params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete product:", error);
    return NextResponse.json({ error: error.message || "Failed to delete product" }, { status: 500 });
  }
}
