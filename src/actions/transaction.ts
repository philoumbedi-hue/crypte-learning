"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/actions/notifications";

export async function createTransaction(userId: string, courseId: string, amount: number, provider: string) {
    try {
        // Create the transaction record
        const transaction = await db.transaction.create({
            data: {
                userId,
                courseId,
                amount,
                provider,
                status: "SUCCESS", // Simulated success for now
            }
        });

        // Automatically enroll the user in the course upon successful payment
        await db.enrollment.upsert({
            where: {
                studentId_courseId: {
                    studentId: userId,
                    courseId: courseId,
                }
            },
            update: {
                status: "ENROLLED"
            },
            create: {
                studentId: userId,
                courseId: courseId,
                status: "ENROLLED"
            }
        });

        // Notify user
        const course = await db.course.findUnique({ where: { id: courseId }, select: { title: true } });
        if (course) {
            await createNotification(
                userId,
                "Inscription Validée \uD83D\uDE80",
                `Vous êtes officiellement inscrit au programme : ${course.title}. Bon apprentissage !`,
                "COURSE",
                `/courses/${courseId}`
            );
        }

        revalidatePath(`/courses/${courseId}`);
        revalidatePath(`/dashboard`);
        return { success: true, transactionId: transaction.id };
    } catch (error) {
        console.error("[TRANSACTION_ERROR]", error);
        throw new Error("Erreur lors de la transaction");
    }
}
