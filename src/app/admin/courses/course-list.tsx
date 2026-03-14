"use client";

import { useState } from "react";
import { createCourse, deleteCourse } from "@/actions/course";
import { Plus, Trash2, GraduationCap, FileEdit } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";


interface Course {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
    discipline: { name: string };
    createdAt: Date | string;
    _count?: {
        modules: number;
    };
}

interface Discipline {
    id: string;
    name: string;
}

export default function CoursesList({ courses, disciplines, activeDisciplineId }: { courses: Course[], disciplines: Discipline[], activeDisciplineId?: string }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [disciplineId, setDisciplineId] = useState(activeDisciplineId || "");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!disciplineId) return alert("Veuillez choisir une discipline");
        setLoading(true);
        try {
            await createCourse({ title: name, description, disciplineId });
            setName("");
            if (!activeDisciplineId) setDisciplineId("");
            router.refresh();
        } catch {
            alert("Erreur lors de la création");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer ce cours ?")) return;
        try {
            await deleteCourse(id);
            router.refresh();
        } catch {
            alert("Erreur lors de la suppression");
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Ajouter un Cours
                </h2>
                <form onSubmit={handleCreate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Nom du cours"
                            className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <select
                            className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
                            value={disciplineId}
                            onChange={(e) => setDisciplineId(e.target.value)}
                            required
                            disabled={!!activeDisciplineId}
                        >
                            <option value="">Choisir une Discipline</option>
                            {disciplines.map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course) => (
                    <CourseCard key={course.id} course={course} handleDelete={handleDelete} />
                ))}
                {courses.length === 0 && (
                    <div className="col-span-full py-12 text-center text-zinc-500 bg-white dark:bg-zinc-900 rounded-[3rem] border border-dashed border-zinc-200 dark:border-zinc-800">
                        Aucun cours défini pour cette faculté.
                    </div>
                )}
            </div>
        </div>
    );
}

function CourseCard({ course, handleDelete }: { course: Course, handleDelete: (id: string) => void }) {
    return (
        <div className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[3rem] overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col relative">
            {/* Course Header/Banner */}
            <div className="aspect-video relative bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                {course.imageUrl ? (
                    <Image
                        src={course.imageUrl}
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-[3s]"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <GraduationCap className="w-16 h-16 text-zinc-300 dark:text-zinc-700" />
                    </div>
                )}
                {course.discipline?.name && (
                    <div className="absolute top-6 left-6 px-4 py-1.5 bg-black/80 dark:bg-white/90 backdrop-blur-md text-white dark:text-black rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-white/10 z-20">
                        {course.discipline.name}
                    </div>
                )}

                {/* Admin Actions Overlay */}
                <div className="absolute top-6 right-6 flex gap-2 z-30">
                    <Link
                        href={`/admin/courses/${course.id}/edit`}
                        className="p-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-2xl shadow-lg border border-white/50 transition-all hover:scale-110"
                        title="Éditer le Contenu (Mode Word)"
                    >
                        <FileEdit className="w-4 h-4" />
                    </Link>
                    <button
                        onClick={() => handleDelete(course.id)}
                        className="p-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-zinc-600 dark:text-zinc-400 hover:text-red-600 rounded-2xl shadow-lg border border-white/50 transition-all hover:scale-110"
                        title="Supprimer"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-black mb-4 leading-tight uppercase group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {course.title}
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm line-clamp-3 mb-8 font-medium italic">
                    {course.description || "Aucune description fournie."}
                </p>

                <div className="mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Structure</span>
                        <span className="text-xs font-bold">{course._count?.modules || 0} Modules</span>
                    </div>
                    <Link
                        href={`/admin/courses/${course.id}`}
                        className="px-6 py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-black dark:hover:bg-white text-black dark:text-white hover:text-white dark:hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                        Ouvrir le Cours
                    </Link>
                </div>
            </div>
        </div>
    );
}
