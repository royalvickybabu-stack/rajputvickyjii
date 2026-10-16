
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  createUserToken,
  USER_COOKIE,
  userCookieOptions,
} from "@/lib/user-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const identifier = body.identifier?.trim() || "";
    const password = body.password || "";

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Email/mobile aur password zaroori hain." },
        { status: 400 }
      );
    }

    const isEmail = identifier.includes("@");

    const user = await prisma.user.findFirst({
      where: isEmail
        ? { email: identifier.toLowerCase() }
        : { mobile: identifier },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Login details sahi nahi hain." },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Login details sahi nahi hain." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      message: "Login successful.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
    });

    response.cookies.set(
      USER_COOKIE,
      createUserToken(user.id),
      userCookieOptions
    );

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login mein server error aaya." },
      { status: 500 }
    );
  }
}
