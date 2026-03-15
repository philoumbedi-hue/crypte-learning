```
import db from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Video, Plus, Calendar, Clock, Trash2, CheckCircle, XCircle } from "lucide-react";
import { deleteLiveSession, updateLiveSessionStatus } from "@/actions/live-session";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
    SCHEDULED: "bg-indigo-100 text-indigo-700 border border-indigo-200",
    LIVE: "bg-red-100 text-red-700 border border-red-200 animate-pulse",
    FINISHED: "bg-zinc-100 text-zinc-500 border border-zinc-200",
};

export default async function LiveSessionsPage() {
    const sessions = await db.liveSession.findMany({
        include: {
            course: {
                select: { title: true }
            }
        },
        orderBy: { startTime: "desc" }
    });

    return (
        <div className="p-8 space-y-8">
            <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Retour au Dashboard
            </Link>

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black tracking-tight uppercase">Visioconférences</h1>
                    <p className="text-zinc-500 font-medium">Gérez vos sessions de cours en direct. Changez le statut en un clic.</p>
                </div>
                <Link
                    href="/admin/live-sessions/new"
                    className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold hover:opacity-90 transition shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    Nouvelle Session
                </Link>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Session & Cours</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Date & Heure</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Statut & Contrôles</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Lien Visio</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {sessions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-16 text-center text-zinc-500 italic">
                                        Aucune session programmée pour le moment.
                                    </td>
                                </tr>
                            ) : (
                                sessions.map((session) => (
                                    <tr key={session.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`p - 3 rounded - xl ${ session.status === "LIVE" ? "bg-red-100 text-red-600" : "bg-zinc-100 dark:bg-zinc-800 text-indigo-500" } group - hover: scale - 110 transition - transform`}>
                                                    {session.status === "LIVE" ? <Radio className="w-5 h-5 animate-pulse" /> : <Video className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm uppercase">{session.title}</div>
                                                    <div className="text-xs text-zinc-400 font-medium">{session.course.title}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 dark:text-zinc-300">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {format(new Date(session.startTime), "PPP", { locale: fr })}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {format(new Date(session.startTime), "p", { locale: fr })}
                                                    {session.endTime && ` — ${ format(new Date(session.endTime), "p", { locale: fr }) } `}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="space-y-3">
                                                {/* Current status badge */}
                                                <span className={`px - 3 py - 1 rounded - full text - [10px] font - black uppercase tracking - widest ${ STATUS_STYLES[session.status] || "bg-zinc-100 text-zinc-500" } `}>
                                                    {session.status}
                                                </span>
                                                {/* Status toggle buttons */}
                                                <div className="flex gap-1 flex-wrap">
                                                    {(["SCHEDULED", "LIVE", "FINISHED"] as const).filter(s => s !== session.status).map((targetStatus) => (
                                                        <form key={targetStatus} action={async () => {
                                                            "use server";
                                                            await updateLiveSessionStatus(session.id, targetStatus);
                                                        }}>
                                                            <button
                                                                type="submit"
                                                                title={`Passer en ${ targetStatus } `}
                                                                className={`px - 2 py - 1 rounded - lg text - [9px] font - black uppercase tracking - widest border transition - all hover: opacity - 80 ${
    targetStatus === "LIVE" ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" :
    targetStatus === "FINISHED" ? "bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-zinc-100" :
        "bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100"
} `}
                                                            >
                                                                {targetStatus === "LIVE" ? "▶ Lancer" : targetStatus === "FINISHED" ? "✓ Terminer" : "⏸ Programmer"}
                                                            </button>
                                                        </form>
                                                    ))}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <Link
                                                href={`/ live / ${ session.id } `}
                                                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-bold text-xs group"
                                            >
                                                Accéder à la plateforme <Video className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                            </Link>
                                        </td>
                                        <td className="p-6 text-right">
                                            <form action={async () => {
                                                "use server";
                                                await deleteLiveSession(session.id);
                                            }}>
                                                <button className="p-2 text-zinc-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
