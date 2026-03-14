import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, VideoOff } from "lucide-react";
import { isAdminRole, Role } from "@/lib/rbac-shared";
import JitsiMeetComponent from "@/components/JitsiMeetComponent";
import EndLiveButton from "@/components/EndLiveButton";
import LiveStatusGuard from "@/components/LiveStatusGuard";


export default async function LiveSessionPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/auth/signin");
    }

    const liveSession = await db.liveSession.findUnique({
        where: { id: params.id },
        include: {
            course: true,
        }
    });

    if (!liveSession) {
        redirect("/dashboard");
    }

    // Live sessions are now restricted to enrolled students as per requested security.
    const isEnrolled = !!(session?.user?.id && (await db.enrollment.findUnique({
        where: { studentId_courseId: { studentId: session.user.id, courseId: liveSession.courseId } }
    })));

    const isAdmin = isAdminRole(session.user.role as Role) || session.user.role === "TEACHER";

    if (!isAdmin && !isEnrolled) {
        redirect(`/courses/${liveSession.courseId}`);
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black pt-32 pb-10 flex flex-col">
            <LiveStatusGuard sessionId={liveSession.id} redirectUrl="/dashboard" />
            <div className="max-w-7xl mx-auto w-full px-8 flex-1 flex flex-col gap-8">
                <div className="flex items-center">
                    <Link
                        href={`/courses/${liveSession.courseId}`}
                        className="group flex items-center gap-3 px-6 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-indigo-600 hover:border-indigo-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Retour au Cours
                    </Link>
                </div>
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full animate-pulse shadow-lg shadow-red-500/20">
                                En Direct
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                                {liveSession.course.title}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none">
                            {liveSession.title}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {isAdmin && <EndLiveButton sessionId={liveSession.id} />}
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-red-500 hover:border-red-500 rounded-2xl text-xs font-black uppercase tracking-widest transition-all group"
                        >
                            <VideoOff className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Quitter la session
                        </Link>
                    </div>
                </div>

                {/* Jitsi Integrated Container */}
                <main className="flex-1 relative bg-black rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white dark:border-zinc-900 min-h-[600px] flex items-center justify-center">
                    <JitsiMeetComponent
                        roomName={liveSession.meetUrl.split('/').pop() || liveSession.id}
                        userName={session.user.name || "Étudiant"}
                        userEmail={session.user.email || ""}
                        isAdmin={isAdmin}
                    />
                </main>

                {/* Info Footer */}
                <div className="p-8 bg-zinc-100 dark:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center shadow-sm">
                            <ArrowLeft className="w-5 h-5 text-zinc-400" />
                        </div>
                        <p className="text-sm text-zinc-500 font-medium italic">
                            {liveSession.description || "Échange doctrinal de haut niveau en cours."}
                        </p>
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                        CRYPTE • ACADEMY LIVE
                    </div>
                </div>
            </div>
        </div>
    );
}
