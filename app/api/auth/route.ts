import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = body.name?.trim() || null;
    const email = body.email?.trim().toLowerCase() || null;
    const mobile = body.mobile?.trim() || null;
    const password = body.password || "";

    if (!email && !mobile) {
      return NextResponse.json(
        { error: "Email ya mobile number zaroori hai." },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password kam se kam 6 characters ka hona chahiye." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(mobile ? [{ mobile }] : []),
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Ye email ya mobile pehle se registered hai." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        mobile,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "Account successfully create ho gaya.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);

    return NextResponse.json(
      { error: "Account create karne me problem hui." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}