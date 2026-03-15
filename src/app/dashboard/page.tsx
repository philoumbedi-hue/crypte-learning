import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Trophy, ChevronRight, Award, Video } from "lucide-react";
import { LiveSessionCard } from "@/components/LiveSessionCard";
import LiveMeetingTrigger from "@/components/LiveMeetingTrigger";

import { isAdminRole, Role } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/signin");
    }

    if (isAdminRole(session.user.role as Role)) {
        redirect("/admin");
    }

    const enrollments = await db.enrollment.findMany({
        where: { studentId: session.user.id },
        include: {
            course: {
                include: {
                    _count: {
                        select: { modules: true }
                    }
                }
            }
        },
        orderBy: { updatedAt: "desc" }
    });

    const application = await db.application.findFirst({
        where: { userId: session.user.id },
        include: { discipline: true },
        orderBy: { createdAt: "desc" }
    });

    // Enhanced Dashboard Stats Integration
    // For each enrollment, calculate progress
    const enrollmentsWithProgress = await Promise.all(enrollments.map(async (e) => {
        const allVideos = await db.video.findMany({
            where: { module: { courseId: e.courseId } },
            select: { id: true }
        });
        const allVideoIds = allVideos.map(v => v.id);
        const completedCount = allVideoIds.length > 0
            ? await db.videoProgress.count({
                where: { studentId: session.user.id, videoId: { in: allVideoIds }, completed: true }
            })
            : 0;

        const progress = allVideoIds.length > 0 ? (completedCount / allVideoIds.length) : 0;

        // Check if certificate exists for this course
        const certificate = await db.certificate.findUnique({
            where: {
                studentId_courseId: {
                    studentId: session.user.id,
                    courseId: e.courseId
                }
            }
        });

        return {
            ...e,
            progress: Math.round(progress * 100),
            isCompleted: progress === 1 && allVideoIds.length > 0,
            certificateId: certificate?.id || null
        };
    }));

    const certificatesCount = enrollmentsWithProgress.filter(e => e.isCompleted).length;
    const totalVideosCompleted = await db.videoProgress.count({
        where: { studentId: session.user.id, completed: true }
    });

    return (
        <div className="pt-32 pb-8 px-8 max-w-7xl mx-auto space-y-16">
            <div>
                <h2 className="text-xs font-bold tracking-[0.3em] text-zinc-400 uppercase mb-2">Université Numérique</h2>
                <h1 className="text-4xl font-black tracking-tight">CRYPTE – E-learning CRYPTE</h1>
                <p className="text-zinc-500 mt-2 text-lg italic">Étudiant : {session.user.name}</p>
            </div>

            {/* Application Tracking */}
            {application && (
                <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-[2rem] shadow-sm">
                    <h2 className="text-xl font-black uppercase tracking-tight text-indigo-900 mb-4">Suivi de Candidature</h2>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <p className="text-indigo-700 font-medium">Faculté demandée : <span className="font-bold">{application.discipline.name}</span></p>
                            <p className="text-sm text-indigo-500 mt-1">Soumis le {application.createdAt.toLocaleDateString('fr-FR')}</p>
                        </div>
                        <div className="px-6 py-3 bg-white rounded-xl shadow-sm border border-indigo-100 font-bold text-sm tracking-widest uppercase">
                            {application.status === "PENDING" && <span className="text-amber-500">Préliminaire (En attente)</span>}
                            {application.status === "REVIEWING" && <span className="text-blue-500">Évaluation en cours</span>}
                            {application.status === "INTERVIEW" && <span className="text-purple-600">Entretien Programmé</span>}
                            {application.status === "ACCEPTED" && <span className="text-green-600">Accepté - Bienvenue</span>}
                            {application.status === "REJECTED" && <span className="text-red-500">Dossier Refusé</span>}
                        </div>
                    </div>
                    {application.status === "INTERVIEW" && application.interviewDate && (
                        <div className="mt-4 p-4 bg-purple-100 text-purple-800 rounded-xl text-sm font-medium border border-purple-200">
                            Votre entretien d&apos;excellence est prévu pour le : <span className="font-bold">{application.interviewDate.toLocaleString('fr-FR')}</span>. Préparez-vous à échanger sur votre vision stratégique.
                        </div>
                    )}
                </div>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-6">
                    <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl">
                        <BookOpen className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Cours Actifs</div>
                        <div className="text-3xl font-black">{enrollments.length}</div>
                    </div>
                </div>
                <div className={`bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-6 ${certificatesCount === 0 ? "opacity-50 grayscale" : ""}`}>
                    <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl text-yellow-500">
                        <Award className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Certificats</div>
                        <div className="text-3xl font-black">{certificatesCount}</div>
                    </div>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-6">
                    <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl">
                        <Trophy className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Sessions Terminées</div>
                        <div className="text-3xl font-black">{totalVideosCompleted}</div>
                    </div>
                </div>
            </div>

            {/* LIVE SESSIONS SECTION */}
            <section className="space-y-8 pt-8 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                        <h2 className="text-2xl font-black uppercase tracking-tight">Direct & Académie</h2>
                    </div>
                    <Link href="/live" className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-600 transition-colors">
                        Voir tout le calendrier →
                    </Link>
                </div>

                {await (async () => {
                    const liveSessions = await db.liveSession.findMany({
                        where: { status: { in: ["SCHEDULED", "LIVE"] } },
                        include: { course: { select: { title: true } } },
                        orderBy: { startTime: "asc" }
                    });

                    if (liveSessions.length === 0) {
                        return (
                            <div className="p-16 bg-zinc-50 dark:bg-zinc-900/40 rounded-[3.5rem] text-center border border-dashed border-zinc-200 dark:border-zinc-900 shadow-inner">
                                <p className="text-zinc-500 font-bold italic opacity-60">Aucune session live programmée actuellement.</p>
                            </div>
                        );
                    }

                    const liveNow = liveSessions.filter(s => s.status === "LIVE");
                    const upcoming = liveSessions.filter(s => s.status === "SCHEDULED");

                    return (
                        <div className="space-y-8">
                            {liveNow.length > 0 && (
                                <div className="grid grid-cols-1 gap-6">
                                    {liveNow.map((sessionItem) => (
                                        <div key={sessionItem.id} className="relative overflow-hidden rounded-[2.5rem] bg-red-600 p-[1px] group transition-all hover:scale-[1.01]">
                                            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                                                <div className="flex items-center gap-6">
                                                    <div className="p-5 bg-red-600 text-white rounded-3xl animate-pulse shadow-2xl shadow-red-500/50">
                                                        <Video className="w-8 h-8" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-red-600 text-white px-2 py-0.5 rounded-full">EN DIRECT</span>
                                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">{sessionItem.course.title}</span>
                                                        </div>
                                                        <h3 className="text-2xl font-black uppercase tracking-tighter">{sessionItem.title}</h3>
                                                    </div>
                                                </div>
                                                <LiveMeetingTrigger
                                                    sessionId={sessionItem.id}
                                                    isAdmin={isAdminRole(session.user.role as Role) || session.user.role === "TEACHER"}
                                                    buttonClassName="w-full md:w-auto px-10 py-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-500/20 text-center"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {upcoming.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {upcoming.map((sessionItem) => (
                                        <LiveSessionCard
                                            key={sessionItem.id}
                                            session={sessionItem}
                                            user={{
                                                name: session.user.name,
                                                email: session.user.email,
                                                role: session.user.role as Role
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })()}
            </section>

            {/* Enrolled Courses */}
            <section className="space-y-8">
                <div className="flex justify-between items-end">
                    <h2 className="text-2xl font-black uppercase tracking-tight">Mes Programmes</h2>
                    <Link href="/catalogue" className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 border-b-2 border-transparent hover:border-indigo-500 transition-all pb-1">
                        Explorer le catalogue
                    </Link>
                </div>

                {enrollments.length === 0 ? (
                    <div className="bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-3xl p-12 text-center space-y-4 shadow-sm">
                        <p className="text-zinc-500">Vous n&apos;êtes inscrit à aucun cours pour le moment.</p>
                        <Link href="/catalogue" className="inline-block px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold hover:opacity-90 transition shadow-lg">
                            Démarrer l&apos;aventure
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {enrollmentsWithProgress.map((e) => (
                            <Link
                                key={e.id}
                                href={`/courses/${e.courseId}`}
                                className="bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-2xl transition-all duration-500 group flex flex-col hover:-translate-y-2 border-b-4 border-b-zinc-300 dark:border-b-zinc-700"
                            >
                                <div className="p-10 flex-1 flex flex-col">
                                    <div className="flex justify-between items-center mb-8">
                                        <div className="text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-500 border border-zinc-200/50">
                                            {e.status}
                                        </div>
                                        {e.isCompleted && (
                                            <div className="flex items-center gap-2 text-indigo-600 font-black text-[9px] uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/30 px-3 py-1 rounded-lg">
                                                <Award className="w-4 h-4" /> Certifié
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-3xl font-black mb-6 leading-tight uppercase group-hover:text-indigo-600 transition-colors">
                                        {e.course.title}
                                    </h3>

                                    {/* Progress Indicator */}
                                    <div className="mt-auto space-y-4">
                                        <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                            <span>Maitrise du Contenu</span>
                                            <span className="text-slate-900 dark:text-white">{e.progress}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-600 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(79,70,229,0.3)]"
                                                style={{ width: `${e.progress}%` }}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between pt-6">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                                {e.course._count.modules} Modules académiques
                                            </div>
                                            {e.certificateId ? (
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-600 group-hover:gap-4 transition-all">
                                                    Voir le Certificat <Award className="w-4 h-4" />
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 group-hover:gap-4 transition-all">
                                                    Reprendre l&apos;étude <ChevronRight className="w-4 h-4" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

