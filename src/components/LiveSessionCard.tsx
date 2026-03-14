import { Video, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import LiveMeetingTrigger from "./LiveMeetingTrigger";
import { Role, isAdminRole } from "@/lib/rbac-shared";

interface LiveSessionCardProps {
    session: {
        id: string;
        title: string;
        description: string | null;
        meetUrl: string;
        startTime: Date;
        endTime: Date | null;
        status: string;
        course: {
            title: string;
        };
    };
    user?: {
        name?: string | null;
        email?: string | null;
        role?: Role;
    };
}

export function LiveSessionCard({ session, user }: LiveSessionCardProps) {
    const isLive = session.status === "LIVE";
    const isAdmin = user?.role ? (isAdminRole(user.role as Role) || user.role === "TEACHER") : false;

    return (
        <div className={`relative group bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col ${isLive ? 'ring-2 ring-red-500' : ''}`}>
            {isLive && (
                <div className="absolute top-6 left-6 z-10 px-4 py-1.5 bg-red-600 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full animate-pulse shadow-lg">
                    En Direct
                </div>
            )}

            <div className="p-10 flex-1 flex flex-col space-y-6">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl text-zinc-400 group-hover:text-indigo-500 transition-colors">
                        <Video className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                            {session.course.title}
                        </div>
                        <h3 className="text-2xl font-black leading-tight uppercase tracking-tight">
                            {session.title}
                        </h3>
                    </div>
                </div>

                {session.description && (
                    <p className="text-zinc-500 text-sm font-medium leading-relaxed line-clamp-2 italic">
                        &quot;{session.description}&quot;
                    </p>
                )}

                <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
                    <div className="flex items-center gap-3 text-xs font-bold">
                        <Calendar className="w-4 h-4 text-zinc-400" />
                        <span>{format(new Date(session.startTime), "PPP", { locale: fr })}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-zinc-400">
                        <Clock className="w-4 h-4" />
                        <span>
                            {format(new Date(session.startTime), "p", { locale: fr })}
                            {session.endTime && ` — ${format(new Date(session.endTime), "p", { locale: fr })}`}
                        </span>
                    </div>
                </div>

                <div className="pt-6">
                    {isLive ? (
                        <LiveMeetingTrigger
                            sessionId={session.id}
                            roomName={session.meetUrl.split('/').pop() || session.id}
                            userName={user?.name || "Invité"}
                            userEmail={user?.email || ""}
                            isAdmin={isAdmin}
                            courseTitle={session.course.title}
                            sessionTitle={session.title}
                        />
                    ) : (
                        <div className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed">
                            <Clock className="w-3.5 h-3.5" />
                            Session Programmée
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
