
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";

function validateReporter(body: any) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const photo =
    typeof body.photo === "string" ? body.photo.trim() || null : null;
  const designation =
    typeof body.designation === "string"
      ? body.designation.trim() || null
      : null;
  const bio =
    typeof body.bio === "string" ? body.bio.trim() || null : null;

  if (!name || name.length > 100) {
    return { error: "Reporter name is required (maximum 100 characters)." };
  }

  if (designation && designation.length > 100) {
    return { error: "Designation cannot exceed 100 characters." };
  }

  if (bio && bio.length > 1000) {
    return { error: "Bio cannot exceed 1000 characters." };
  }

  if (photo) {
    try {
      const url = new URL(photo);
      if (!["http:", "https:"].includes(url.protocol)) {
        return { error: "Invalid photo URL." };
      }
    } catch {
      return { error: "Invalid photo URL." };
    }
  }

  return {
    data: { name, photo, designation, bio },
  };
}

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reporters = await prisma.reporter.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { news: true } },
      },
    });

    return NextResponse.json(reporters);
  } catch (error) {
    console.error("Reporter fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reporters." },
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
    const result = validateReporter(body);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const reporter = await prisma.reporter.create({
      data: {
        ...result.data!,
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json(reporter, { status: 201 });
  } catch (error) {
    console.error("Reporter create error:", error);
    return NextResponse.json(
      { error: "Failed to create reporter." },
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
    const id = Number(body.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Valid reporter ID required." }, { status: 400 });
    }

    const result = validateReporter(body);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    if (body.isActive !== undefined && typeof body.isActive !== "boolean") {
      return NextResponse.json({ error: "Invalid active status." }, { status: 400 });
    }

    const reporter = await prisma.reporter.update({
      where: { id },
      data: {
        ...result.data!,
        ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
      },
    });

    return NextResponse.json(reporter);
  } catch (error) {
    console.error("Reporter update error:", error);
    return NextResponse.json(
      { error: "Failed to update reporter." },
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
    const id = Number(body.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Valid reporter ID required." }, { status: 400 });
    }

    await prisma.reporter.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Reporter deleted successfully.",
    });
  } catch (error) {
    console.error("Reporter delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete reporter." },
      { status: 500 }
    );
  }
}
