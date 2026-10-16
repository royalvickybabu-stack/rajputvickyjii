
import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  createUserToken,
  USER_COOKIE,
  userCookieOptions,
} from "@/lib/user-auth";

export const runtime = "nodejs";

function loginError(request: Request, reason: string) {
  return NextResponse.redirect(
    new URL(`/login?error=${encodeURIComponent(reason)}`, request.url)
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");
  const googleError = url.searchParams.get("error");

  const cookieState = request.headers
    .get("cookie")
    ?.split("; ")
    .find((item) => item.startsWith("google_oauth_state="))
    ?.split("=")
    .slice(1)
    .join("=");

  const decodedCookieState = cookieState
    ? decodeURIComponent(cookieState)
    : "";

  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (googleError) return loginError(request, "google_cancelled");

  if (
    !code ||
    !returnedState ||
    !decodedCookieState ||
    returnedState !== decodedCookieState
  ) {
    return loginError(request, "google_state_invalid");
  }

  if (!clientId || !clientSecret || !redirectUri) {
    return loginError(request, "google_config_missing");
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

    if (!tokenResponse.ok) {
      console.error("Google token exchange failed.");
      return loginError(request, "google_token_failed");
    }

    const tokenData = await tokenResponse.json();

    if (
      typeof tokenData.access_token !== "string" ||
      !tokenData.access_token
    ) {
      return loginError(request, "google_token_missing");
    }

    const profileResponse = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
        cache: "no-store",
      }
    );

    if (!profileResponse.ok) {
      console.error("Google user profile request failed.");
      return loginError(request, "google_profile_failed");
    }

    const profile = await profileResponse.json();

    if (
      typeof profile.sub !== "string" ||
      typeof profile.email !== "string" ||
      profile.email_verified !== true
    ) {
      return loginError(request, "google_email_unverified");
    }

    const email = profile.email.trim().toLowerCase();

    let user = await prisma.user.findUnique({
      where: { googleId: profile.sub },
    });

    if (!user) {
      const existingEmailUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingEmailUser) {
        if (
          existingEmailUser.googleId &&
          existingEmailUser.googleId !== profile.sub
        ) {
          return loginError(request, "google_account_conflict");
        }

        user = await prisma.user.update({
          where: { id: existingEmailUser.id },
          data: { googleId: profile.sub },
        });
      } else {
        const randomPassword = randomBytes(32).toString("hex");
        const passwordHash = await bcrypt.hash(randomPassword, 12);

        user = await prisma.user.create({
          data: {
            name:
              typeof profile.name === "string" ? profile.name : null,
            email,
            googleId: profile.sub,
            password: passwordHash,
          },
        });
      }
    }

    const response = NextResponse.redirect(new URL("/dashboard", request.url));

    response.cookies.set(
      USER_COOKIE,
      createUserToken(user.id),
      userCookieOptions
    );

    response.cookies.set("google_oauth_state", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth/google/callback",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Google callback failed:", error);
    return loginError(request, "google_login_failed");
  }
}
