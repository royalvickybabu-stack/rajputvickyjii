
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/user-auth";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { slug } = await params;
    const userId = await getAuthenticatedUserId();

    const news = await prisma.news.findFirst({
      where: { slug, published: true },
      select: { id: true },
    });

    if (!news) {
      return NextResponse.json(
        { error: "News not found" },
        { status: 404 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: { newsId: news.id },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        content: true,
        createdAt: true,
        userId: true,
      },
    });

    return NextResponse.json({
      comments: comments.map(({ userId: ownerId, ...comment }) => ({
        ...comment,
        isOwner: userId !== null && ownerId === userId,
      })),
      loggedIn: userId !== null,
    });
  } catch (error) {
    console.error("Comments GET error:", error);

    return NextResponse.json(
      { error: "Could not load comments" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: RouteContext
) {
  try {
    const userId = await getAuthenticatedUserId();

    if (userId === null) {
      return NextResponse.json(
        { error: "Comment karne ke liye pehle login karein." },
        { status: 401 }
      );
    }

    const { slug } = await params;
    const body = await request.json();

    const content =
      typeof body.content === "string" ? body.content.trim() : "";

    if (!content || content.length > 2000) {
      return NextResponse.json(
        { error: "Comment must be 1–2000 characters" },
        { status: 400 }
      );
    }

    const news = await prisma.news.findFirst({
      where: { slug, published: true },
      select: { id: true },
    });

    if (!news) {
      return NextResponse.json(
        { error: "News not found" },
        { status: 404 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, mobile: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User account nahi mila. Dobara login karein." },
        { status: 401 }
      );
    }

    const name =
      user.name?.trim() ||
      user.email ||
      user.mobile ||
      "User";

    const comment = await prisma.comment.create({
      data: {
        newsId: news.id,
        userId: user.id,
        name,
        content,
      },
      select: {
        id: true,
        name: true,
        content: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { comment: { ...comment, isOwner: true } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Comments POST error:", error);

    return NextResponse.json(
      { error: "Could not save comment" },
      { status: 500 }
    );
  }
}
