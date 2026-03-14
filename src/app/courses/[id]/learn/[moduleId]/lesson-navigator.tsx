"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Play, FileText, Anchor, Search, CheckCircle2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Lesson {
    id: string;
    title: string;
    order?: number;
}

interface Heading {
    id: string;
    text: string;
    level: number;
}

interface LessonNavigatorProps {
    lessons: Lesson[];
    currentLessonId: string;
    content?: string | null;
}

interface TipTapNode {
    type: string;
    content?: TipTapNode[];
    text?: string;
    attrs?: {
        level?: number;
    };
}

export default function LessonNavigator({ lessons, currentLessonId, content }: LessonNavigatorProps) {
    const router = useRouter();
    const params = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [headings, setHeadings] = useState<Heading[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    const currentLesson = lessons?.find(l => l.id === currentLessonId);

    // Extract headings for internal navigation

    useEffect(() => {
        if (!content) return;

        const extractedHeadings: Heading[] = [];

        try {
            const parsed = JSON.parse(content);
            if (parsed.type === "doc" && Array.isArray(parsed.content)) {
                parsed.content.forEach((node: TipTapNode, index: number) => {
                    if (node.type === "heading" && (node.attrs?.level === 2 || node.attrs?.level === 3)) {
                        const text = node.content?.map((c) => c.text).join("") || "";
                        if (text) {
                            // Slugify text for ID if not present
                            const id = `heading-${index}-${text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")}`;
                            extractedHeadings.push({
                                id,
                                text,
                                level: node.attrs.level
                            });
                        }
                    }
                });
            }
        } catch {
            // Fallback for markdown or plain text (simple regex for # or ##)
            const lines = content.split("\n");
            lines.forEach((line, index) => {
                const match = line.match(/^(#{2,3})\s+(.+)$/);
                if (match) {
                    const level = match[1].length;
                    const text = match[2].trim();
                    const id = `heading-${index}-${text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")}`;
                    extractedHeadings.push({ id, text, level });
                }
            });
        }

        setHeadings(extractedHeadings);
    }, [content]);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100; // Account for sticky header
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className="sticky top-4 z-50 w-full mb-8">
            <div className="relative group">
                {/* Main Trigger */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "w-full flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl transition-all duration-300 hover:border-zinc-400 dark:hover:border-zinc-600",
                        isOpen && "rounded-b-none border-b-transparent shadow-none"
                    )}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black rounded-xl">
                            <Play className="w-5 h-5 fill-current" />
                        </div>
                        <div className="text-left">
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Leçon Actuelle</div>
                            <div className="font-bold text-sm truncate max-w-[200px] md:max-w-md">
                                {currentLesson?.title || "Sélectionner une leçon"}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link
                            href={`/courses/${params.id}`}
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                            className="hidden lg:flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-500 hover:text-indigo-600 hover:border-indigo-100 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                        >
                            <Anchor className="w-3 h-3 -rotate-90" />
                            Retour
                        </Link>

                        <div className="h-8 w-px bg-zinc-100 dark:divide-zinc-800 hidden lg:block" />

                        <div className="hidden md:flex flex-col items-end mr-4">
                            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Navigation</div>
                            <div className="text-[10px] font-bold text-blue-600">{(lessons || []).length} Leçons disponibles</div>
                        </div>

                        <ChevronDown className={cn("w-5 h-5 text-zinc-400 transition-transform duration-300", isOpen && "rotate-180")} />
                    </div>
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute top-full left-0 w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 border-t-0 rounded-b-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-x-0 md:divide-x divide-zinc-100 dark:divide-zinc-900">

                            {/* Left Side: Lesson List */}
                            <div className="p-4 space-y-1 max-h-[50vh] overflow-y-auto no-scrollbar">
                                <div className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 flex items-center gap-2">
                                    <Play className="w-3 h-3" /> Playliste du Module
                                </div>
                                {(lessons || []).map((lesson) => (

                                    <button
                                        key={lesson.id}
                                        onClick={() => {
                                            router.push(`/courses/${params.id}/learn/${lesson.id}`);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "w-full flex items-center gap-3 p-3 rounded-xl text-left text-sm transition-all group",
                                            lesson.id === currentLessonId
                                                ? "bg-zinc-100 dark:bg-zinc-900 font-bold text-black dark:text-white"
                                                : "hover:bg-zinc-50 dark:hover:bg-zinc-900/50 text-zinc-500 hover:text-black dark:hover:text-white"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-6 h-6 flex items-center justify-center rounded-lg text-[10px] shrink-0",
                                            lesson.id === currentLessonId
                                                ? "bg-black text-white dark:bg-white dark:text-black"
                                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 group-hover:bg-zinc-200"
                                        )}>
                                            {lesson.id === currentLessonId ? <CheckCircle2 className="w-3 h-3" /> : (lesson.order || "•")}
                                        </div>
                                        <span className="truncate">{lesson.title}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Right Side: Internal Summaries / Headings */}
                            <div className="p-4 space-y-1 bg-zinc-50/50 dark:bg-zinc-900/20 max-h-[50vh] overflow-y-auto no-scrollbar">
                                <div className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 flex items-center gap-2">
                                    <Anchor className="w-3 h-3" /> Sommaire & Doctrine
                                </div>
                                {headings.length > 0 ? (
                                    <>
                                        {headings.map((heading) => (
                                            <button
                                                key={heading.id}
                                                onClick={() => scrollToHeading(heading.id)}
                                                className={cn(
                                                    "w-full text-left p-3 rounded-xl text-sm transition-all",
                                                    heading.level === 2 ? "font-bold text-zinc-700 dark:text-zinc-300" : "pl-8 text-zinc-500 text-xs italic",
                                                    "hover:bg-white dark:hover:bg-zinc-800 hover:shadow-sm"
                                                )}
                                            >
                                                {heading.text}
                                            </button>
                                        ))}
                                    </>
                                ) : (
                                    <div className="p-8 text-center space-y-3">
                                        <FileText className="w-8 h-8 mx-auto text-zinc-300" />
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Aucun sommaire détaillé pour cette leçon</p>
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* Search / Status Footbar */}
                        <div className="p-4 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/80 dark:bg-zinc-900/50 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                            <div className="flex items-center gap-2">
                                <Search className="w-3 h-3" /> Rechercher dans le module
                            </div>
                            <div>CRYPTE ACADEMY — SOUVERAINETÉ NUMÉRIQUE</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
