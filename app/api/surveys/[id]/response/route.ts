
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Context = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const surveyId = Number(id);

    if (!Number.isSafeInteger(surveyId) || surveyId <= 0) {
      return NextResponse.json(
        { error: "Invalid survey ID." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";
    const content =
      typeof body.content === "string" ? body.content.trim() : "";

    if (!name || !content) {
      return NextResponse.json(
        { error: "Name aur answer dono zaroori hain." },
        { status: 400 }
      );
    }

    if (name.length > 80 || content.length > 2000) {
      return NextResponse.json(
        { error: "Name ya answer bahut lamba hai." },
        { status: 400 }
      );
    }

    const now = new Date();

    const survey = await prisma.survey.findFirst({
      where: {
        id: surveyId,
        published: true,
        type: "DIRECT",
        AND: [
          { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
          { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
        ],
      },
      select: { id: true },
    });

    if (!survey) {
      return NextResponse.json(
        { error: "Survey unavailable hai ya response band ho chuke hain." },
        { status: 404 }
      );
    }

    const response = await prisma.surveyResponse.create({
      data: {
        surveyId,
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

    return NextResponse.json({
      success: true,
      message: "Your response has been submitted.",
      response,
    });
  } catch (error) {
    console.error("Survey response error:", error);

    return NextResponse.json(
      { error: "Response submit nahi ho paya." },
      { status: 500 }
    );
  }
}
