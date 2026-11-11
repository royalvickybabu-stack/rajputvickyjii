
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";

    if (isAdmin && !(await isAdminAuthenticated())) {
      return errorResponse("Unauthorized", 401);
    }

    const surveys = await prisma.survey.findMany({
      where: isAdmin ? undefined : { published: true },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            votes: true,
            responses: true,
          },
        },
      },
    });

    return NextResponse.json(surveys, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Survey GET error:", error);
    return errorResponse("Survey load nahi ho paya.", 500);
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();

    const title =
      typeof body.title === "string" ? body.title.trim() : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    const image =
      typeof body.image === "string" ? body.image.trim() : "";

    const type = body.type;
    const published = body.published === true;

    if (!title || title.length > 300) {
      return errorResponse("Valid survey question zaroori hai.");
    }

    if (type !== "POLL" && type !== "DIRECT") {
      return errorResponse("Invalid survey type.");
    }

    if (description.length > 3000) {
      return errorResponse("Description bahut lamba hai.");
    }

    if (image && !/^https:\/\//i.test(image)) {
      return errorResponse("Main image URL invalid hai.");
    }

    let options: {
      text: string;
      description: string | null;
      image: string | null;
      position: number;
    }[] = [];

    if (type === "POLL") {
      if (!Array.isArray(body.options) || body.options.length < 2) {
        return errorResponse("Poll ke liye minimum 2 options zaroori hain.");
      }

      options = body.options.map(
        (option: Record<string, unknown>, index: number) => {
          const text =
            typeof option.text === "string" ? option.text.trim() : "";

          const optionDescription =
            typeof option.description === "string"
              ? option.description.trim()
              : "";

          const optionImage =
            typeof option.image === "string" ? option.image.trim() : "";

          if (!text || text.length > 200) {
            throw new Error(`Option ${index + 1} ka text invalid hai.`);
          }

          if (optionDescription.length > 500) {
            throw new Error(`Option ${index + 1} ki description bahut lambi hai.`);
          }

          if (optionImage && !/^https:\/\//i.test(optionImage)) {
            throw new Error(`Option ${index + 1} ki image URL invalid hai.`);
          }

          return {
            text,
            description: optionDescription || null,
            image: optionImage || null,
            position: index,
          };
        }
      );
    }

    const survey = await prisma.survey.create({
      data: {
        title,
        description: description || null,
        image: image || null,
        type,
        published,
        options: {
          create: options,
        },
      },
      include: {
        options: true,
        _count: {
          select: {
            votes: true,
            responses: true,
          },
        },
      },
    });

    return NextResponse.json(
      { success: true, survey },
      { status: 201 }
    );
  } catch (error) {
    console.error("Survey POST error:", error);

    return errorResponse(
      error instanceof Error ? error.message : "Survey create nahi hua.",
      500
    );
  }
}
