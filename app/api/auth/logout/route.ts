
import { NextResponse } from "next/server";
import { USER_COOKIE, userCookieOptions } from "@/lib/user-auth";

export async function POST() {
  const response = NextResponse.json({
    message: "Logout successful.",
  });

  response.cookies.set(USER_COOKIE, "", {
    ...userCookieOptions,
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}
