"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireRole, logActivity } from "@/lib/rbac";
import { Actions } from "@/lib/rbac";


export async function createModule(data: {
    title: string;
    description?: string;
    learningObjectives?: string;
    theoryContent?: string;
    order: number;
    courseId: string
}) {
    const session = await requireRole("TEACHER");

    // Vérifier si l'enseignant est l'auteur du cours
    const course = await db.course.findUnique({
        where: { id: data.courseId },
        select: { authorId: true }
    });

    if (session.user.role === "TEACHER" && course?.authorId !== session.user.id) {
        throw new Error("FORBIDDEN: Vous n'êtes pas l'auteur de ce cours.");
    }

    const mod = await db.module.create({
        data: {
            title: data.title,
            description: data.description,
            learningObjectives: data.learningObjectives,
            theoryContent: data.theoryContent,
            order: data.order,
            courseId: data.courseId,
        },
    });

    await logActivity({
        userId: session.user.id,
        action: Actions.CREATE_MODULE,
        entity: "Module",
        entityId: mod.id,
    });


    revalidatePath(`/admin/courses/${data.courseId}`);
    return mod;
}

export async function updateModule(id: string, data: {
    title: string;
    description?: string;
    learningObjectives?: string;
    theoryContent?: string;
    order: number;
}) {
    const session = await requireRole("TEACHER");

    const existingMod = await db.module.findUnique({
        where: { id },
        include: { course: { select: { authorId: true } } }
    });

    if (!existingMod) throw new Error("Module non trouvé");

    if (session.user.role === "TEACHER" && existingMod.course.authorId !== session.user.id) {
        throw new Error("FORBIDDEN: Vous n'êtes pas l'auteur du cours associé.");
    }

    const mod = await db.module.update({
        where: { id },
        data: {
            title: data.title,
            description: data.description,
            learningObjectives: data.learningObjectives,
            theoryContent: data.theoryContent,
            order: data.order,
        },
    });

    await logActivity({
        userId: session.user.id,
        action: Actions.UPDATE_MODULE,
        entity: "Module",
        entityId: mod.id,
    });


    revalidatePath(`/admin/courses/${mod.courseId}`);
    return mod;
}

export async function deleteModule(id: string) {
    const session = await requireRole("TEACHER");

    const modToDelete = await db.module.findUnique({
        where: { id },
        include: { course: { select: { authorId: true } } }
    });

    if (!modToDelete) throw new Error("Module non trouvé");

    if (session.user.role === "TEACHER" && modToDelete.course.authorId !== session.user.id) {
        throw new Error("FORBIDDEN: Vous n'êtes pas l'auteur du cours associé.");
    }

    await db.module.delete({
        where: { id },
    });

    await logActivity({
        userId: session.user.id,
        action: Actions.DELETE_MODULE,
        entity: "Module",
        entityId: id,
        metadata: { title: modToDelete.title }
    });


    revalidatePath(`/admin/courses/${modToDelete.courseId}`);
}


export async function getModulesForCourse(courseId: string) {
    return await db.module.findMany({
        where: { courseId },
        orderBy: { order: "asc" },
        include: {
            videos: true,
            documents: true,
            quizzes: {
                include: {
                    questions: true
                }
            }
        },
    });
}
