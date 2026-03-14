"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireRole, logActivity, Actions } from "@/lib/rbac";
import { Role } from "@/lib/rbac-shared";
import bcrypt from "bcryptjs";

/**
 * Met à jour le rôle d'un utilisateur.
 * Seul un SUPER_ADMIN peut effectuer cette opération.
 */
export async function updateUserRole(userId: string, newRole: Role) {
    try {
        console.log(`[updateUserRole] Start - userId: ${userId}, newRole: ${newRole}`);

        const session = await requireRole("SUPER_ADMIN");
        console.log(`[updateUserRole] Authorized - session user: ${session.user.email}, role: ${session.user.role}`);

        const user = await db.user.update({
            where: { id: userId },
            data: { role: newRole as Role },
        });

        console.log(`[updateUserRole] DB Update Success - ${user.email}`);

        try {
            await logActivity({
                userId: session.user.id,
                action: Actions.UPDATE_ROLE,
                entity: "User",
                entityId: userId,
                metadata: {
                    affectedUser: user.email,
                    newRole,
                    performedBy: session.user.email
                },
            });
        } catch (logError) {
            console.error("[updateUserRole] Non-blocking logging error:", logError);
        }

        revalidatePath("/admin/users");
        return { success: true };
    } catch (error: unknown) {
        console.error("[updateUserRole] Critical Error:", error);
        const message = error instanceof Error ? error.message : "Erreur serveur lors de la mise à jour";
        throw new Error(message);
    }
}


/**
 * Récupère tous les utilisateurs pour l'administration.
 */
export async function getAllUsers() {
    await requireRole("ADMIN_STUDENT");

    return await db.user.findMany({
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });
}

/**
 * Ajoute un nouvel utilisateur manuellement.
 * SUPER_ADMIN requis.
 */
export async function addUser(data: { name: string; email: string; password: string; role: Role }) {
    try {
        const session = await requireRole("SUPER_ADMIN");

        const cleanEmail = data.email.trim().toLowerCase();

        // Vérification de l'existence
        const existing = await db.user.findUnique({
            where: { email: cleanEmail },
        });

        if (existing) throw new Error("Cet email est déjà utilisé.");

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const newUser = await db.user.create({
            data: {
                name: data.name,
                email: cleanEmail,
                password: hashedPassword,
                role: data.role as Role,
                emailVerified: new Date(),
                onboardingCompleted: true,
            },
        });

        await logActivity({
            userId: session.user.id,
            action: data.role === "STUDENT" ? Actions.CREATE_STUDENT : Actions.CREATE_ADMIN,
            entity: "User",
            entityId: newUser.id,
            metadata: {
                createdUser: cleanEmail,
                role: data.role,
                performedBy: session.user.email
            },
        });

        revalidatePath("/admin/users");
        return { success: true, user: newUser };
    } catch (error: unknown) {
        console.error("[addUser] Error:", error);
        const message = error instanceof Error ? error.message : "Erreur lors de la création de l'utilisateur";
        throw new Error(message);
    }
}

/**
 * Supprime un utilisateur.
 * SUPER_ADMIN requis.
 */
export async function deleteUser(userId: string) {
    try {
        const session = await requireRole("SUPER_ADMIN");

        // Empêcher l'auto-suppression
        if (userId === session.user.id) {
            throw new Error("Vous ne pouvez pas supprimer votre propre compte.");
        }

        const user = await db.user.delete({
            where: { id: userId },
        });

        await logActivity({
            userId: session.user.id,
            action: Actions.DELETE_STUDENT, // Par défaut ou logique plus complexe si besoin
            entity: "User",
            entityId: userId,
            metadata: {
                deletedUser: user.email,
                performedBy: session.user.email
            },
        });

        revalidatePath("/admin/users");
        return { success: true };
    } catch (error: unknown) {
        console.error("[deleteUser] Error:", error);
        const message = error instanceof Error ? error.message : "Erreur lors de la suppression de l'utilisateur";
        throw new Error(message);
    }
}

