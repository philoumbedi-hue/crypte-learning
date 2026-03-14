"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Save, Loader2, User, Mail, Shield } from "lucide-react";
import { updateProfile } from "@/actions/profile";
import toast from "react-hot-toast";

interface ProfileFormProps {
    user: {
        id: string;
        name: string | null;
        email: string | null;
        role: string;
        image: string | null;
        createdAt: Date;
    };
}

export default function ProfileForm({ user }: ProfileFormProps) {
    const router = useRouter();
    const [name, setName] = useState(user.name || "");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateProfile({ name });
            toast.success("Profil mis à jour avec succès !");
            router.refresh();
        } catch {
            toast.error("Erreur lors de la mise à jour du profil.");
        } finally {
            setLoading(false);
        }
    };

    const roleBadge: Record<string, { label: string; color: string }> = {
        STUDENT: { label: "Étudiant", color: "bg-indigo-100 text-indigo-700" },
        TEACHER: { label: "Enseignant", color: "bg-emerald-100 text-emerald-700" },
        ADMIN: { label: "Administrateur", color: "bg-red-100 text-red-700" },
        SUPER_ADMIN: { label: "Super Admin", color: "bg-black text-white" },
        ADMIN_ACADEMIC: { label: "Admin Académique", color: "bg-purple-100 text-purple-700" },
        ADMIN_CONTENT: { label: "Admin Contenu", color: "bg-amber-100 text-amber-700" },
        MODERATOR: { label: "Modérateur", color: "bg-cyan-100 text-cyan-700" },
    };

    const badge = roleBadge[user.role] || { label: user.role, color: "bg-zinc-100 text-zinc-700" };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black pt-32 pb-20 px-6">
            <div className="max-w-2xl mx-auto space-y-10">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex p-6 bg-indigo-600 rounded-3xl text-white shadow-xl shadow-indigo-200 mx-auto">
                        <GraduationCap className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight uppercase">Mon Profil</h1>
                    <p className="text-zinc-500 font-medium italic">Gérez vos informations personnelles et académiques</p>
                </div>

                {/* Identity Card */}
                <div className="bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 p-10 shadow-sm space-y-8">
                    {/* Avatar + Role */}
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-indigo-200">
                            {(user.name || user.email || "?")[0].toUpperCase()}
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black">{user.name || "Anonyme"}</h2>
                            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${badge.color}`}>
                                <Shield className="w-3 h-3" />
                                {badge.label}
                            </span>
                        </div>
                    </div>

                    <div className="h-px bg-zinc-100 dark:bg-zinc-800" />

                    {/* Read-only info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl">
                            <Mail className="w-4 h-4 text-zinc-400" />
                            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl">
                            <User className="w-4 h-4 text-zinc-400" />
                            <span className="text-sm font-medium text-zinc-500">
                                Membre depuis le {new Date(user.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                            </span>
                        </div>
                    </div>

                    <div className="h-px bg-zinc-100 dark:bg-zinc-800" />

                    {/* Editable form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                Nom Complet
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                minLength={2}
                                placeholder="Votre nom complet"
                                className="w-full px-5 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || name.trim() === (user.name || "")}
                            className="w-full py-4 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-40 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Sauvegarder les modifications
                        </button>
                    </form>
                </div>

                {/* Security note */}
                <div className="p-6 bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex items-start gap-4">
                    <Shield className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                    <p className="text-xs font-medium text-zinc-500 leading-relaxed">
                        Vos données sont sécurisées et ne sont jamais partagées avec des tiers.
                        Pour modifier votre mot de passe, contactez l&apos;administration académique.
                    </p>
                </div>
            </div>
        </div>
    );
}
