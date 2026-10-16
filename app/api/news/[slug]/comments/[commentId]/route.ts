
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/user-auth";

type RouteContext = {
  params: Promise<{ slug: string; commentId: string }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const userId = await getAuthenticatedUserId();

    if (userId === null) {
      return NextResponse.json(
        { error: "Comment edit karne ke liye login karein." },
        { status: 401 }
      );
    }

    const { slug, commentId: rawCommentId } = await params;
    const commentId = Number(rawCommentId);

    if (!Number.isSafeInteger(commentId) || commentId <= 0) {
      return NextResponse.json(
        { error: "Invalid comment ID." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const content =
      typeof body.content === "string" ? body.content.trim() : "";

    if (!content || content.length > 2000) {
      return NextResponse.json(
        { error: "Comment must be 1–2000 characters." },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.findFirst({
      where: {
        id: commentId,
        userId,
        news: { slug, published: true },
      },
      select: { id: true },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comment nahi mila ya aapko ise edit karne ki permission nahi hai." },
        { status: 404 }
      );
    }

    const updatedComment = await prisma.comment.update({
      where: { id: comment.id },
      data: { content },
      select: {
        id: true,
        name: true,
        content: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      comment: { ...updatedComment, isOwner: true },
    });
  } catch (error) {
    console.error("Comment PATCH error:", error);

    return NextResponse.json(
      { error: "Comment update nahi ho paya." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const userId = await getAuthenticatedUserId();

    if (userId === null) {
      return NextResponse.json(
        { error: "Comment delete karne ke liye login karein." },
        { status: 401 }
      );
    }

    const { slug, commentId: rawCommentId } = await params;
    const commentId = Number(rawCommentId);

    if (!Number.isSafeInteger(commentId) || commentId <= 0) {
      return NextResponse.json(
        { error: "Invalid comment ID." },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.findFirst({
      where: {
        id: commentId,
        userId,
        news: { slug, published: true },
      },
      select: { id: true },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comment nahi mila ya aapko ise delete karne ki permission nahi hai." },
        { status: 404 }
      );
    }

    await prisma.comment.delete({
      where: { id: comment.id },
    });

    return NextResponse.json({ message: "Comment delete ho gaya." });
  } catch (error) {
    console.error("Comment DELETE error:", error);

    return NextResponse.json(
      { error: "Comment delete nahi ho paya." },
      { status: 500 }
    );
  }
}
