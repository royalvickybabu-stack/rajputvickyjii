import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    console.log("Blob env check:", {
      hasToken: !!process.env.BLOB_READ_WRITE_TOKEN,
      hasStoreId: !!process.env.BLOB_STORE_ID,
      hasOidc: !!process.env.VERCEL_OIDC_TOKEN,
    });

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Image file à¤¨à¤¹à¥€à¤‚ à¤®à¤¿à¤²à¥€à¥¤" },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "à¤¸à¤¿à¤°à¥à¤« JPG, PNG, WEBP à¤¯à¤¾ GIF image upload à¤•à¤° à¤¸à¤•à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤",
        },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: "Image à¤•à¤¾ size 5 MB à¤¸à¥‡ à¤œà¥à¤¯à¤¾à¤¦à¤¾ à¤¨à¤¹à¥€à¤‚ à¤¹à¥‹à¤¨à¤¾ à¤šà¤¾à¤¹à¤¿à¤à¥¤",
        },
        { status: 400 }
      );
    }

    const extensionMap: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
    };

    const extension = extensionMap[file.type] || "jpg";
    const fileName = `uploads/${crypto.randomUUID()}.${extension}`;

    const token = process.env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
      return NextResponse.json(
        {
          error:
            "BLOB_READ_WRITE_TOKEN Next.js server à¤®à¥‡à¤‚ load à¤¨à¤¹à¥€à¤‚ à¤¹à¥‹ à¤°à¤¹à¤¾à¥¤ .env.local check à¤•à¤°à¥‡à¤‚ à¤”à¤° server restart à¤•à¤°à¥‡à¤‚à¥¤",
        },
        { status: 500 }
      );
    }

    const blob = await put(fileName, file, {
      access: "public",
      token,
    });

    console.log("Blob upload successful:", blob.url);

    return NextResponse.json({
      success: true,
      url: blob.url,
    });
  } catch (error) {
    console.error("Image upload error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown upload error",
      },
      { status: 500 }
    );
  }
}
