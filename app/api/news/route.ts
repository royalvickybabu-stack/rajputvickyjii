import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";

    const news = await prisma.news.findMany({
      where: isAdmin ? undefined : { published: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "News fetch करने में समस्या हुई" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json(
        { error: "Title, slug और content जरूरी हैं।" },
        { status: 400 }
      );
    }

    const news = await prisma.news.create({
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content,
        image: body.image || null,
        category: body.category || "अन्य",
        language: body.language || "hi",
        isTrending: body.isTrending || false,
        published: body.published ?? true,
      },
    });

    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "News create करने में समस्या हुई" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "News ID जरूरी है" },
        { status: 400 }
      );
    }

    const news = await prisma.news.update({
      where: {
        id: Number(body.id),
      },
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content,
        image: body.image || null,
        category: body.category || "अन्य",
        language: body.language || "hi",
        isTrending: body.isTrending ?? false,
        published: body.published ?? true,
      },
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "News update करने में समस्या हुई" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "News ID जरूरी है" },
        { status: 400 }
      );
    }

    await prisma.news.delete({
      where: {
        id: Number(body.id),
      },
    });

    return NextResponse.json({
      success: true,
      message: "News delete हो गई",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "News delete करने में समस्या हुई" },
      { status: 500 }
    );
  }
}