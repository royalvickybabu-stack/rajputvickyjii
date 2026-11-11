
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Context = {
  params: Promise<{ id: string }>;
};

const COOKIE_NAME = "lok_survey_voter";

function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const surveyId = Number(id);

    if (!Number.isSafeInteger(surveyId) || surveyId <= 0) {
      return error("Invalid survey ID.");
    }

    const body = await request.json();

    const optionId = Number(body.optionId);
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const comment = typeof body.comment === "string" ? body.comment.trim() : "";

    if (!Number.isSafeInteger(optionId) || optionId <= 0) {
      return error("Please select a valid option.");
    }

    if (name.length > 80 || comment.length > 1000) {
      return error("Name or comment is too long.");
    }

    const now = new Date();

    const survey = await prisma.survey.findFirst({
      where: {
        id: surveyId,
        published: true,
        type: "POLL",
        AND: [
          { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
          { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
        ],
      },
      select: { id: true },
    });

    if (!survey) {
      return error("Survey is unavailable or voting is closed.", 404);
    }

    const option = await prisma.surveyOption.findFirst({
      where: { id: optionId, surveyId },
      select: { id: true },
    });

    if (!option) {
      return error("Selected option does not belong to this survey.");
    }

    const existingCookie = request.headers
      .get("cookie")
      ?.split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${COOKIE_NAME}=`))
      ?.slice(COOKIE_NAME.length + 1);

    const voterKey =
      existingCookie && /^[a-f0-9-]{36}$/i.test(existingCookie)
        ? existingCookie
        : randomUUID();

    await prisma.surveyVote.create({
      data: {
        surveyId,
        optionId,
        voterKey,
        name: name || null,
        comment: comment || null,
      },
    });

    const results = await prisma.surveyOption.findMany({
      where: { surveyId },
      orderBy: { position: "asc" },
      select: {
        id: true,
        text: true,
        _count: { select: { votes: true } },
      },
    });

    const totalVotes = results.reduce(
      (sum, item) => sum + item._count.votes,
      0
    );

    const response = NextResponse.json({
      success: true,
      message: "Your vote has been recorded.",
      totalVotes,
      results: results.map((item) => ({
        id: item.id,
        text: item.text,
        votes: item._count.votes,
        percentage:
          totalVotes > 0
            ? Number(((item._count.votes / totalVotes) * 100).toFixed(1))
            : 0,
      })),
    });

    response.cookies.set(COOKIE_NAME, voterKey, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });

    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (err) {
    if (
      err instanceof Error &&
      "code" in err &&
      err.code === "P2002"
    ) {
      return error("Aap is survey mein pehle hi vote kar chuke hain.", 409);
    }

    console.error("Survey vote error:", err);
    return error("Vote submit nahi ho paya.", 500);
  }
}
