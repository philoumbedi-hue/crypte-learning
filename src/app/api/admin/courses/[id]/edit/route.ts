import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireRoleAPI } from "@/lib/rbac";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const auth = await requireRoleAPI("TEACHER");
    if (auth instanceof NextResponse) return auth;
    const { session, userRole } = auth;

    try {
        const course = await prisma.course.findUnique({
            where: { id: params.id },
            select: { id: true, title: true, content: true, authorId: true }
        });

        if (!course) {
            return new NextResponse("Course not found", { status: 404 });
        }

        // Ownership check for Teachers
        if (userRole === "TEACHER" && course.authorId !== session.user.id) {
            return new NextResponse("Forbidden: You are not the author of this course", { status: 403 });
        }

        return NextResponse.json(course);
    } catch {
        console.error("Error fetching course:");
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const auth = await requireRoleAPI("TEACHER");
    if (auth instanceof NextResponse) return auth;
    const { session, userRole } = auth;

    try {
        const { content } = await request.json();

        const course = await prisma.course.findUnique({
            where: { id: params.id },
            select: { authorId: true }
        });

        if (!course) {
            return new NextResponse("Course not found", { status: 404 });
        }

        // Ownership check for Teachers
        if (userRole === "TEACHER" && course.authorId !== session.user.id) {
            return new NextResponse("Forbidden: You are not the author of this course", { status: 403 });
        }

        // Update course + create version snapshot atomically
        await prisma.courseVersion.create({
            data: { courseId: params.id, content },
        });

        const updatedCourse = await prisma.course.update({
            where: { id: params.id },
            data: { content },
        });

        return NextResponse.json(updatedCourse);
    } catch {
        console.error("Error saving course:");
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

