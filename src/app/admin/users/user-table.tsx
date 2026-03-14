"use client";

import { useState } from "react";
import { Search, Shield, User, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Role, roleHierarchy } from "@/lib/rbac-shared";
import { updateUserRole, deleteUser, getAllUsers } from "@/actions/user";
import { toast } from "react-hot-toast";
import clsx from "clsx";
import AddUserModal from "@/components/admin/add-user-modal";


interface UserData {
    id: string;
    name: string | null;
    email: string;
    role: Role;
    createdAt: Date;
}

interface UserTableProps {
    initialUsers: UserData[];
    currentUserRole: Role;
}

const ROLE_STYLES: Record<string, { bg: string; text: string; label: string; icon: React.ElementType }> = {
    SUPER_ADMIN: { bg: "bg-amber-500/10", text: "text-amber-600", label: "Super Admin", icon: Shield },
    ADMIN_ACADEMIC: { bg: "bg-indigo-500/10", text: "text-indigo-600", label: "Académic", icon: Shield },
    ADMIN_CONTENT: { bg: "bg-blue-500/10", text: "text-blue-600", label: "Contenu", icon: Shield },
    ADMIN_STUDENT: { bg: "bg-emerald-500/10", text: "text-emerald-600", label: "Étudiants", icon: Shield },
    MODERATOR: { bg: "bg-purple-500/10", text: "text-purple-600", label: "Modérateur", icon: Shield },
    SUPPORT: { bg: "bg-cyan-500/10", text: "text-cyan-600", label: "Support", icon: Shield },
    TEACHER: { bg: "bg-zinc-500/10", text: "text-zinc-600", label: "Enseignant", icon: User },
    STUDENT: { bg: "bg-zinc-100", text: "text-zinc-500", label: "Étudiant", icon: User },
    ADMIN: { bg: "bg-orange-500/10", text: "text-orange-600", label: "Admin (Legacy)", icon: Shield },
};


export default function UserTable({ initialUsers, currentUserRole }: UserTableProps) {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState(initialUsers);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        (user.name?.toLowerCase() || "").includes(search.toLowerCase())
    );

    const isSuperAdmin = currentUserRole === "SUPER_ADMIN";

    const handleRoleChange = async (userId: string, newRole: Role) => {
        if (!isSuperAdmin) return;

        try {
            setUpdatingId(userId);
            await updateUserRole(userId, newRole);
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
            toast.success("Rôle mis à jour avec succès");
        } catch (error: unknown) {
            console.error(error);
            const message = error instanceof Error ? error.message : "Erreur lors de la mise à jour";
            toast.error(message);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async (userId: string, userEmail: string) => {
        if (!isSuperAdmin) return;
        if (!confirm(`Êtes-vous sûr de vouloir supprimer ${userEmail} ? Cette action est irréversible.`)) return;

        try {
            setUpdatingId(userId);
            await deleteUser(userId);
            setUsers(prev => prev.filter(u => u.id !== userId));
            toast.success("Utilisateur supprimé");
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Erreur lors de la suppression";
            toast.error(message);
        } finally {
            setUpdatingId(null);
        }
    };

    const refreshUsers = async () => {
        const freshUsers = await getAllUsers();
        setUsers(freshUsers as UserData[]);
    };


    return (
        <div className="flex flex-col">
            {/* Top Bar with Search & Add */}
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Rechercher un utilisateur (nom, email)..."
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                {isSuperAdmin && <AddUserModal onUserAdded={refreshUsers} />}
            </div>


            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Utilisateur</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Rôle Actuel</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Date d&apos;inscription</th>
                            {isSuperAdmin && <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {filteredUsers.map((user) => {
                            const style = ROLE_STYLES[user.role] || ROLE_STYLES.STUDENT!;
                            const Icon = style.icon;

                            return (
                                <tr key={user.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-inner uppercase">
                                                {user.name?.[0] || user.email[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                                    {user.name || "Utilisateur sans nom"}
                                                </div>
                                                <div className="text-xs text-zinc-500 font-medium">
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className={clsx(
                                            "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter",
                                            style?.bg || "bg-zinc-100",
                                            style?.text || "text-zinc-500"
                                        )}>
                                            <Icon className="w-3 h-3" />
                                            {style?.label || "Utilisateur"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-sm font-medium text-zinc-500">
                                            {format(new Date(user.createdAt), "dd MMMM yyyy", { locale: fr })}
                                        </div>
                                    </td>
                                    {isSuperAdmin && (
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <select
                                                    className="text-[10px] font-black uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 px-3 py-1.5 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors outline-none border"
                                                    value={user.role}
                                                    disabled={updatingId === user.id}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                                                >
                                                    {Object.keys(roleHierarchy)
                                                        .filter(role => role !== "ADMIN") // On ne permet pas de re-sélectionner le rôle legacy
                                                        .map((role) => (
                                                            <option key={role} value={role}>
                                                                {role.replace(/_/g, " ")}
                                                            </option>
                                                        ))}
                                                </select>

                                                <button
                                                    onClick={() => handleDelete(user.id, user.email)}
                                                    disabled={updatingId === user.id}
                                                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                    title="Supprimer l'utilisateur"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    )}


                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {filteredUsers.length === 0 && (
                <div className="p-12 text-center">
                    <div className="text-zinc-400 font-bold italic">Aucun utilisateur trouvé pour &quot;{search}&quot;</div>
                </div>
            )}
        </div>
    );
}
