
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

export const USER_COOKIE = "lok_user_session";

const SESSION_SECONDS = 7 * 24 * 60 * 60;

type UserSession = {
  id: number;
  exp: number;
};

function getSecret() {
  return process.env.USER_SESSION_SECRET || "";
}

function sign(payload: string) {
  return createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
}

export function createUserToken(userId: number) {
  if (!getSecret()) {
    throw new Error("USER_SESSION_SECRET is not configured");
  }

  const payload = Buffer.from(
    JSON.stringify({
      id: userId,
      exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS,
    })
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

export function verifyUserToken(token: string): UserSession | null {
  try {
    if (!getSecret()) return null;

    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [payload, signature] = parts;
    const expected = Buffer.from(sign(payload));
    const actual = Buffer.from(signature);

    if (
      expected.length !== actual.length ||
      !timingSafeEqual(expected, actual)
    ) {
      return null;
    }

    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as UserSession;

    if (
      !Number.isSafeInteger(data.id) ||
      data.id <= 0 ||
      typeof data.exp !== "number" ||
      data.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return { id: data.id, exp: data.exp };
  } catch {
    return null;
  }
}

export async function getAuthenticatedUserId(): Promise<number | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_COOKIE)?.value;

  if (!token) return null;

  const session = verifyUserToken(token);
  return session?.id ?? null;
}

export const userCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_SECONDS,
};
