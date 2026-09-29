import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Image file नहीं मिली।" },
        { status: 400 }
      );
    }

    // केवल image files की अनुमति
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "सिर्फ JPG, PNG, WEBP या GIF image upload कर सकते हैं।" },
        { status: 400 }
      );
    }

    // Maximum 5 MB
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Image का size 5 MB से ज्यादा नहीं होना चाहिए।" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extensionMap: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
    };

    const extension = extensionMap[file.type] || "jpg";
    const fileName = `${randomUUID()}.${extension}`;

    const uploadDirectory = path.join(process.cwd(), "public", "uploads");

    await mkdir(uploadDirectory, { recursive: true });

    const filePath = path.join(uploadDirectory, fileName);

    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: imageUrl,
    });
  } catch (error) {
    console.error("Image upload error:", error);

    return NextResponse.json(
      { error: "Image upload करने में समस्या हुई।" },
      { status: 500 }
    );
  }
}