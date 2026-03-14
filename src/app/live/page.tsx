import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LiveSessionCard } from "@/components/LiveSessionCard";
import { Radio, Calendar, History, ShieldAlert, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Role } from "@/lib/rbac-shared";

export const dynamic = "force-dynamic";

export default async function LiveListingPage() {
    const session = await getServerSession(authOptions);

    const allSessions = await db.liveSession.findMany({
        include: {
            course: {
                select: { title: true, imageUrl: true }
            }
        },
        orderBy: { startTime: "desc" }
    });

    const liveSessions = allSessions.filter(s => s.status === "LIVE");
    const scheduledSessions = allSessions.filter(s => s.status === "SCHEDULED");
    const pastSessions = allSessions.filter(s => s.status === "FINISHED");

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-8 space-y-20">

                {/* Header Section */}
                <div className="flex flex-col items-center gap-10">
                    <div className="w-full flex justify-start">
                        <Link
                            href="/dashboard"
                            className="group flex items-center gap-3 px-6 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-indigo-600 hover:border-indigo-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-sm"
                        >
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Retour au Tableau de Bord
                        </Link>
                    </div>
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-500/20 animate-pulse">
                            <Radio className="w-3 h-3" /> Académie en Direct
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight uppercase">
                            SESSIONS <span className="text-red-600">MAGISTRALES</span>
                        </h1>
                        <p className="text-zinc-500 max-w-2xl mx-auto text-lg font-medium italic">
                            &quot;La connaissance ne vaut que si elle est partagée en temps réel par les maîtres de la doctrine.&quot;
                        </p>
                    </div>
                </div>

                {/* LIVE NOW SECTION */}
                <section className="space-y-10">
                    <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                        <div className="w-3 h-3 bg-red-600 rounded-full animate-ping" />
                        <h2 className="text-2xl font-black uppercase tracking-tighter">En Direct Maintenant</h2>
                    </div>

                    {liveSessions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {liveSessions.map(sessionItem => (
                                <LiveSessionCard
                                    key={sessionItem.id}
                                    session={sessionItem}
                                    user={session?.user ? {
                                        name: session.user.name,
                                        email: session.user.email,
                                        role: session.user.role as Role
                                    } : undefined}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="p-20 bg-white dark:bg-zinc-900 rounded-[3rem] border border-dashed border-zinc-200 dark:border-zinc-800 text-center space-y-4">
                            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto text-zinc-400">
                                <Radio className="w-8 h-8 opacity-20" />
                            </div>
                            <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Aucune session en cours</p>
                            {!session && (
                                <Link href="/auth/signin" className="inline-block text-indigo-600 font-black text-[10px] uppercase tracking-widest border-b border-indigo-600 pb-1">
                                    Inscrivez-vous pour recevoir les alertes
                                </Link>
                            )}
                        </div>
                    )}
                </section>

                {/* SCHEDULED SECTION */}
                <section className="space-y-10">
                    <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                        <Calendar className="w-6 h-6 text-zinc-400" />
                        <h2 className="text-2xl font-black uppercase tracking-tighter">Prochaines Séances</h2>
                    </div>

                    {scheduledSessions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {scheduledSessions.map(sessionItem => (
                                <LiveSessionCard
                                    key={sessionItem.id}
                                    session={sessionItem}
                                    user={session?.user ? {
                                        name: session.user.name,
                                        email: session.user.email,
                                        role: session.user.role as Role
                                    } : undefined}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-zinc-500 italic text-center py-10">Le calendrier est en cours de finalisation par le conseil académique.</p>
                    )}
                </section>

                {/* REPLAYS / PAST SECTION */}
                {pastSessions.length > 0 && (
                    <section className="space-y-10">
                        <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                            <History className="w-6 h-6 text-zinc-400" />
                            <h2 className="text-2xl font-black uppercase tracking-tighter text-zinc-400">Archives & Replays</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 opacity-60 hover:opacity-100 transition-opacity">
                            {pastSessions.map(s => (
                                <div key={s.id} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 group transition-all">
                                    <h4 className="font-bold text-sm truncate mb-1">{s.title}</h4>
                                    <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest mb-4">{s.course.title}</p>
                                    <div className="flex items-center justify-between text-[10px] font-bold">
                                        <span className="text-zinc-500">{new Date(s.startTime).toLocaleDateString()}</span>
                                        <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">Terminée</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Warning Footer */}
                <div className="bg-zinc-900 text-white p-12 rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-8 border-b-8 border-indigo-600 shadow-2xl">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-white/10 rounded-2xl">
                            <ShieldAlert className="w-8 h-8 text-indigo-400" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-black uppercase tracking-tight">Accès Restreint</h3>
                            <p className="text-zinc-400 text-sm max-w-md">La participation aux sessions interactives nécessite une inscription active à la faculté correspondante.</p>
                        </div>
                    </div>
                    <Link href="/catalogue" className="px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:scale-105 transition-all">
                        Explorer les Facultés
                    </Link>
                </div>

            </div>
        </div>
    );
}
