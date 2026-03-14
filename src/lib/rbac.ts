import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { Role, roleHierarchy, hasRequiredRole } from "./rbac-shared";

export type { Role };
export { roleHierarchy, hasRequiredRole };

/**
 * Vérifie si un rôle est considéré comme administrateur (niveau >= MODERATOR).
 * Importé depuis rbac-shared pour la cohérence.
 */
export { isAdminRole } from "./rbac-shared";


// =============================================================================
// SERVER ACTIONS — Protection des Server Components & Actions
// =============================================================================

/**
 * Requiert une session authentifiée avec le rôle minimum spécifié.
 * Lève une Error si non autorisé (à attraper dans les Server Components).
 *
 * @example
 * const session = await requireRole("ADMIN_ACADEMIC");
 */
export async function requireRole(requiredRole: Role) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        throw new Error("UNAUTHORIZED");
    }

    const userRole = session.user.role as Role;

    if (!hasRequiredRole(userRole, requiredRole)) {
        throw new Error("FORBIDDEN");
    }

    return session;
}

// =============================================================================
// API ROUTES — Protection des Route Handlers (App Router)
// =============================================================================

/**
 * Middleware pour les Route Handlers Next.js.
 * Retourne une NextResponse d'erreur si non autorisé.
 *
 * @example
 * export async function POST(req: Request) {
 *   const authResult = await requireRoleAPI("ADMIN_CONTENT");
 *   if (authResult instanceof NextResponse) return authResult;
 *   const { session } = authResult;
 *   // ... logique
 * }
 */
export async function requireRoleAPI(requiredRole: Role) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json(
            { error: "Non authentifié. Veuillez vous connecter." },
            { status: 401 }
        );
    }

    const userRole = session.user.role as Role;

    if (!hasRequiredRole(userRole, requiredRole)) {
        return NextResponse.json(
            {
                error: "Accès refusé. Permissions insuffisantes.",
                required: requiredRole,
                current: userRole,
            },
            { status: 403 }
        );
    }

    return { session, userRole };
}

// =============================================================================
// ACTIVITY LOG — Traçabilité des actions administratives
// =============================================================================

interface LogActivityOptions {
    userId: string;
    action: string;       // ex: "SUSPEND_STUDENT", "DELETE_COURSE"
    entity: string;       // ex: "User", "Course", "Module"
    entityId?: string;    // ID de l'entité concernée
    metadata?: Record<string, unknown>;  // Informations contextuelles
    ipAddress?: string;
}

/**
 * Enregistre une action administrative dans les logs d'audit.
 * À appeler après chaque opération critique d'un administrateur.
 *
 * @example
 * await logActivity({
 *   userId: session.user.id,
 *   action: "SUSPEND_STUDENT",
 *   entity: "User",
 *   entityId: studentId,
 *   metadata: { reason: "Violation CGU", duration: "7 jours" },
 * });
 */
export async function logActivity(options: LogActivityOptions): Promise<void> {
    try {
        await db.activityLog.create({
            data: {
                userId: options.userId,
                action: options.action,
                entity: options.entity,
                entityId: options.entityId,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                metadata: (options.metadata as any) ?? {},
                ipAddress: options.ipAddress,
            },
        });
    } catch (error) {
        // Log non-bloquant : on n'interrompt pas l'opération si le log échoue
        console.error("[ActivityLog] Erreur d'enregistrement:", error);
    }
}

// =============================================================================
// ACTIONS PRÉDÉFINIES (constantes pour éviter les fautes de frappe)
// =============================================================================

export const Actions = {
    // Étudiants
    CREATE_STUDENT: "STUDENT_CREATED",
    UPDATE_STUDENT: "STUDENT_UPDATED",
    SUSPEND_STUDENT: "STUDENT_SUSPENDED",
    REACTIVATE_STUDENT: "STUDENT_REACTIVATED",
    DELETE_STUDENT: "STUDENT_DELETED",
    RESET_PASSWORD: "PASSWORD_RESET",
    ENROLL_STUDENT: "STUDENT_ENROLLED",
    UNENROLL_STUDENT: "STUDENT_UNENROLLED",

    // Cours
    CREATE_COURSE: "COURSE_CREATED",
    UPDATE_COURSE: "COURSE_UPDATED",
    DELETE_COURSE: "COURSE_DELETED",
    PUBLISH_COURSE: "COURSE_PUBLISHED",
    UNPUBLISH_COURSE: "COURSE_UNPUBLISHED",
    ARCHIVE_COURSE: "COURSE_ARCHIVED",

    // Modules
    CREATE_MODULE: "MODULE_CREATED",
    UPDATE_MODULE: "MODULE_UPDATED",
    DELETE_MODULE: "MODULE_DELETED",

    // Leçons / Vidéos
    ADD_VIDEO: "VIDEO_ADDED",
    UPDATE_VIDEO: "VIDEO_UPDATED",
    REMOVE_VIDEO: "VIDEO_REMOVED",

    // Quiz
    CREATE_QUIZ: "QUIZ_CREATED",
    UPDATE_QUIZ: "QUIZ_UPDATED",
    DELETE_QUIZ: "QUIZ_DELETED",
    EDIT_QUESTION: "QUESTION_EDITED",

    // Certificats
    GENERATE_CERTIFICATE: "CERTIFICATE_GENERATED",
    REVOKE_CERTIFICATE: "CERTIFICATE_REVOKED",

    // Administration
    CREATE_ADMIN: "ADMIN_CREATED",
    UPDATE_ROLE: "ROLE_UPDATED",
    ACCESS_ADMIN_PANEL: "ADMIN_PANEL_ACCESSED",
} as const;

export type ActionType = typeof Actions[keyof typeof Actions];
