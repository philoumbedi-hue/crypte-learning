"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireRole, logActivity, Actions } from "@/lib/rbac";


export async function createDiscipline(data: { name: string; description?: string }) {
    const session = await requireRole("ADMIN_ACADEMIC");

    const discipline = await db.discipline.create({
        data: {
            name: data.name,
            description: data.description,
        },
    });

    await logActivity({
        userId: session.user.id,
        action: Actions.UPDATE_ROLE, // We'll represent discipline creation as a role-level change for now or generic update
        entity: "Discipline",
        entityId: discipline.id,
        metadata: { name: discipline.name, action: "CREATED" }
    });


    revalidatePath("/admin/disciplines");
    return discipline;
}

export async function getDisciplines() {
    return await db.discipline.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function updateDiscipline(id: string, data: { name: string; description?: string }) {
    const session = await requireRole("ADMIN_ACADEMIC");

    const discipline = await db.discipline.update({
        where: { id },
        data: {
            name: data.name,
            description: data.description,
        },
    });

    await logActivity({
        userId: session.user.id,
        action: Actions.UPDATE_ROLE,
        entity: "Discipline",
        entityId: id,
        metadata: { name: discipline.name, action: "UPDATED" }
    });


    revalidatePath("/admin/disciplines");
    return discipline;
}

export async function deleteDiscipline(id: string) {
    const session = await requireRole("ADMIN_ACADEMIC");

    const discipline = await db.discipline.delete({
        where: { id },
    });

    await logActivity({
        userId: session.user.id,
        action: Actions.UPDATE_ROLE,
        entity: "Discipline",
        entityId: id,
        metadata: { name: discipline.name, action: "DELETED" }
    });


    revalidatePath("/admin/disciplines");
}
