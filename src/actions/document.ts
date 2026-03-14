"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireRole, logActivity, Actions } from "@/lib/rbac";


export async function createDocument(data: { title: string; url: string; moduleId: string }) {
    const session = await requireRole("ADMIN_CONTENT");

    const document = await db.document.create({
        data: {
            title: data.title,
            url: data.url,
            moduleId: data.moduleId,
        },
    });

    await logActivity({
        userId: session.user.id,
        action: Actions.UPDATE_COURSE, // Generic update for course/module resources
        entity: "Document",
        entityId: document.id,
        metadata: { title: document.title, action: "CREATED" }
    });


    const mod = await db.module.findUnique({ where: { id: data.moduleId } });
    if (mod) revalidatePath(`/admin/courses/${mod.courseId}`);

    return document;
}

export async function deleteDocument(id: string) {
    const session = await requireRole("ADMIN_CONTENT");

    const document = await db.document.delete({
        where: { id },
        include: { module: true }
    });

    await logActivity({
        userId: session.user.id,
        action: Actions.UPDATE_COURSE,
        entity: "Document",
        entityId: id,
        metadata: { title: document.title, action: "DELETED" }
    });


    revalidatePath(`/admin/courses/${document.module.courseId}`);
}
