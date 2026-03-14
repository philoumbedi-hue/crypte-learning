import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import LearnSidebar from "./learn-sidebar";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { hasRequiredRole } from "@/lib/rbac";
import type { Role } from "@/lib/rbac";


export default async function LearnLayout({
    children,
    params
}: {
    children: React.ReactNode,
    params: { id: string }
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/signin");
    }

    const enrollment = session?.user ? await db.enrollment.findUnique({
        where: {
            studentId_courseId: {
                studentId: session.user.id,
                courseId: params.id
            }
        }
    }) : null;

    const isEnrolled = !!enrollment || hasRequiredRole(session?.user?.role as Role, "MODERATOR");

    const course = await db.course.findUnique({
        where: { id: params.id },
        include: {
            modules: {
                orderBy: { order: "asc" },
                include: {
                    videos: { orderBy: { createdAt: "asc" } },
                    documents: { orderBy: { createdAt: "asc" } },
                }
            }
        }
    });

    if (!course) notFound();

    return (
        <div className="flex h-screen bg-white dark:bg-black overflow-hidden">
            <LearnSidebar
                course={course}
                modules={course.modules}
                isEnrolled={isEnrolled}
            />
            <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-zinc-950 overflow-y-auto">
                <header className="h-16 px-8 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <GraduationCap className="w-6 h-6" />
                        <span className="font-extrabold tracking-tighter">CRYPTE CLASSROOM</span>
                    </div>
                    <Link href="/dashboard" className="text-xs font-bold px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg hover:bg-zinc-200 transition">
                        Mon Dashboard
                    </Link>
                </header>
                <div className="flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
}
