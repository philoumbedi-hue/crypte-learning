import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireRoleAPI } from "@/lib/rbac";

export async function GET(
    request: Request,
    { params }: { params: { id: string, moduleId: string } }
) {
    const auth = await requireRoleAPI("TEACHER");
    if (auth instanceof NextResponse) return auth;
    const { session, userRole } = auth;

    try {
        // Ownership check via parent course
        const course = await prisma.course.findUnique({
            where: { id: params.id },
            select: { authorId: true }
        });

        if (userRole === "TEACHER" && course?.authorId !== session.user.id) {
            return new NextResponse("Forbidden: You are not the author of the course containing this module", { status: 403 });
        }

        const mod = await prisma.module.findUnique({
            where: { id: params.moduleId },
            select: { id: true, title: true, theoryContent: true }
        });

        if (!mod) {
            return new NextResponse("Module not found", { status: 404 });
        }

        // Parse theoryContent from string back to JSON for the editor
        let parsedContent = null;
        if (mod.theoryContent) {
            try {
                parsedContent = JSON.parse(mod.theoryContent);
            } catch {
                parsedContent = mod.theoryContent;
            }
        }

        return NextResponse.json({ ...mod, theoryContent: parsedContent });
    } catch (error) {
        console.error("[MODULE_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: { id: string, moduleId: string } }
) {
    const auth = await requireRoleAPI("TEACHER");
    if (auth instanceof NextResponse) return auth;
    const { session, userRole } = auth;

    try {
        const body = await request.json();
        const { content } = body;

        // Ownership check via parent course
        const course = await prisma.course.findUnique({
            where: { id: params.id },
            select: { authorId: true }
        });

        if (userRole === "TEACHER" && course?.authorId !== session.user.id) {
            return new NextResponse("Forbidden: You are not the author of the course containing this module", { status: 403 });
        }

        // Stringify JSON content to store in the String? field
        const theoryContent = typeof content === "string"
            ? content
            : JSON.stringify(content);

        const updatedModule = await prisma.module.update({
            where: { id: params.moduleId },
            data: { theoryContent }
        });

        return NextResponse.json(updatedModule);
    } catch (error) {
        console.error("[MODULE_SAVE]", error);
        return new NextResponse(`Internal Error: ${error}`, { status: 500 });
    }
}

