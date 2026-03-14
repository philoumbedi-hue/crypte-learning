"use client";

import { ChevronDown, ChevronUp, PlayCircle, FileText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface Module {
    id: string;
    title: string;
    order: number;
    videos: { id: string, title: string }[];
    documents: { id: string, title: string }[];
}

export default function LearnSidebar({
    course,
    modules,
    isEnrolled
}: {
    course: { id: string, title: string },
    modules: Module[],
    isEnrolled: boolean
}) {
    const params = useParams();
    const currentVideoId = params.moduleId as string;
    const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(
        modules.reduce((acc, m) => ({ ...acc, [m.id]: true }), {})
    );

    const toggleModule = (id: string) => {
        setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <aside className="w-80 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col h-full overflow-hidden">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <Link href={`/courses/${course.id}`} className="text-xs font-bold text-zinc-400 hover:text-black dark:hover:text-white transition uppercase tracking-widest mb-2 block">
                    ← Retour au cours
                </Link>
                <h2 className="font-extrabold text-lg line-clamp-2">{course.title}</h2>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-3 space-y-2">
                {modules.map((module) => (
                    <div key={module.id} className="space-y-1">
                        <button
                            onClick={() => toggleModule(module.id)}
                            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition text-left"
                        >
                            <div className="flex items-center gap-2 truncate pr-2">
                                <span className="text-sm font-bold">
                                    {module.order}. {module.title}
                                </span>
                                {module.order === 1 && !isEnrolled && (
                                    <span className="text-[8px] font-black bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded uppercase tracking-tighter shrink-0">Libre</span>
                                )}
                                {module.order > 1 && !isEnrolled && (
                                    <span className="text-zinc-400 shrink-0">🔒</span>
                                )}
                            </div>
                            {expandedModules[module.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {expandedModules[module.id] && (
                            <div className="pl-4 space-y-1">
                                {module.videos.map((video: { id: string, title: string }) => {
                                    const isLocked = !isEnrolled && module.order > 1;

                                    if (isLocked) {
                                        return (
                                            <div
                                                key={video.id}
                                                className="flex items-center gap-3 p-3 rounded-xl text-sm text-zinc-400 cursor-not-allowed opacity-60"
                                            >
                                                <PlayCircle className="w-4 h-4 shrink-0 text-zinc-300" />
                                                <span className="truncate">{video.title}</span>
                                            </div>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={video.id}
                                            href={`/courses/${course.id}/learn/${video.id}`}
                                            className={cn(
                                                "flex items-center gap-3 p-3 rounded-xl text-sm transition group",
                                                currentVideoId === video.id
                                                    ? "bg-black text-white dark:bg-white dark:text-black font-bold"
                                                    : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                                            )}
                                        >
                                            <PlayCircle className={cn("w-4 h-4 shrink-0", currentVideoId === video.id ? "text-white dark:text-black" : "text-zinc-400 group-hover:text-black dark:group-hover:text-white")} />
                                            <span className="truncate">{video.title}</span>
                                        </Link>
                                    );
                                })}

                                {module.documents.map((doc: { id: string, title: string }) => (
                                    <div
                                        key={doc.id}
                                        className="flex items-center gap-3 p-3 rounded-xl text-sm text-zinc-400 cursor-not-allowed italic"
                                    >
                                        <FileText className="w-4 h-4 shrink-0" />
                                        <span className="truncate">{doc.title}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <div className="text-[10px] font-black uppercase text-zinc-400 mb-2 tracking-tighter">Progression</div>
                <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-black dark:bg-white w-[0%] transition-all"></div>
                </div>
            </div>
        </aside>
    );
}
