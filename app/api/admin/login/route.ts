import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  createAdminToken,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const expectedId = process.env.ADMIN_ID || "";
    const expectedPassword = process.env.ADMIN_PASSWORD || "";

    if (!expectedId || !expectedPassword || !process.env.ADMIN_SESSION_SECRET) {
      return NextResponse.json(
        { error: "Admin login server par configure nahi hai." },
        { status: 500 }
      );
    }

    const idBuffer = Buffer.from(id);
    const expectedIdBuffer = Buffer.from(expectedId);
    const passwordBuffer = Buffer.from(password);
    const expectedPasswordBuffer = Buffer.from(expectedPassword);

    const idMatches =
      idBuffer.length === expectedIdBuffer.length &&
      timingSafeEqual(idBuffer, expectedIdBuffer);
    const passwordMatches =
      passwordBuffer.length === expectedPasswordBuffer.length &&
      timingSafeEqual(passwordBuffer, expectedPasswordBuffer);

    if (!idMatches || !passwordMatches) {
      return NextResponse.json(
        { error: "Admin ID ya password galat hai." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(
      ADMIN_COOKIE,
      createAdminToken(expectedId),
      adminCookieOptions
    );
    return response;
  } catch {
    return NextResponse.json(
      { error: "Login request process nahi ho saki." },
      { status: 400 }
    );
  }
}
