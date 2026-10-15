import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNewsNotification } from "@/lib/sendNewsNotification";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";
    if (isAdmin && !(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const news = await prisma.news.findMany({
      where: isAdmin ? undefined : { published: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "News fetch à¤•à¤°à¤¨à¥‡ à¤®à¥‡à¤‚ à¤¸à¤®à¤¸à¥à¤¯à¤¾ à¤¹à¥à¤ˆ" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();

    const title = body.title?.trim() || "";
    const slug = body.slug?.trim() || "";
    const content = body.content?.trim() || "";
    const shortContent = body.shortContent?.trim() || "";

    if (!title || !slug) {
      return NextResponse.json(
        { error: "Title à¤”à¤° slug à¤œà¤°à¥‚à¤°à¥€ à¤¹à¥ˆà¤‚à¥¤" },
        { status: 400 }
      );
    }

    if (!content && !shortContent) {
      return NextResponse.json(
        {
          error:
            "à¤¯à¤¾ à¤¤à¥‹ Full News Content à¤¯à¤¾ News in 60 Words à¤œà¤°à¥‚à¤°à¥€ à¤¹à¥ˆà¥¤",
        },
        { status: 400 }
      );
    }

    const news = await prisma.news.create({
      data: {
        title,
        slug,
        content,
        shortContent: shortContent || null,
        image: body.image || null,
        category: body.category || "à¤…à¤¨à¥à¤¯",
        language: body.language || "hi",
        isTrending: body.isTrending ?? false,
        published: body.published ?? true,
      },
    });

    // à¤•à¥‡à¤µà¤² published news à¤•à¥‡ à¤²à¤¿à¤ notification à¤­à¥‡à¤œà¥‡à¤‚
    if (news.published) {
      try {
        await sendNewsNotification(
          news.title,
          news.slug
        );
      } catch (notificationError) {
        console.error(
          "News notification error:",
          notificationError
        );
      }
    }

    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "News create à¤•à¤°à¤¨à¥‡ à¤®à¥‡à¤‚ à¤¸à¤®à¤¸à¥à¤¯à¤¾ à¤¹à¥à¤ˆ" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "News ID à¤œà¤°à¥‚à¤°à¥€ à¤¹à¥ˆ" },
        { status: 400 }
      );
    }

    const title = body.title?.trim() || "";
    const slug = body.slug?.trim() || "";
    const content = body.content?.trim() || "";
    const shortContent = body.shortContent?.trim() || "";

    if (!title || !slug) {
      return NextResponse.json(
        { error: "Title à¤”à¤° slug à¤œà¤°à¥‚à¤°à¥€ à¤¹à¥ˆà¤‚à¥¤" },
        { status: 400 }
      );
    }

    if (!content && !shortContent) {
      return NextResponse.json(
        {
          error:
            "à¤¯à¤¾ à¤¤à¥‹ Full News Content à¤¯à¤¾ News in 60 Words à¤œà¤°à¥‚à¤°à¥€ à¤¹à¥ˆà¥¤",
        },
        { status: 400 }
      );
    }

    const news = await prisma.news.update({
      where: {
        id: Number(body.id),
      },
      data: {
        title,
        slug,
        content,
        shortContent: shortContent || null,
        image: body.image || null,
        category: body.category || "à¤…à¤¨à¥à¤¯",
        language: body.language || "hi",
        isTrending: body.isTrending ?? false,
        published: body.published ?? true,
      },
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "News update à¤•à¤°à¤¨à¥‡ à¤®à¥‡à¤‚ à¤¸à¤®à¤¸à¥à¤¯à¤¾ à¤¹à¥à¤ˆ" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "News ID à¤œà¤°à¥‚à¤°à¥€ à¤¹à¥ˆ" },
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
      message: "News delete à¤¹à¥‹ à¤—à¤ˆ",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "News delete à¤•à¤°à¤¨à¥‡ à¤®à¥‡à¤‚ à¤¸à¤®à¤¸à¥à¤¯à¤¾ à¤¹à¥à¤ˆ" },
      { status: 500 }
    );
  }
}
