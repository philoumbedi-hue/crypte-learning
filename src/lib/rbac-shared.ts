/**
 * CRYPTE RBAC — Shared Roles & Logic (Client + Server Safe)
 * 
 * Ce fichier ne doit contenir AUCUNE importation server-side (prisma, next-auth, etc.)
 * pour pouvoir être utilisé dans des composants Client ("use client").
 */

export type Role =
    | "SUPER_ADMIN"
    | "ADMIN_ACADEMIC"
    | "ADMIN_CONTENT"
    | "ADMIN_STUDENT"
    | "ADMIN_FINANCE"
    | "MODERATOR"
    | "SUPPORT"
    | "TEACHER"
    | "STUDENT";

/**
 * Hiérarchie des rôles (niveau d'accès).
 */
export const roleHierarchy: Record<string, number> = {
    SUPER_ADMIN: 10,
    ADMIN_ACADEMIC: 8,
    ADMIN_CONTENT: 7,
    ADMIN_FINANCE: 7,
    ADMIN_STUDENT: 6,
    MODERATOR: 4,
    TEACHER: 3,
    SUPPORT: 2,
    STUDENT: 0,
    // Legacy support
    ADMIN: 10,
};




/**
 * Vérifie si un rôle utilisateur satisfait le niveau requis.
 */
export function hasRequiredRole(userRole: Role, requiredRole: Role): boolean {
    if (!userRole || !requiredRole) return false;
    return (roleHierarchy[userRole] ?? 0) >= (roleHierarchy[requiredRole] ?? 0);
}

/**
 * Vérifie si un rôle est considéré comme administrateur global (niveau >= MODERATOR).
 * Le rôle TEACHER n'est pas un administrateur global mais a accès au Dashboard pédagogique.
 */
export function isAdminRole(role: Role): boolean {
    if (!role) return false;
    return (roleHierarchy[role] ?? 0) >= (roleHierarchy["MODERATOR"] ?? 0);
}


