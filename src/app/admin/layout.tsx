import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { hasRequiredRole } from "@/lib/rbac";
import type { Role } from "@/lib/rbac";
import Link from "next/link";
import { BookOpen, GraduationCap, Users, LayoutDashboard, Import, Shield, Video, ArrowLeft } from "lucide-react";
import { AdminLogoutButton } from "@/components/admin/admin-logout-button";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    // 🔐 Protection RBAC : seul TEACHER et supérieur accèdent à l&apos;admin
    if (!session?.user || !hasRequiredRole(session.user.role as Role, "TEACHER")) {
        redirect("/");
    }

    const userRole = session.user.role as Role;
    const isSuperAdmin = hasRequiredRole(userRole, "SUPER_ADMIN");
    const isAcademic = hasRequiredRole(userRole, "ADMIN_ACADEMIC");
    const isContent = hasRequiredRole(userRole, "ADMIN_CONTENT") || hasRequiredRole(userRole, "TEACHER");
    const isStudentAdmin = hasRequiredRole(userRole, "ADMIN_STUDENT");


    return (
        <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
            {/* Sidebar Admin */}
            <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 hidden md:flex flex-col">
                <div className="flex items-center gap-2 mb-8">
                    <div className="p-2 bg-black dark:bg-white text-white dark:text-black rounded-xl">
                        <Shield className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="font-black text-sm">CRYPTE Admin</div>
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            {userRole.replace(/_/g, " ")}
                        </div>
                    </div>
                </div>

                <nav className="space-y-1 flex-1">
                    {/* Dashboard — tous les admins */}
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium text-sm transition-colors"
                    >
                        <LayoutDashboard className="w-4 h-4 text-zinc-400" />
                        Dashboard
                    </Link>

                    {/* Disciplines & Admissions — ADMIN_ACADEMIC+ */}
                    {isAcademic && (
                        <>
                            <Link
                                href="/admin/disciplines"
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm transition-colors"
                            >
                                <BookOpen className="w-4 h-4 text-zinc-400" />
                                Disciplines
                            </Link>
                            <Link
                                href="/admin/applications"
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm transition-colors text-indigo-600 font-bold"
                            >
                                <Users className="w-4 h-4 text-indigo-400" />
                                Candidatures
                            </Link>
                        </>
                    )}

                    {/* Cours — ADMIN_CONTENT+ */}
                    {isContent && (
                        <>
                            <Link
                                href="/admin/courses"
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm transition-colors"
                            >
                                <GraduationCap className="w-4 h-4 text-zinc-400" />
                                Cours
                            </Link>
                            <Link
                                href="/admin/live-sessions"
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm transition-colors"
                            >
                                <Video className="w-4 h-4 text-zinc-400" />
                                Visioconférences
                            </Link>
                        </>
                    )}

                    {/* Utilisateurs — ADMIN_STUDENT+ */}
                    {isStudentAdmin && (
                        <Link
                            href="/admin/users"
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm transition-colors"
                        >
                            <Users className="w-4 h-4 text-zinc-400" />
                            Utilisateurs
                        </Link>
                    )}

                    {/* Import JSON — SUPER_ADMIN seulement */}
                    {isSuperAdmin && (
                        <Link
                            href="/admin/import"
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm transition-colors"
                        >
                            <Import className="w-4 h-4 text-zinc-400" />
                            Import Curriculum
                        </Link>
                    )}

                    <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <Link
                            href="/"
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium text-sm transition-colors text-zinc-500 hover:text-black dark:hover:text-white"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Retour au Site
                        </Link>
                    </div>
                </nav>

                {/* Footer sidebar */}
                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-4">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                        Connecté en tant que
                    </div>
                    <div className="text-xs font-semibold truncate">{session.user.name || session.user.email}</div>
                </div>
            </aside>

            <main className="flex-1 flex flex-col">
                <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-8 flex items-center justify-between shrink-0">
                    <span className="font-semibold">Administration CRYPTE</span>
                    <AdminLogoutButton />
                </header>
                <div className="flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
}
