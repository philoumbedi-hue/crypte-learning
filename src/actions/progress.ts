"use server";

import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkAndIssueCertificate } from "@/actions/certificate";


export async function updateVideoProgress(videoId: string, timestamp: number, completed: boolean = false) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }

    const userId = session.user.id;

    const progress = await db.videoProgress.upsert({
        where: {
            studentId_videoId: {
                studentId: userId,
                videoId: videoId,
            },
        },
        update: {
            timestamp,
            completed: completed || timestamp > 0, // Optionnel: assurer la cohérence si déjà complété
        },
        create: {
            studentId: userId,
            videoId: videoId,
            timestamp,
            completed,
        },
    });

    if (completed) {
        // Trigger certificate check asynchronously
        try {
            const video = await db.video.findUnique({
                where: { id: videoId },
                include: { module: { select: { courseId: true } } }
            });
            if (video && video.module.courseId) {
                // Fire and forget (don't await) to not slow down the video player
                checkAndIssueCertificate(userId, video.module.courseId).catch(console.error);
            }
        } catch (error) {
            console.error("Error triggering certificate check:", error);
        }
    }

    return progress;
}

export async function saveVideoProgress(videoId: string, timestamp: number, completed: boolean = false) {
    try {
        await updateVideoProgress(videoId, timestamp, completed);
        return { success: true };
    } catch (error) {
        console.error("Error saving video progress:", error);
        return { error: "Erreur lors de la sauvegarde" };
    }
}

export async function getVideoProgress(videoId: string) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) return null;

    return await db.videoProgress.findUnique({
        where: {
            studentId_videoId: {
                studentId: session.user.id,
                videoId: videoId,
            },
        },
    });
}
