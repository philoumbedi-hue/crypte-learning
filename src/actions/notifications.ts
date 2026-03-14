"use server";

import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
    const session = await getServerSession(authOptions);
    if (!session?.user) return [];

    return await db.notification.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 20
    });
}

export async function markAsRead(notificationId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return;

    await db.notification.update({
        where: { id: notificationId, userId: session.user.id },
        data: { isRead: true }
    });
}

export async function markAllAsRead() {
    const session = await getServerSession(authOptions);
    if (!session?.user) return;

    await db.notification.updateMany({
        where: { userId: session.user.id, isRead: false },
        data: { isRead: true }
    });

    // Attempting to revalidate common paths; you may want to refine this based on the layout
    revalidatePath("/", "layout");
}

export async function createNotification(userId: string, title: string, message: string, type: "SYSTEM" | "COURSE" | "FORUM" | "CERTIFICATE" = "SYSTEM", link?: string) {
    return await db.notification.create({
        data: {
            userId,
            title,
            message,
            type,
            link
        }
    });
}
