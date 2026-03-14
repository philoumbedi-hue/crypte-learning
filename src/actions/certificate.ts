"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/actions/notifications";

export async function checkAndIssueCertificate(userId: string, courseId: string) {
    try {
        // 1. Check if course exists and get modules
        const course = await db.course.findUnique({
            where: { id: courseId },
            include: {
                modules: {
                    include: {
                        videos: true,
                        quizzes: true
                    }
                }
            }
        });

        if (!course) throw new Error("Course not found");

        // 2. Count total required items (Videos + Quizzes)
        let totalItems = 0;
        const videoIds: string[] = [];
        const quizIds: string[] = [];

        course.modules.forEach(module => {
            module.videos.forEach(v => {
                if (v.isRequired) {
                    totalItems++;
                    videoIds.push(v.id);
                }
            });
            module.quizzes.forEach(q => {
                totalItems++;
                quizIds.push(q.id);
            });
        });

        // 3. Count completed items for this user
        const completedVideosCount = await db.videoProgress.count({
            where: {
                studentId: userId,
                videoId: { in: videoIds },
                completed: true
            }
        });

        // For quizzes, assume passing a quiz counts as completion.
        // As a simplification, we just check if there is a successful attempt (score >= passingScore).
        // If passingScore is null, any attempt counts.
        const passedQuizzes = await db.quizAttempt.findMany({
            where: {
                userId: userId,
                quizId: { in: quizIds },
            },
            include: { quiz: true }
        });

        // Unique passed quizzes
        const passedQuizIds = new Set(passedQuizzes.filter(attempt => {
            const passScore = attempt.quiz.passingScore || 50; // default 50%
            const maxScore = 100; // Assumed max
            const percentage = (attempt.score / maxScore) * 100;
            return percentage >= passScore;
        }).map(a => a.quizId));

        const completedItems = completedVideosCount + passedQuizIds.size;

        // 4. Validate 100% completion
        if (completedItems < totalItems) {
            return {
                ready: false,
                progress: Math.round((completedItems / (totalItems || 1)) * 100)
            };
        }

        // 5. Issue certificate if not already issued
        const existingCertificate = await db.certificate.findUnique({
            where: {
                studentId_courseId: {
                    studentId: userId,
                    courseId: courseId
                }
            }
        });

        if (existingCertificate) {
            return { ready: true, certificateId: existingCertificate.id };
        }

        const newCertificate = await db.certificate.create({
            data: {
                studentId: userId,
                courseId: courseId,
            }
        });

        // Notify user
        await createNotification(
            userId,
            "Certificat Obtenu \uD83C\uDF93",
            `Félicitations, vous avez complété le programme ${course.title} avec succès !`,
            "CERTIFICATE",
            `/dashboard`
        );

        revalidatePath(`/courses/${courseId}`);
        revalidatePath(`/dashboard`);
        return { ready: true, certificateId: newCertificate.id };

    } catch (error) {
        console.error("[CERTIFICATE_ERROR]", error);
        throw new Error("Failed to process certificate");
    }
}
