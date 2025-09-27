import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Simple authentication - in production, use proper password hashing
    const adminUser = process.env.ADMIN_USER || "VigyatAgro"
    const adminPass = process.env.ADMIN_PASS || "Vigyat@gro9898"

    if (username === adminUser && password === adminPass) {
      // Set authentication cookie
      cookies().set("admin-auth", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 hours
      })

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
