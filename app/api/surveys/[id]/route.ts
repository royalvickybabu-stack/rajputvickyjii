
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

type Context = {
  params: Promise<{ id: string }>;
};

async function getSurveyId(context: Context) {
  const { id } = await context.params;
  const surveyId = Number(id);

  if (!Number.isSafeInteger(surveyId) || surveyId <= 0) {
    throw new Error("Invalid survey ID.");
  }

  return surveyId;
}

function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

// GET: Public survey details and admin details
export async function GET(request: Request, context: Context) {
  try {
    const isAdmin = await isAdminAuthenticated();
    const id = await getSurveyId(context);

    const survey = await prisma.survey.findFirst({
      where: isAdmin ? { id } : { id, published: true },
      include: {
        options: {
          orderBy: { position: "asc" },
          include: {
            _count: {
              select: { votes: true },
            },
          },
        },
        votes: {
          where: isAdmin
            ? { comment: { not: null } }
            : {
                comment: { not: null },
                commentHidden: false,
              },
          select: {
            id: true,
            name: true,
            comment: true,
            commentHidden: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
        responses: {
          where: isAdmin ? undefined : { hidden: false },
          select: {
            id: true,
            name: true,
            content: true,
            hidden: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            votes: true,
            responses: true,
          },
        },
      },
    });

    if (!survey) return error("Survey not found.", 404);

    return NextResponse.json(survey, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    return error(
      err instanceof Error ? err.message : "Survey load failed."
    );
  }
}

// PUT: Admin updates survey
export async function PUT(request: Request, context: Context) {
  try {
    if (!(await isAdminAuthenticated())) {
      return error("Unauthorized", 401);
    }

    const id = await getSurveyId(context);
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

    if (!title || title.length > 300) {
      return error("Valid survey question is required.");
    }

    if (description.length > 3000) {
      return error("Description is too long.");
    }

    if (image && !/^https:\/\//i.test(image)) {
      return error("Main image URL is invalid.");
    }

    if (type !== "POLL" && type !== "DIRECT") {
      return error("Invalid survey type.");
    }

    const existing = await prisma.survey.findUnique({
      where: { id },
      include: {
        options: { orderBy: { position: "asc" } },
        _count: {
          select: { votes: true, responses: true },
        },
      },
    });

    if (!existing) return error("Survey not found.", 404);

    const hasParticipation =
      existing._count.votes > 0 || existing._count.responses > 0;

    if (existing.type !== type && hasParticipation) {
      return error(
        "Votes or answers already exist. Survey type cannot be changed."
      );
    }

    let options: {
      id?: number;
      text: string;
      description: string | null;
      image: string | null;
      position: number;
    }[] = [];

    if (type === "POLL") {
      if (!Array.isArray(body.options) || body.options.length < 2) {
        return error("Minimum 2 options are required.");
      }

      try {
        options = body.options.map(
          (option: Record<string, unknown>, index: number) => {
            const optionId =
              typeof option.id === "number" && Number.isSafeInteger(option.id)
                ? option.id
                : undefined;
            if (option.id !== undefined && optionId === undefined) {
              throw new Error(`Option ${index + 1} has an invalid ID.`);
            }
            const text =
              typeof option.text === "string" ? option.text.trim() : "";

            const desc =
              typeof option.description === "string"
                ? option.description.trim()
                : "";

            const optionImage =
              typeof option.image === "string" ? option.image.trim() : "";

            if (!text || text.length > 200) {
              throw new Error(`Option ${index + 1} is invalid.`);
            }

            if (desc.length > 500) {
              throw new Error(
                `Option ${index + 1} description is too long.`
              );
            }

            if (optionImage && !/^https:\/\//i.test(optionImage)) {
              throw new Error(`Option ${index + 1} image URL is invalid.`);
            }

            return {
              id: optionId,
              text,
              description: desc || null,
              image: optionImage || null,
              position: index,
            };
          }
        );
      } catch (err) {
        return error(
          err instanceof Error ? err.message : "Invalid options."
        );
      }
    }

    let newOptionsToAdd: typeof options = [];

    if (
      existing.type === "POLL" &&
      type === "POLL" &&
      existing._count.votes > 0
    ) {
      const unmatchedExisting = [...existing.options];

      for (const incoming of options) {
        const matchIndex = unmatchedExisting.findIndex(
          (old) =>
            old.text === incoming.text &&
            (old.description ?? null) === incoming.description &&
            (old.image ?? null) === incoming.image
        );

        if (matchIndex >= 0) {
          unmatchedExisting.splice(matchIndex, 1);
        } else {
          newOptionsToAdd.push(incoming);
        }
      }

      if (unmatchedExisting.length > 0) {
        return error("Existing poll options cannot be removed or edited.");
      }
    }
    const survey = await prisma.$transaction(async (tx) => {
      if (existing.type === "POLL" && type === "DIRECT") {
        await tx.surveyOption.deleteMany({
          where: { surveyId: id },
        });
      } else if (type === "POLL" && existing._count.votes > 0) {
        const newOptions = newOptionsToAdd;
        const nextPosition =
          existing.options.reduce(
            (max, option) => Math.max(max, option.position),
            -1
          ) + 1;

        if (newOptions.length > 0) {
          await tx.surveyOption.createMany({
            data: newOptions.map((option, index) => ({
              text: option.text,
              description: option.description,
              image: option.image,
              position: nextPosition + index,
              surveyId: id,
            })),
          });
        }
      } else if (type === "POLL" && existing._count.votes === 0) {
        await tx.surveyOption.deleteMany({
          where: { surveyId: id },
        });

        await tx.surveyOption.createMany({
          data: options.map(({ id: _optionId, ...option }) => ({
            ...option,
            surveyId: id,
          })),
        });
      }

      return tx.survey.update({
        where: { id },
        data: {
          title,
          description: description || null,
          image: image || null,
          type,
          published: body.published === true,
        },
        include: {
          options: { orderBy: { position: "asc" } },
          _count: {
            select: { votes: true, responses: true },
          },
        },
      });
    });

    return NextResponse.json({
      success: true,
      survey,
    });
  } catch (err) {
    console.error("Survey PUT error:", err);

    return error(
      err instanceof Error ? err.message : "Survey update failed.",
      500
    );
  }
}

// DELETE: Admin deletes survey
export async function DELETE(request: Request, context: Context) {
  try {
    if (!(await isAdminAuthenticated())) {
      return error("Unauthorized", 401);
    }

    const id = await getSurveyId(context);

    const existing = await prisma.survey.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) return error("Survey not found.", 404);

    await prisma.survey.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Survey deleted successfully.",
    });
  } catch (err) {
    console.error("Survey DELETE error:", err);
    return error("Survey delete failed.", 500);
  }
}
