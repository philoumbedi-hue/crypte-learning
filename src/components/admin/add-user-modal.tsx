"use client";

import { useState } from "react";
import { UserPlus, X, Mail, Lock, User, ShieldCheck } from "lucide-react";
import { Role, roleHierarchy } from "@/lib/rbac-shared";
import { addUser } from "@/actions/user";
import { toast } from "react-hot-toast";

export default function AddUserModal({ onUserAdded }: { onUserAdded: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "STUDENT" as Role
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addUser(formData);
            toast.success("Utilisateur ajouté avec succès");
            setIsOpen(false);
            setFormData({ name: "", email: "", password: "", role: "STUDENT" as Role });
            onUserAdded();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erreur lors de l'ajout";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-sm font-bold hover:scale-105 transition-all shadow-lg shadow-black/10 dark:shadow-white/10"
            >
                <UserPlus className="w-4 h-4" />
                Ajouter un utilisateur
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-zinc-950 w-full max-w-lg rounded-[2.5rem] p-8 border border-zinc-200 dark:border-zinc-800 shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight uppercase">Nouvel Utilisateur</h2>
                        <p className="text-sm text-zinc-500 font-medium">Créez manuellement un compte utilisateur.</p>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl transition-colors"
                    >
                        <X className="w-5 h-5 text-zinc-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                                required
                                type="text"
                                placeholder="Nom complet"
                                className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-sm focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none font-medium"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                                required
                                type="email"
                                placeholder="Adresse email"
                                className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-sm focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none font-medium"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                                required
                                type="password"
                                placeholder="Mot de passe temporaire"
                                className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-sm focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none font-medium"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <div className="relative">
                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <select
                                className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-sm focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none font-bold appearance-none cursor-pointer"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                            >
                                {Object.keys(roleHierarchy)
                                    .filter(r => r !== "ADMIN")
                                    .map(role => (
                                        <option key={role} value={role}>{role.replace(/_/g, " ")}</option>
                                    ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 py-4 text-sm font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-2xl transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-black/20 dark:shadow-white/20"
                        >
                            {isSubmitting ? "Création..." : "Confirmer la création"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
