"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireRole, logActivity, Actions } from "@/lib/rbac";



export async function createVideo(data: {
    title: string;
    url: string;
    moduleId: string;
    description?: string;
    duration?: number;
    type?: string;
    isRequired?: boolean;
    order?: number;
}) {
    const session = await requireRole("TEACHER");

    // Vérifier si l'utilisateur est l'auteur du cours parent
    const moduleParent = await db.module.findUnique({
        where: { id: data.moduleId },
        include: { course: { select: { authorId: true, id: true } } }
    });

    if (!moduleParent) throw new Error("Module non trouvé");

    if (session.user.role === "TEACHER" && moduleParent.course.authorId !== session.user.id) {
        throw new Error("FORBIDDEN: Vous n'avez pas le droit d'ajouter des vidéos à ce cours.");
    }

    const video = await db.video.create({
        data: {
            title: data.title,
            url: data.url,
            moduleId: data.moduleId,
            description: data.description,
            duration: data.duration,
            type: data.type,
            isRequired: data.isRequired ?? true,
            order: data.order ?? 0,
        },
    });

    await logActivity({
        userId: session.user.id,
        action: Actions.ADD_VIDEO,
        entity: "Video",
        entityId: video.id,
    });


    revalidatePath(`/admin/courses/${moduleParent.course.id}`);

    return video;
}


export async function updateVideo(id: string, data: {
    title: string;
    url: string;
    description?: string;
    duration?: number;
    type?: string;
}) {
    const session = await requireRole("TEACHER");

    // Contrôle de propriété : On vérifie si l'enseignant est l'auteur du cours parent
    const videoToUpdate = await db.video.findUnique({
        where: { id },
        include: {
            module: {
                select: {
                    course: {
                        select: {
                            authorId: true
                        }
                    }
                }
            }
        }
    });

    if (!videoToUpdate) throw new Error("Vidéo non trouvée");

    if (session.user.role === "TEACHER" && videoToUpdate.module.course.authorId !== session.user.id) {
        throw new Error("FORBIDDEN: Vous n'êtes pas l'auteur du cours associé à cette vidéo.");
    }

    const video = await db.video.update({
        where: { id },
        data: {
            title: data.title,
            url: data.url,
            description: data.description,
            duration: data.duration,
            type: data.type,
        },
        include: { module: true }
    });

    await logActivity({
        userId: session.user.id,
        action: Actions.UPDATE_VIDEO,
        entity: "Video",
        entityId: id,
    });

    revalidatePath(`/admin/courses/${video.module.courseId}`);
    return video;
}

export async function deleteVideo(id: string) {
    const session = await requireRole("TEACHER");

    const videoToDelete = await db.video.findUnique({
        where: { id },
        include: {
            module: {
                select: {
                    course: {
                        select: {
                            authorId: true,
                            id: true
                        }
                    }
                }
            }
        }
    });

    if (!videoToDelete) throw new Error("Vidéo non trouvée");

    if (session.user.role === "TEACHER" && videoToDelete.module.course.authorId !== session.user.id) {
        throw new Error("FORBIDDEN: Vous n'êtes pas l'auteur du cours associé à cette vidéo.");
    }

    await db.video.delete({
        where: { id }
    });

    await logActivity({
        userId: session.user.id,
        action: Actions.REMOVE_VIDEO,
        entity: "Video",
        entityId: id,
        metadata: { title: videoToDelete.title }
    });


    revalidatePath(`/admin/courses/${videoToDelete.module.course.id}`);
}


