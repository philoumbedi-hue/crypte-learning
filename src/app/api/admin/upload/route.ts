import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { requireRoleAPI } from "@/lib/rbac";

export async function POST(request: Request) {
    const auth = await requireRoleAPI("TEACHER");
    if (auth instanceof NextResponse) return auth;

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return new NextResponse("No file uploaded", { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure uploads directory exists
        const uploadDir = join(process.cwd(), "public", "uploads");
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch {
            // Ignore if directory exists
        }

        const uniqueFileName = `${randomUUID()}-${file.name.replace(/\s+/g, "-")}`;
        const path = join(uploadDir, uniqueFileName);

        await writeFile(path, buffer);

        const fileUrl = `/uploads/${uniqueFileName}`;

        return NextResponse.json({ url: fileUrl });
    } catch (error) {
        console.error("[UPLOAD_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
