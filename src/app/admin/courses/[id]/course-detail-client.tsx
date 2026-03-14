"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical, FileEdit, ChevronRight, Video, FileText, HelpCircle } from "lucide-react";
import { createModule, deleteModule } from "@/actions/module";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface Module {
    id: string;
    title: string;
    order: number;
    learningObjectives: string | null;
    theoryContent: string | null;
    videos: { id: string }[];
    documents: { id: string }[];
    quizzes: { id: string }[];
}

interface Course {
    id: string;
    title: string;
}

export default function CourseDetailClient({ course, modules }: { course: Course, modules: Module[] }) {
    const router = useRouter();
    const [newModuleTitle, setNewModuleTitle] = useState("");
    const [newModuleObjectives, setNewModuleObjectives] = useState("");
    const [newModuleTheory, setNewModuleTheory] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreateModule = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createModule({
                title: newModuleTitle,
                learningObjectives: newModuleObjectives,
                theoryContent: newModuleTheory,
                order: modules.length + 1,
                courseId: course.id
            });
            setNewModuleTitle("");
            setNewModuleObjectives("");
            setNewModuleTheory("");
            toast.success("Module ajouté");
            router.refresh();
        } catch {
            alert("Erreur lors de la création du module");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteModule = async (id: string) => {
        if (!confirm("Supprimer ce module et tout son contenu (vidéos, quiz, etc.) ?")) return;
        try {
            await deleteModule(id);
            toast.success("Module supprimé");
            router.refresh();
        } catch {
            alert("Erreur lors de la suppression");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
                <div>
                    <h2 className="text-sm font-black uppercase tracking-[0.4em] text-zinc-500 mb-2">Gestion Académique</h2>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-white">{course.title}</h1>
                </div>
                <Link
                    href={`/admin/courses/${course.id}/edit`}
                    className="group relative flex items-center gap-4 px-10 py-5 bg-gradient-to-br from-white to-zinc-200 text-black font-black rounded-[2rem] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.15)] uppercase tracking-tighter text-base overflow-hidden shrink-0"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <FileEdit className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    <span>Éditer la Doctrine</span>
                </Link>
            </div>

            <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 mb-12 shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Nouveau Module / Chapitre
                </h3>
                <form onSubmit={handleCreateModule} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Titre du module (ex: Fondamentaux de l'Algorithmique)"
                        className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition"
                        value={newModuleTitle}
                        onChange={(e) => setNewModuleTitle(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Objectifs pédagogiques de ce module..."
                        className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition min-h-[100px] text-sm hidden md:block"
                        value={newModuleObjectives}
                        onChange={(e) => setNewModuleObjectives(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={loading || !newModuleTitle}
                        className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 text-sm uppercase tracking-widest"
                    >
                        {loading ? "Création..." : "Ajouter le Module"}
                    </button>
                </form>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-black tracking-tight flex items-center gap-3 px-2">
                    <GripVertical className="w-6 h-6 text-zinc-300" /> Structure du Cours
                </h2>

                {modules.map((module) => (
                    <div key={module.id} className="group bg-white dark:bg-zinc-950 rounded-[2rem] p-6 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-200 dark:hover:border-indigo-900/50 shadow-sm hover:shadow-xl transition-all duration-300 relative">
                        <div className="absolute top-6 right-6 flex gap-2 z-10">
                            <Link
                                href={`/admin/courses/${course.id}/modules/${module.id}/edit`}
                                className="p-2.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-blue-600 rounded-xl transition-colors"
                                title="Éditer la Théorie du Module"
                            >
                                <FileEdit className="w-4 h-4" />
                            </Link>
                            <button
                                onClick={() => handleDeleteModule(module.id)}
                                className="p-2.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-red-500 rounded-xl transition-colors"
                                title="Supprimer le Module"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="md:pr-24 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl text-lg font-black shrink-0">
                                    {module.order}
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-xl lg:text-2xl tracking-tight leading-tight group-hover:text-indigo-600 transition-colors uppercase">{module.title}</h4>
                                    <div className="flex flex-wrap gap-2 md:gap-4 mt-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-zinc-500">
                                        <span className="flex items-center gap-1"><Video className="w-3 h-3" /> {module.videos?.length || 0} Vidéos</span>
                                        <span className="hidden md:block">•</span>
                                        <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {module.documents?.length || 0} Docs</span>
                                        <span className="hidden md:block">•</span>
                                        <span className="flex items-center gap-1"><HelpCircle className="w-3 h-3" /> {module.quizzes?.length || 0} Quiz</span>
                                    </div>
                                </div>
                            </div>

                            {module.learningObjectives && (
                                <p className="text-zinc-500 dark:text-zinc-400 text-sm italic font-medium">
                                    {module.learningObjectives}
                                </p>
                            )}

                            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                <Link
                                    href={`/admin/courses/${course.id}/modules/${module.id}`}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-100 dark:bg-zinc-900 hover:bg-black dark:hover:bg-white text-black dark:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all group/btn"
                                >
                                    Gérer les Leçons
                                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {modules.length === 0 && (
                    <div className="py-16 text-center text-zinc-500 bg-zinc-50 dark:bg-zinc-900/50 rounded-[3rem] border border-dashed border-zinc-200 dark:border-zinc-800">
                        Aucun module créé pour ce programme.
                    </div>
                )}
            </div>
        </div>
    );
}
