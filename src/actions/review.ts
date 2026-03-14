"use server";

import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getCourseReviews(courseId: string) {
    return await db.review.findMany({
        where: { courseId },
        include: {
            user: {
                select: { name: true, image: true, role: true }
            }
        },
        orderBy: { createdAt: "desc" }
    });
}

export async function postReview(courseId: string, content: string, rating?: number) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Non autorisé");

    const review = await db.review.create({
        data: {
            courseId,
            userId: session.user.id,
            content,
            rating
        }
    });

    revalidatePath(`/courses/${courseId}`);
    return review;
}
