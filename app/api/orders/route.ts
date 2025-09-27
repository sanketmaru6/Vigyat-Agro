import { type NextRequest, NextResponse } from "next/server";
import redis from "@/utils/db";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    const key = "orders";
    const keyType = await redis.type(key);
    if (keyType !== "set") {
      // If key doesn't exist or is wrong type, return an empty list gracefully
      return NextResponse.json([]);
    }

    const orderIds = await redis.smembers(key);
    if (!orderIds || orderIds.length === 0) {
      return NextResponse.json([]);
    }

    const pipeline = redis.pipeline();
    orderIds.forEach((id) => pipeline.hgetall(`orders:${id}`));
    const results: (any | null)[] = await pipeline.exec();

    const parsedOrders = results
      .filter((o) => o && typeof o === "object")
      .map((order: any) => {
        let items: any[] = [];
        let customer: any = {};
        try {
          items = typeof order.items === "string" ? JSON.parse(order.items) : order.items || [];
        } catch {}
        try {
          customer = typeof order.customer === "string" ? JSON.parse(order.customer) : order.customer || {};
        } catch {}
        return { ...order, items, customer };
      });

    parsedOrders.sort((a, b) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime());

    return NextResponse.json(parsedOrders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customer, total } = body;

    if (!items || !customer || !total) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const id = randomUUID();
    const now = new Date().toISOString();
    const order = {
      id,
      items: JSON.stringify(items),
      customer: JSON.stringify(customer),
      total,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };

    await redis.sadd("orders", id);
    await redis.hset(`orders:${id}`, order);

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Failed to create order:", error);
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 });
  }
}
