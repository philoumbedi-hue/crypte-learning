"use server";

import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/actions/notifications";

export async function getForumQuestions(videoId: string) {
    return await db.forumQuestion.findMany({
        where: { videoId },
        include: {
            user: {
                select: { name: true, role: true, image: true }
            },
            answers: {
                include: {
                    user: {
                        select: { name: true, role: true, image: true }
                    }
                },
                orderBy: { createdAt: "asc" }
            }
        },
        orderBy: { createdAt: "desc" }
    });
}

export async function postQuestion(videoId: string, content: string, title: string = "Question relative à la leçon") {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Non autorisé");

    const question = await db.forumQuestion.create({
        data: {
            videoId,
            content,
            title,
            userId: session.user.id
        }
    });

    const video = await db.video.findUnique({
        where: { id: videoId },
        include: { module: { select: { courseId: true } } }
    });

    if (video) {
        revalidatePath(`/courses/${video.module.courseId}/learn/${video.moduleId}/${videoId}`);
    }

    return question;
}

export async function postAnswer(questionId: string, content: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Non autorisé");

    const answer = await db.forumAnswer.create({
        data: {
            questionId,
            content,
            userId: session.user.id
        }
    });

    const question = await db.forumQuestion.findUnique({
        where: { id: questionId },
        include: {
            video: {
                include: { module: { select: { courseId: true } } }
            }
        }
    });

    if (question && question.video) {
        const link = `/courses/${question.video.module.courseId}/learn/${question.video.moduleId}/${question.videoId}`;

        // Notify the question author if someone else replied
        if (question.userId !== session.user.id) {
            await createNotification(
                question.userId,
                "Nouvelle Réponse au Forum \uD83D\uDDE3\uFE0F",
                `${session.user.name} a répondu à votre question : "${question.title}".`,
                "FORUM",
                link
            );
        }

        revalidatePath(link);
    }

    return answer;
}
