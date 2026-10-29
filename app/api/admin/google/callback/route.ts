import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  createAdminToken,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

function fail(request: Request) {
  const response = NextResponse.redirect(
    new URL("/admin-login?error=google_login_failed", request.url)
  );

  response.cookies.set("admin_google_state", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/admin/google/callback",
    maxAge: 0,
  });

  return response;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const cookieHeader = request.headers.get("cookie") || "";
  const stateCookie = cookieHeader
    .split("; ")
    .find((item) => item.startsWith("admin_google_state="))
    ?.slice("admin_google_state=".length);

  const savedState = stateCookie ? decodeURIComponent(stateCookie) : "";

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.ADMIN_GOOGLE_REDIRECT_URI;
  const allowedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminId = process.env.ADMIN_ID?.trim();

  if (
    !code ||
    !state ||
    !savedState ||
    state !== savedState ||
    !clientId ||
    !clientSecret ||
    !redirectUri ||
    !allowedEmail ||
    !adminId ||
    !process.env.ADMIN_SESSION_SECRET
  ) {
    return fail(request);
  }

  try {
    const tokenResponse = await fetch(
      "https://oauth2.googleapis.com/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
        cache: "no-store",
      }
    );

    if (!tokenResponse.ok) return fail(request);

    const tokenData = await tokenResponse.json();

    if (typeof tokenData.access_token !== "string") return fail(request);

    const profileResponse = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
        cache: "no-store",
      }
    );

    if (!profileResponse.ok) return fail(request);

    const profile = await profileResponse.json();

    if (
      typeof profile.email !== "string" ||
      profile.email_verified !== true ||
      profile.email.trim().toLowerCase() !== allowedEmail
    ) {
      return fail(request);
    }

    const response = NextResponse.redirect(new URL("/admin", request.url));

    response.cookies.set(
      ADMIN_COOKIE,
      createAdminToken(adminId),
      adminCookieOptions
    );

    response.cookies.set("admin_google_state", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/admin/google/callback",
      maxAge: 0,
    });

    return response;
  } catch {
    return fail(request);
  }
}
