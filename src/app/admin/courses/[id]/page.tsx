import db from "@/lib/db";
import { getModulesForCourse } from "@/actions/module";
import CourseDetailClient from "./course-detail-client";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
    const course = await db.course.findUnique({
        where: { id: params.id },
        include: { discipline: true }
    });

    if (!course) notFound();

    const modules = await getModulesForCourse(params.id);

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <Link
                href="/admin/courses"
                className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors mb-6 inline-block"
            >
                ← Retour à la liste des cours
            </Link>

            <div className="mb-12">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                    {course.discipline.name}
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight">{course.title}</h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-lg">
                    {course.description || "Gérez les modules et les ressources de ce cours."}
                </p>
            </div>

            <CourseDetailClient course={course} modules={modules} />
        </div>
    );
}
