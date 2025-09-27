import { type NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import redis from "@/utils/db";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await requireAuth();
  if (authResult) {
    return authResult;
  }

  try {
    await redis.del(`orders:${params.id}`);
    await redis.srem("orders", params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete order:", error);
    return NextResponse.json({ error: error.message || "Failed to delete order" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await requireAuth();
  if (authResult) {
    return authResult;
  }

  try {
    const body = await request.json();
    const existing = await redis.hgetall(`orders:${params.id}`);
    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    const updatedAt = new Date().toISOString();
    const updated = { ...existing, ...body, updatedAt };
    await redis.hset(`orders:${params.id}`, updated);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Failed to update order:", error);
    return NextResponse.json({ error: error.message || "Failed to update order" }, { status: 500 });
  }
}
