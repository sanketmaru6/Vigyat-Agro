// app/api/test/route.ts
import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing MONGODB_URI in .env.local",
          hint: "Example: MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/vigyat",
        },
        { status: 500 },
      )
    }

    const client = await clientPromise
    const admin = client.db().admin()
    const ping = await admin.ping()
    const serverInfo = await admin.serverStatus()

    return NextResponse.json({ ok: true, ping, serverInfo })
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Failed to connect to MongoDB",
      },
      { status: 500 },
    )
  }
}
