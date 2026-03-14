"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createLiveSession(data: {
    title: string;
    description?: string;
    meetUrl: string;
    startTime: Date;
    endTime?: Date;
    courseId: string;
    status: string;
}) {
    const session = await db.liveSession.create({
        data: {
            title: data.title,
            description: data.description,
            meetUrl: data.meetUrl,
            startTime: data.startTime,
            endTime: data.endTime,
            courseId: data.courseId,
            status: data.status,
        },
    });

    revalidatePath("/admin/live-sessions");
    revalidatePath("/dashboard");
    return session;
}

export async function updateLiveSession(id: string, data: Partial<{
    title: string;
    description: string;
    meetUrl: string;
    startTime: Date;
    endTime: Date;
    status: string;
    courseId: string;
}>) {
    const session = await db.liveSession.update({
        where: { id },
        data,
    });

    revalidatePath("/admin/live-sessions");
    revalidatePath("/dashboard");
    return session;
}

export async function deleteLiveSession(id: string) {
    await db.liveSession.delete({
        where: { id },
    });

    revalidatePath("/admin/live-sessions");
    revalidatePath("/dashboard");
    revalidatePath("/live");
}

export async function updateLiveSessionStatus(id: string, status: "SCHEDULED" | "LIVE" | "FINISHED") {
    const session = await db.liveSession.update({
        where: { id },
        data: { status },
    });

    revalidatePath("/admin/live-sessions");
    revalidatePath("/dashboard");
    revalidatePath("/live");
    revalidatePath("/", "layout"); // Revalider absolument tout pour être sûr
    return session;
}

