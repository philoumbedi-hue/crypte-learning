import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireRoleAPI } from "@/lib/rbac";

export async function GET(
    request: Request,
    { params }: { params: { id: string, moduleId: string, lessonId: string } }
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
            return new NextResponse("Forbidden: You are not the author of the course containing this lesson", { status: 403 });
        }

        const lesson = await prisma.video.findUnique({
            where: { id: params.lessonId },
            select: { id: true, title: true, content: true }
        });

        if (!lesson) {
            return new NextResponse("Lesson not found", { status: 404 });
        }

        // Parse content from string back to JSON for the editor
        let parsedContent = null;
        if (lesson.content) {
            try {
                parsedContent = JSON.parse(lesson.content);
            } catch {
                parsedContent = lesson.content;
            }
        }

        return NextResponse.json({ ...lesson, content: parsedContent });
    } catch (error) {
        console.error("[LESSON_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: { id: string, moduleId: string, lessonId: string } }
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
            return new NextResponse("Forbidden: You are not the author of the course containing this lesson", { status: 403 });
        }

        // Stringify JSON content to store in the String? field
        const stringifiedContent = typeof content === "string"
            ? content
            : JSON.stringify(content);

        const updatedLesson = await prisma.video.update({
            where: { id: params.lessonId },
            data: { content: stringifiedContent }
        });

        return NextResponse.json(updatedLesson);
    } catch (error) {
        console.error("[LESSON_SAVE]", error);
        return new NextResponse(`Internal Error: ${error}`, { status: 500 });
    }
}

