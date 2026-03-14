"use server";

import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function enrollInCourse(courseId: string) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        throw new Error("Vous devez être connecté pour vous inscrire.");
    }

    const userId = session.user.id;

    // Check if already enrolled
    const existingEnrollment = await db.enrollment.findUnique({
        where: {
            studentId_courseId: {
                studentId: userId,
                courseId: courseId,
            },
        },
    });

    if (existingEnrollment) {
        return existingEnrollment;
    }

    const enrollment = await db.enrollment.create({
        data: {
            studentId: userId,
            courseId: courseId,
        },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/courses/${courseId}`);

    return enrollment;
}

export async function getEnrollmentStatus(courseId: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return null;

    return await db.enrollment.findUnique({
        where: {
            studentId_courseId: {
                studentId: session.user.id,
                courseId: courseId,
            },
        },
    });
}
