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

    const identifier = body.identifier?.trim() || "";
    const password = body.password || "";

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "ईमेल/मोबाइल और पासवर्ड दोनों जरूरी हैं।" },
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
        { error: "ईमेल/मोबाइल या पासवर्ड गलत है।" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "ईमेल/मोबाइल या पासवर्ड गलत है।" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: "लॉगिन सफल हुआ।",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { error: "लॉगिन करने में समस्या हुई।" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}