
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

type Context = {
  params: Promise<{ id: string }>;
};

function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

// Admin: hide/unhide or delete a poll comment or direct response
export async function PATCH(request: NextRequest, context: Context) {
  try {
    if (!(await isAdminAuthenticated())) {
      return error("Unauthorized.", 401);
    }

    const { id } = await context.params;
    const surveyId = Number(id);

    if (!Number.isSafeInteger(surveyId) || surveyId <= 0) {
      return error("Invalid survey ID.");
    }

    const body = await request.json();
    const itemId = Number(body.itemId);
    const itemType = body.itemType;
    const hidden = body.hidden;

    if (!Number.isSafeInteger(itemId) || itemId <= 0) {
      return error("Invalid item ID.");
    }

    if (!["COMMENT", "RESPONSE"].includes(itemType)) {
      return error("Invalid item type.");
    }

    if (typeof hidden !== "boolean") {
      return error("Invalid moderation status.");
    }

    if (itemType === "COMMENT") {
      const result = await prisma.surveyVote.updateMany({
        where: {
          id: itemId,
          surveyId,
          comment: { not: null },
        },
        data: { commentHidden: hidden },
      });

      if (result.count === 0) {
        return error("Comment not found.", 404);
      }
    } else {
      const result = await prisma.surveyResponse.updateMany({
        where: {
          id: itemId,
          surveyId,
        },
        data: { hidden },
      });

      if (result.count === 0) {
        return error("Response not found.", 404);
      }
    }

    return NextResponse.json({
      success: true,
      message: hidden ? "Content hidden." : "Content visible.",
    });
  } catch (err) {
    console.error("Survey moderation error:", err);
    return error("Moderation failed.", 500);
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    if (!(await isAdminAuthenticated())) {
      return error("Unauthorized.", 401);
    }

    const { id } = await context.params;
    const surveyId = Number(id);

    if (!Number.isSafeInteger(surveyId) || surveyId <= 0) {
      return error("Invalid survey ID.");
    }

    const { searchParams } = new URL(request.url);
    const itemId = Number(searchParams.get("itemId"));
    const itemType = searchParams.get("itemType");

    if (!Number.isSafeInteger(itemId) || itemId <= 0) {
      return error("Invalid item ID.");
    }

    if (itemType === "COMMENT") {
      const result = await prisma.surveyVote.updateMany({
        where: {
          id: itemId,
          surveyId,
          comment: { not: null },
        },
        data: {
          comment: null,
          commentHidden: true,
        },
      });

      if (result.count === 0) {
        return error("Comment not found.", 404);
      }
    } else if (itemType === "RESPONSE") {
      const result = await prisma.surveyResponse.deleteMany({
        where: { id: itemId, surveyId },
      });

      if (result.count === 0) {
        return error("Response not found.", 404);
      }
    } else {
      return error("Invalid item type.");
    }

    return NextResponse.json({
      success: true,
      message: "Content deleted successfully.",
    });
  } catch (err) {
    console.error("Survey moderation delete error:", err);
    return error("Delete failed.", 500);
  }
}
