import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { endpoint, p256dh, auth, userId } = body;

    if (!endpoint || !p256dh || !auth) {
      return NextResponse.json(
        {
          error: "Notification subscription incomplete hai.",
        },
        { status: 400 }
      );
    }

    const subscription =
      await prisma.notificationSubscription.upsert({
        where: {
          endpoint,
        },
        update: {
          p256dh,
          auth,
        },
        create: {
          endpoint,
          p256dh,
          auth,
          userId: userId ?? null,
        },
      });

    return NextResponse.json({
      success: true,
      message: "Notification subscription save ho gayi.",
      id: subscription.id,
    });
  } catch (error) {
    console.error("Notification subscription error:", error);

    return NextResponse.json(
      {
        error: "Notification subscription save nahi ho payi.",
      },
      { status: 500 }
    );
  }
}