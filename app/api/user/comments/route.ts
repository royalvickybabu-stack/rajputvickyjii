
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/user-auth";

export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();

    if (userId === null) {
      return NextResponse.json(
        { error: "Dashboard dekhne ke liye login karein." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User account nahi mila. Dobara login karein." },
        { status: 401 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        content: true,
        createdAt: true,
        news: {
          select: {
            title: true,
            slug: true,
            published: true,
          },
        },
      },
    });

    return NextResponse.json({
      comments: comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        newsTitle: comment.news.title,
        newsSlug: comment.news.slug,
        newsPublished: comment.news.published,
      })),
    });
  } catch (error) {
    console.error("User comments GET error:", error);

    return NextResponse.json(
      { error: "Aapke comments load nahi ho paaye." },
      { status: 500 }
    );
  }
}
