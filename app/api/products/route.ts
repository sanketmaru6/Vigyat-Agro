import { type NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import redis from "@/utils/db";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    const exists = await redis.exists("products");
    if (!exists) {
      return NextResponse.json([]);
    }

    const productIds = await redis.smembers("products");
    if (productIds.length === 0) {
      return NextResponse.json([]);
    }

    const pipeline = redis.pipeline();
    productIds.forEach((id) => pipeline.hgetall(`products:${id}`));
    const results: (any | null)[] = await pipeline.exec();

    const products = results.filter((product) => product !== null);

    // Sort by createdAt descending
    products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
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
    const product = { id, ...body, createdAt: now, updatedAt: now };

    const key = "products";
    const type = await redis.type(key);
    if (type !== "set" && type !== "none") {
      await redis.del(key);
    }

    await redis.sadd(key, id);
    await redis.hset(`products:${id}`, product);

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Failed to add product:", error);
    return NextResponse.json({ error: error.message || "Failed to add product" }, { status: 500 });
  }
}
