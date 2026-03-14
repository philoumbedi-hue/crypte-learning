import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import EnrollmentButton from "./enroll-button";
import CertificateButton from "@/components/CertificateButton";
import { BookOpen, Video, FileText, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ReviewSection, { Review } from "@/components/review-section";
import { getCourseReviews } from "@/actions/review";

export const dynamic = "force-dynamic";

export default async function CoursePage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    const course = await db.course.findUnique({
        where: { id: params.id },
        include: {
            discipline: true,
            modules: {
                orderBy: { order: "asc" },
                include: {
                    _count: {
                        select: { videos: true, documents: true }
                    }
                }
            }
        }
    });

    const reviews = course ? await getCourseReviews(course.id) : [];

    if (!course) notFound();

    const enrollment = session?.user ? await db.enrollment.findUnique({
        where: {
            studentId_courseId: {
                studentId: session.user.id,
                courseId: course.id
            }
        }
    }) : null;

    const certificate = session?.user ? await db.certificate.findUnique({
        where: {
            studentId_courseId: {
                studentId: session.user.id,
                courseId: course.id
            }
        }
    }) : null;

    const isEnrolled = !!enrollment;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black pt-32">
            <div className="max-w-7xl mx-auto px-8 pb-12">
                <Link
                    href={`/catalogue?discipline=${course.disciplineId}`}
                    className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors mb-8 inline-block"
                >
                    ← Retour au catalogue
                </Link>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Side: Course Info & Content */}
                    <div className="lg:col-span-2 space-y-12">
                        <div>
                            <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">
                                {course.discipline.name}
                            </div>
                            {course.imageUrl && (
                                <div className="aspect-video w-full overflow-hidden rounded-2xl mb-8 border border-zinc-200 dark:border-zinc-800 relative">
                                    <Image
                                        src={course.imageUrl}
                                        alt={course.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <h1 className="text-5xl font-extrabold tracking-tight mb-6">{course.title}</h1>
                            <p className="text-xl text-zinc-500 leading-relaxed">
                                {course.description || "Description détaillée bientôt disponible pour ce cours."}
                            </p>
                        </div>

                        {/* Course Specific Live Sessions */}
                        {await (async () => {
                            const liveSessions = await db.liveSession.findMany({
                                where: {
                                    courseId: course.id,
                                    status: { in: ["SCHEDULED", "LIVE"] }
                                },
                                orderBy: { startTime: "asc" }
                            });

                            const hasLiveSession = liveSessions.some(ls => ls.status === "LIVE");

                            return (
                                <section className="space-y-6">
                                    <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                                        {hasLiveSession && <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />}
                                        <h3 className="text-xl font-black uppercase tracking-tight">Direct & Prochaines Séances</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {liveSessions.map(ls => (
                                            <Link
                                                key={ls.id}
                                                href={ls.status === "LIVE" ? `/live/${ls.id}` : "/live"}
                                                className={cn(
                                                    "p-6 rounded-[2rem] border transition-all flex flex-col gap-4 group",
                                                    ls.status === "LIVE"
                                                        ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 hover:shadow-lg hover:shadow-red-500/10"
                                                        : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-indigo-500"
                                                )}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className={cn(
                                                        "px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest",
                                                        ls.status === "LIVE" ? "bg-red-600 text-white animate-pulse" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                                                    )}>
                                                        {ls.status === "LIVE" ? "En Direct" : "Programmée"}
                                                    </div>
                                                    <div className="p-2 bg-zinc-50 dark:bg-zinc-950 rounded-xl">
                                                        <Video className={cn("w-4 h-4", ls.status === "LIVE" ? "text-red-500" : "text-zinc-400")} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg mb-1">{ls.title}</h4>
                                                    <div className="text-xs text-zinc-500 font-medium">
                                                        {new Date(ls.startTime).toLocaleString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            );
                        })()}

                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold flex items-center gap-3">
                                <BookOpen className="w-6 h-6" /> Programme du cours
                            </h3>

                            <div className="space-y-4">
                                {course.modules.map((module) => (
                                    <div key={module.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="text-xs font-semibold text-zinc-400 lowercase first-letter:uppercase">Module {module.order}</div>
                                                {module.order === 1 && !isEnrolled && (
                                                    <span className="text-[9px] font-black bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full uppercase tracking-tighter">Accès Libre</span>
                                                )}
                                            </div>
                                            <h4 className="text-lg font-bold">{module.title}</h4>
                                            <div className="flex items-center gap-6 mt-2">
                                                <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                                                    <Video className="w-3.5 h-3.5" /> {module._count.videos} Vidéos
                                                </span>
                                                <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                                                    <FileText className="w-3.5 h-3.5" /> {module._count.documents} Supports
                                                </span>
                                            </div>
                                        </div>

                                        {isEnrolled || module.order === 1 ? (
                                            <Link
                                                href={`/courses/${course.id}/learn`}
                                                className={cn(
                                                    "px-6 py-2 rounded-xl font-bold transition text-sm",
                                                    module.order === 1 && !isEnrolled
                                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                                        : "bg-black dark:bg-white text-white dark:text-black hover:opacity-90"
                                                )}
                                            >
                                                {module.order === 1 && !isEnrolled ? "Découvrir" : "Accéder"}
                                            </Link>
                                        ) : (
                                            <div className="flex items-center gap-2 text-zinc-400">
                                                <Lock className="w-4 h-4" />
                                                <span className="text-xs font-bold uppercase tracking-wide">Privé</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Sidebar / CTA */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl space-y-8">
                            <div>
                                <h3 className="text-lg font-bold mb-2">Inscription académique</h3>
                                <p className="text-sm text-zinc-500">Rejoignez ce cours pour accéder aux ressources pédagogiques et obtenir votre certificat.</p>
                            </div>

                            <EnrollmentButton
                                courseId={course.id}
                                isEnrolled={isEnrolled}
                                isLoggedIn={!!session}
                                courseTitle={course.title}
                                userId={session?.user?.id}
                            />

                            {certificate && session?.user?.name && (
                                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
                                    <h3 className="text-sm font-bold text-amber-600">Félicitations, vous êtes certifié !</h3>
                                    <CertificateButton
                                        certificateId={certificate.id}
                                        studentName={session.user.name}
                                        courseTitle={course.title}
                                        issueDate={certificate.createdAt}
                                    />
                                </div>
                            )}

                            <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                <div className="flex items-center gap-3 text-sm font-medium">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    Accès illimité à vie
                                </div>
                                <div className="flex items-center gap-3 text-sm font-medium">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    Certificat de réussite inclus
                                </div>
                                <div className="flex items-center gap-3 text-sm font-medium">
                                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                    Support d&apos;apprentissage
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-12">
                    {(() => {
                        // This will be handled by a client component, but we can pass initial data
                        return <ReviewSection courseId={course.id} initialReviews={reviews as Review[]} />;
                    })()}
                </div>
            </div>
        </div>
    );
}
