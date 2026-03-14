import { requireRole } from "@/lib/rbac";
import { getAllUsers } from "@/actions/user";
import UserTable from "./user-table";
import { Shield, Users as UsersIcon, ArrowLeft } from "lucide-react";
import { Role } from "@/lib/rbac-shared";
import Link from "next/link";

export default async function AdminUsersPage() {
    const session = await requireRole("ADMIN_STUDENT");
    const users = await getAllUsers();

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Retour au Dashboard
            </Link>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-200 dark:border-zinc-800">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest text-xs">
                        <Shield className="w-4 h-4" /> Administration Institutionnelle
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase">
                        Gestion des <span className="text-zinc-400">Utilisateurs</span>
                    </h1>
                    <p className="text-zinc-500 max-w-md">
                        Supervisez les accès, modifiez les rôles et assurez la sécurité de la plateforme CRYPTE.
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                        <UsersIcon className="w-5 h-5 text-zinc-500" />
                    </div>
                    <div>
                        <div className="text-2xl font-black">{users.length}</div>
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Comptes Actifs</div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="bg-white dark:bg-zinc-950 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xl">
                <UserTable
                    initialUsers={JSON.parse(JSON.stringify(users))}
                    currentUserRole={session.user.role as Role}
                />
            </div>
        </div>
    );
}
