import db from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ModuleDetailClient from "./module-detail-client";
import { Role, hasRequiredRole } from "@/lib/rbac-shared";

export const dynamic = "force-dynamic";

export default async function AdminModuleDetailPage({
    params
}: {
    params: { id: string, moduleId: string }
}) {
    const session = await getServerSession(authOptions);
    if (!session || !hasRequiredRole(session.user.role as Role, "TEACHER")) {
        redirect("/");
    }

    const course = await db.course.findUnique({
        where: { id: params.id },
        select: { id: true, title: true }
    });

    if (!course) return notFound();

    const rawModuleData = await db.module.findUnique({
        where: { id: params.moduleId },
        include: {
            videos: { orderBy: { order: "asc" } },
            documents: { orderBy: { createdAt: "desc" } },
            quizzes: {
                include: {
                    questions: true
                },
                orderBy: { createdAt: "desc" }
            }
        }
    });

    if (!rawModuleData) return notFound();

    const moduleData = {
        ...rawModuleData,
        quizzes: rawModuleData.quizzes.map(quiz => ({
            ...quiz,
            questions: quiz.questions.map(q => ({
                ...q,
                options: (Array.isArray(q.options) ? q.options : []) as string[]
            }))
        }))
    };

    return <ModuleDetailClient course={course} moduleData={moduleData} />;
}
