"use client";

import { useState } from "react";
import { createDiscipline, deleteDiscipline } from "@/actions/discipline";
import { Plus, Trash2, BookOpen, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Discipline {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date | string;
}

export default function DisciplinesList({ disciplines }: { disciplines: Discipline[] }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createDiscipline({ name, description });
            setName("");
            setDescription("");
            router.refresh();
        } catch {
            alert("Erreur lors de la création");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer cette discipline ?")) return;
        try {
            await deleteDiscipline(id);
            router.refresh();
        } catch {
            alert("Erreur lors de la suppression");
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Ajouter une Discipline
                </h2>
                <form onSubmit={handleCreate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Nom de la discipline (ex: Informatique)"
                            className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Description (optionnel)"
                            className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
                    >
                        {loading ? "Création..." : "Ajouter"}
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {disciplines.map((discipline) => (
                    <div key={discipline.id} className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <button
                                onClick={() => handleDelete(discipline.id)}
                                className="p-2 text-zinc-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                        <h3 className="font-bold text-xl mb-2">{discipline.name}</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm line-clamp-2">
                            {discipline.description || "Aucune description fournie."}
                        </p>
                        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-xs text-zinc-400">
                            <span>Créé le {new Date(discipline.createdAt).toLocaleDateString()}</span>
                            <Link href="/admin/courses" className="flex items-center gap-1 text-black dark:text-white font-bold hover:underline">
                                Voir les cours <ChevronRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
