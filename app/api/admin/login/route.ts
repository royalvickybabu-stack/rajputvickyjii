
import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import {
  ADMIN_COOKIE,
  createAdminToken,
  adminCookieOptions,
} from "@/lib/admin-auth";

function safeCompare(input: string, expected: string) {
  const inputBuffer = Buffer.from(input);
  const expectedBuffer = Buffer.from(expected);

  if (inputBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(inputBuffer, expectedBuffer);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const username =
      typeof body.username === "string" ? body.username.trim() : "";
    const password =
      typeof body.password === "string" ? body.password : "";

    const adminId = process.env.ADMIN_ID?.trim() || "";
    const adminPassword = process.env.ADMIN_PASSWORD || "";

    if (!adminId || !adminPassword || !process.env.ADMIN_SESSION_SECRET) {
      return NextResponse.json(
        { error: "Admin login configuration missing." },
        { status: 500 }
      );
    }

    const validUsername = safeCompare(username, adminId);
    const validPassword = safeCompare(password, adminPassword);

    if (!validUsername || !validPassword) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    const token = createAdminToken(adminId);

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
    });

    response.cookies.set(ADMIN_COOKIE, token, adminCookieOptions);

    return response;
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      { error: "Unable to login. Please try again." },
      { status: 500 }
    );
  }
}
