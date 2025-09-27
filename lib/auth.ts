import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function isAuthenticated(): Promise<boolean> {
  const authCookie = cookies().get("admin-auth");
  return authCookie?.value === "authenticated";
}

export async function requireAuth() {
  if (!(await isAuthenticated())) {
    return new NextResponse("Authentication required", { status: 401 });
  }
}
