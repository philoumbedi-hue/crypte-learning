import { getCourses } from "@/actions/course";
import { getDisciplines } from "@/actions/discipline";
import CoursesList from "./course-list";
import Link from "next/link";
import Image from "next/image";
import { domainImageMap } from "@/lib/domainImages";
import { ChevronRight, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage({ searchParams }: { searchParams: { discipline?: string } }) {
    const disciplineId = searchParams.discipline;
    const disciplines = await getDisciplines();

    if (!disciplineId) {
        return (
            <div className="p-8 max-w-7xl mx-auto space-y-8">
                <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Retour au Dashboard
                </Link>

                <div>
                    <h1 className="text-3xl font-bold">Gestion des Programmes</h1>
                    <p className="text-zinc-500 mt-1">Sélectionnez une faculté pour gérer ses cours.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {disciplines.map((d) => {
                        const image = domainImageMap[d.name] || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop";
                        return (
                            <Link
                                key={d.id}
                                href={`/admin/courses?discipline=${d.id}`}
                                className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-zinc-900 shadow-xl shadow-indigo-100/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-700"
                            >
                                <Image
                                    src={image}
                                    alt={d.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-[4s] ease-out grayscale-[0.2]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                                <div className="absolute inset-0 p-8 flex flex-col justify-end gap-3">
                                    <span className="text-white font-black text-xl leading-tight uppercase tracking-tight group-hover:text-indigo-300 transition-colors">
                                        {d.name.replace(/^[\p{Emoji}\s]+/u, '')}
                                    </span>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center transition-all -translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 shadow-xl">
                                            <ChevronRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    }

    const selectedDiscipline = disciplines.find(d => d.id === disciplineId);
    if (!selectedDiscipline) return <div className="p-8">Discipline introuvable</div>;

    const courses = await getCourses();
    const domainCourses = courses.filter(c => c.disciplineId === disciplineId);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <Link
                href="/admin/courses"
                className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Retour aux Facultés
            </Link>

            <div>
                <h1 className="text-3xl font-bold uppercase tracking-tight flex items-center gap-3">
                    {selectedDiscipline.name.replace(/^[\p{Emoji}\s]+/u, '')}
                    <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-bold text-zinc-500 uppercase tracking-widest">
                        {domainCourses.length} Cours
                    </span>
                </h1>
                <p className="text-zinc-500 mt-1">Gérez les cours de cette faculté.</p>
            </div>

            <CoursesList courses={domainCourses} disciplines={disciplines} activeDisciplineId={disciplineId} />
        </div>
    );
}
