"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireRole, logActivity } from "@/lib/rbac";
import { Actions } from "@/lib/rbac";


export async function createCourse(data: { title: string; description?: string; disciplineId: string }) {
    const session = await requireRole("TEACHER");

    const course = await db.course.create({
        data: {
            title: data.title,
            description: data.description,
            disciplineId: data.disciplineId,
            authorId: session.user.id,
        },

    });

    await logActivity({
        userId: session.user.id,
        action: Actions.CREATE_COURSE,
        entity: "Course",
        entityId: course.id,
    });


    revalidatePath("/admin/courses");
    return course;
}

export async function getCourses() {
    return await db.course.findMany({
        include: {
            discipline: true,
            _count: {
                select: { modules: true }
            }
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function updateCourse(id: string, data: { title: string; description?: string; disciplineId: string }) {
    const session = await requireRole("TEACHER");

    const existingCourse = await db.course.findUnique({
        where: { id },
        select: { authorId: true }
    });

    if (session.user.role === "TEACHER" && existingCourse?.authorId !== session.user.id) {
        throw new Error("FORBIDDEN: Vous n'êtes pas l'auteur de ce cours.");
    }

    const course = await db.course.update({
        where: { id },
        data: {
            title: data.title,
            description: data.description,
            disciplineId: data.disciplineId,
        },
    });


    await logActivity({
        userId: session.user.id,
        action: Actions.UPDATE_COURSE,
        entity: "Course",
        entityId: course.id,
    });


    revalidatePath("/admin/courses");
    return course;
}

export async function deleteCourse(id: string) {
    const session = await requireRole("TEACHER");

    const existingCourse = await db.course.findUnique({
        where: { id },
        select: { authorId: true }
    });

    if (session.user.role === "TEACHER" && existingCourse?.authorId !== session.user.id) {
        throw new Error("FORBIDDEN: Vous n'êtes pas l'auteur de ce cours.");
    }

    const deletedCourse = await db.course.delete({
        where: { id },
    });


    await logActivity({
        userId: session.user.id,
        action: Actions.DELETE_COURSE,
        entity: "Course",
        entityId: id,
        metadata: { title: deletedCourse.title }
    });


    revalidatePath("/admin/courses");
}
