import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Password login disabled hai. Google login use karein." },
    { status: 410 }
  );
}
