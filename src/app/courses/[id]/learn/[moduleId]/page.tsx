import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { FileText, ChevronLeft, ChevronRight, BookOpen, Video, Download } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import VideoPlayer from "@/components/video-player";
import { hasRequiredRole } from "@/lib/rbac";
import type { Role } from "@/lib/rbac";
import LessonNavigator from "./lesson-navigator";
import ForumSection from "@/components/forum-section";
import { getForumQuestions } from "@/actions/forum";
import Image from "next/image";

interface TipTapNode {
    type: string;
    content?: TipTapNode[];
    text?: string;
    attrs?: {
        src?: string;
        alt?: string;
        level?: number;
    };
    marks?: { type: string }[];
}



export const dynamic = "force-dynamic";

export default async function VideoPage({ params }: { params: { id: string; moduleId: string } }) {
    const session = await getServerSession(authOptions);

    // Fetch the video with its module and course info
    const videoResult = await db.video.findUnique({
        where: { id: params.moduleId },
        include: {
            module: {
                include: {
                    course: {
                        include: {
                            modules: {
                                orderBy: { order: "asc" },
                                include: {
                                    videos: { orderBy: { createdAt: "asc" } },
                                    documents: { orderBy: { createdAt: "asc" } },
                                }
                            }
                        }
                    },
                    documents: { orderBy: { createdAt: "asc" } },
                    videos: { orderBy: { order: "asc" } },
                }
            },

            videoProgress: session?.user?.id ? {
                where: { studentId: session.user.id }
            } : false,
        }
    });

    const video = videoResult;

    if (!video) notFound();

    // SERVER-SIDE SECURITY: Protected modules 2+ for non-enrolled students
    const isEnrolled = !!(session?.user?.id && (await db.enrollment.findUnique({
        where: { studentId_courseId: { studentId: session.user.id, courseId: params.id } }
    }))) || hasRequiredRole(session?.user?.role as Role, "MODERATOR");

    const isDiscoveryPhase = video.module.order === 1;

    if (!isEnrolled && !isDiscoveryPhase) {
        redirect(`/courses/${params.id}`);
    }

    // Get last saved timestamp for auto-resume
    const savedProgress = session?.user?.id
        ? await db.videoProgress.findUnique({
            where: {
                studentId_videoId: {
                    studentId: session.user.id,
                    videoId: video.id,
                }
            }
        })
        : null;

    const initialTimestamp = savedProgress?.timestamp ?? 0;

    // Build a flat list of all videos across all modules for prev/next navigation
    const course = video.module.course;
    const allVideos: { id: string; title: string; moduleTitle: string }[] = [];
    for (const mod of course.modules) {
        for (const v of mod.videos) {
            allVideos.push({ id: v.id, title: v.title, moduleTitle: mod.title });
        }
    }
    const currentIndex = allVideos.findIndex(v => v.id === video.id);
    const prevVideo = currentIndex > 0 ? allVideos[currentIndex - 1] : null;
    const nextVideo = currentIndex < allVideos.length - 1 ? allVideos[currentIndex + 1] : null;

    // Calculate overall course progress
    const allVideoIds = allVideos.map(v => v.id);
    const completedVideosCount = session?.user?.id
        ? await db.videoProgress.count({
            where: {
                studentId: session.user.id,
                videoId: { in: allVideoIds },
                completed: true
            }
        })
        : 0;

    const progressPercentage = allVideoIds.length > 0
        ? Math.round((completedVideosCount / allVideoIds.length) * 100)
        : 0;

    // Fetch Q&A for this lesson
    const forumQuestions = await getForumQuestions(video.id);

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-12">

            <LessonNavigator
                lessons={video.module.videos}
                currentLessonId={video.id}
                content={video.content || video.module.theoryContent}
            />
            {/* Progress Bar Area */}
            <div className="space-y-2">
                <div className="flex justify-between items-end text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    <span>Progression dans le cours</span>
                    <span className="text-black dark:text-white">{progressPercentage}%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-black dark:bg-white transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>

            {/* Module Overview Section */}
            <div className="space-y-6 pb-12 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-zinc-900 text-white dark:bg-white dark:text-black text-[10px] font-bold uppercase tracking-widest rounded">Module {video.module.order}</span>
                    {isDiscoveryPhase && !isEnrolled && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest rounded border border-blue-200 dark:border-blue-800">
                            Accès Libre
                        </span>
                    )}
                    {isEnrolled && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-bold uppercase tracking-widest rounded border border-green-200 dark:border-green-800">
                            Inscrit
                        </span>
                    )}
                    <h2 className="text-4xl font-black tracking-tight">{video.module.title}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {video.module.learningObjectives && (
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Objectifs d&apos;Apprentissage</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm italic border-l-2 border-zinc-200 dark:border-zinc-700 pl-4 whitespace-pre-wrap">
                                {video.module.learningObjectives}
                            </p>
                        </div>
                    )}
                    {video.module.theoryContent && (() => {
                        let parsed: TipTapNode | null = null;
                        try { parsed = JSON.parse(video.module.theoryContent); } catch { /* plain text */ }

                        if (parsed && parsed.type === "doc" && Array.isArray(parsed.content)) {
                            // Render TipTap nodes as rich HTML
                            const renderNode = (node: TipTapNode, idx: number): React.ReactNode => {
                                if (node.type === "paragraph") {
                                    const text = node.content?.map((c, i: number) => {
                                        let el: React.ReactNode = c.text || "";
                                        if (c.marks?.some((m) => m.type === "bold")) el = <strong key={i}>{el}</strong>;
                                        if (c.marks?.some((m) => m.type === "italic")) el = <em key={i}>{el}</em>;
                                        return el;
                                    });
                                    return <p key={idx} className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm mb-3">{text}</p>;
                                }
                                if (node.type === "heading") {
                                    const text = node.content?.map((c) => c.text).join("") || "";
                                    const id = `summary-${idx}-${text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")}`;
                                    const sizes: Record<number, string> = { 1: "text-xl font-black mb-4 mt-6", 2: "text-lg font-bold mb-3 mt-5", 3: "text-base font-bold mb-2 mt-4" };
                                    const Tag = (`h${node.attrs?.level || 2}`) as keyof JSX.IntrinsicElements;
                                    return <Tag key={idx} id={id} className={sizes[node.attrs?.level || 2] || sizes[2]}>{text}</Tag>;
                                }

                                if (node.type === "bulletList") {
                                    return <ul key={idx} className="list-disc pl-5 space-y-1 mb-3">{node.content?.map(renderNode)}</ul>;
                                }
                                if (node.type === "orderedList") {
                                    return <ol key={idx} className="list-decimal pl-5 space-y-1 mb-3">{node.content?.map(renderNode)}</ol>;
                                }
                                if (node.type === "listItem") {
                                    return <li key={idx} className="text-sm text-zinc-600 dark:text-zinc-400">{node.content?.map(renderNode)}</li>;
                                }
                                if (node.type === "blockquote") {
                                    return <blockquote key={idx} className="border-l-4 border-zinc-300 dark:border-zinc-700 pl-4 italic text-zinc-500 dark:text-zinc-400 my-4">{node.content?.map(renderNode)}</blockquote>;
                                }
                                if (node.type === "image" && node.attrs?.src) {
                                    return (
                                        <div key={idx} className="relative w-full aspect-video my-4">
                                            <Image
                                                src={node.attrs.src}
                                                alt={node.attrs.alt || ""}
                                                fill
                                                className="rounded-lg object-contain"
                                            />
                                        </div>
                                    );
                                }
                                const text = node.content?.map((c) => c.text).join("") || "";
                                return text ? <p key={idx} className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">{text}</p> : null;
                            };
                            return (
                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Contenu Théorique</h3>
                                    <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                                        {parsed.content.map(renderNode)}
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Contenu Théorique</h3>
                                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm whitespace-pre-wrap">
                                    {video.module.theoryContent}
                                </p>
                            </div>
                        );
                    })()}

                </div>
            </div>

            {/* Video Player Section */}
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                        <span>Cours Magistral</span>
                        {video.duration ? (
                            <>
                                <span>•</span>
                                <span>{Math.floor(video.duration / 60)} min</span>
                            </>
                        ) : null}
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">{video.title}</h1>
                    {video.description && (
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-3xl leading-relaxed">
                            {video.description}
                        </p>
                    )}
                </div>

                {/* Actions Bar: Downloads */}
                <div className="flex flex-wrap gap-4 py-6 border-y border-zinc-100 dark:border-zinc-800">
                    {video.url && !video.url.includes("youtube.com") && !video.url.includes("vimeo.com") ? (
                        <a
                            href={video.url}
                            download={`${video.title}.mp4`}
                            className="flex items-center gap-3 px-6 py-3 bg-zinc-950 text-white dark:bg-white dark:text-black rounded-2xl hover:scale-105 transition-all shadow-xl group"
                        >
                            <div className="w-8 h-8 flex items-center justify-center bg-white/10 dark:bg-black/5 rounded-xl">
                                <Download className="w-4 h-4" />
                            </div>
                            <div className="text-left">
                                <div className="text-[10px] font-black uppercase tracking-widest opacity-50">Vidéo</div>
                                <div className="text-xs font-bold">Télécharger la leçon</div>
                            </div>
                        </a>
                    ) : (
                        <div className="flex items-center gap-3 px-6 py-3 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-400 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                            <Video className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Vidéo non téléchargeable (YouTube/Vimeo)</span>
                        </div>
                    )}

                    {video.module.documents.length > 0 ? (
                        <button
                            onClick={() => {
                                const element = document.getElementById("resources-section");
                                if (element) element.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-black dark:hover:border-white transition-all shadow-sm group"
                        >
                            <div className="w-8 h-8 flex items-center justify-center bg-zinc-50 dark:bg-zinc-800 rounded-xl group-hover:bg-zinc-100 dark:group-hover:bg-zinc-700 transition-colors">
                                <FileText className="w-4 h-4" />
                            </div>
                            <div className="text-left">
                                <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Support</div>
                                <div className="text-xs font-bold">{video.module.documents.length} Document(s) disponibles</div>
                            </div>
                        </button>
                    ) : (
                        <div className="flex items-center gap-3 px-6 py-3 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-400 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                            <FileText className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Aucun support PDF</span>
                        </div>
                    )}
                </div>

                {/* Resume Banner */}
                {initialTimestamp > 30 && (
                    <div className="px-4 py-3 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-xl text-sm text-blue-700 dark:text-blue-300 font-medium">
                        &hookleftarrow; Reprise automatique &agrave; {Math.floor(initialTimestamp / 60)}:{String(Math.floor(initialTimestamp % 60)).padStart(2, "0")}
                    </div>
                )}

                <VideoPlayer
                    videoId={video.id}
                    videoUrl={video.url}
                    initialTimestamp={initialTimestamp}
                />

                {/* THEORETICAL CONTENT - INSTITUTIONAL DOCTRINE */}
                {video.content && (
                    <div className="mt-16 pt-16 border-t border-zinc-100 dark:border-zinc-800 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <div className="flex items-center gap-3 mb-12">
                            <div className="p-3 bg-black dark:bg-white text-white dark:text-black rounded-2xl shadow-xl">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-black tracking-tight uppercase">Doctrine Institutionnelle</h2>
                        </div>

                        <div className="prose prose-lg dark:prose-invert max-w-none 
                            prose-headings:font-black prose-headings:tracking-tight 
                            prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-p:leading-relaxed
                            prose-strong:text-black dark:prose-strong:text-white
                            prose-blockquote:border-l-4 prose-blockquote:border-zinc-900 dark:prose-blockquote:border-white prose-blockquote:italic
                            bg-white dark:bg-zinc-950 p-10 md:p-16 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl relative overflow-hidden">
                            {(() => {
                                let parsed: TipTapNode | null = null;
                                try { parsed = JSON.parse(video.content); } catch { /* legacy */ }

                                if (parsed && parsed.type === "doc" && Array.isArray(parsed.content)) {
                                    // Utility to render TipTap nodes
                                    const renderNode = (node: TipTapNode, idx: number): React.ReactNode => {
                                        if (node.type === "paragraph") {
                                            const text = node.content?.map((c, i: number) => {
                                                let el: React.ReactNode = c.text || "";
                                                if (c.marks?.some((m) => m.type === "bold")) el = <strong key={i}>{el}</strong>;
                                                if (c.marks?.some((m) => m.type === "italic")) el = <em key={i}>{el}</em>;
                                                if (c.marks?.some((m) => m.type === "underline")) el = <u key={i}>{el}</u>;
                                                return el;
                                            });
                                            return <p key={idx} className="mb-6">{text}</p>;
                                        }
                                        if (node.type === "heading") {
                                            const text = node.content?.map((c) => c.text).join("") || "";
                                            const id = `heading-${idx}-${text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")}`;
                                            const Tag = (`h${node.attrs?.level || 2}`) as keyof JSX.IntrinsicElements;
                                            return <Tag key={idx} id={id} className="font-black tracking-tight text-black dark:text-white mb-6 mt-10">{text}</Tag>;
                                        }

                                        if (node.type === "bulletList") {
                                            return <ul key={idx} className="list-disc pl-8 space-y-3 mb-6">{node.content?.map(renderNode)}</ul>;
                                        }
                                        if (node.type === "orderedList") {
                                            return <ol key={idx} className="list-decimal pl-8 space-y-3 mb-6">{node.content?.map(renderNode)}</ol>;
                                        }
                                        if (node.type === "listItem") {
                                            return <li key={idx}>{node.content?.map(renderNode)}</li>;
                                        }
                                        if (node.type === "blockquote") {
                                            return (
                                                <div key={idx} className="my-8 p-8 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] border-l-8 border-black dark:border-white italic shadow-inner">
                                                    {node.content?.map(renderNode)}
                                                </div>
                                            );
                                        }
                                        if (node.type === "horizontalRule") {
                                            return <hr key={idx} className="my-12 border-zinc-100 dark:border-zinc-800" />;
                                        }
                                        if (node.type === "image" && node.attrs?.src) {
                                            return (
                                                <div key={idx} className="relative w-full aspect-video my-10 group">
                                                    <Image
                                                        src={node.attrs.src}
                                                        alt={node.attrs.alt || "Doctrine Image"}
                                                        fill
                                                        className="rounded-[2.5rem] object-contain shadow-2xl border border-white/10"
                                                    />
                                                    {node.attrs.alt && <p className="mt-4 text-center text-xs font-bold text-zinc-400 uppercase tracking-widest">{node.attrs.alt}</p>}
                                                </div>
                                            );
                                        }
                                        return null;
                                    };
                                    return parsed.content.map(renderNode);
                                }

                                return (
                                    <ReactMarkdown
                                        components={{
                                            h1: ({ ...props }) => {
                                                const text = String(props.children);
                                                const id = `h1-${text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")}`;
                                                return <h1 id={id} className="text-4xl mb-8 flex items-center gap-4" {...props} />;
                                            },
                                            h2: ({ ...props }) => {
                                                const text = String(props.children);
                                                const id = `h2-${text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")}`;
                                                return <h2 id={id} className="text-2xl mt-12 mb-6 font-black border-b border-zinc-100 dark:border-zinc-800 pb-2" {...props} />;
                                            },
                                            h3: ({ ...props }) => {
                                                const text = String(props.children);
                                                const id = `h3-${text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")}`;
                                                return <h3 id={id} className="text-xl mt-8 mb-4 font-bold" {...props} />;
                                            },
                                            strong: ({ ...props }) => <strong className="text-black dark:text-white font-black" {...props} />,
                                            blockquote: ({ ...props }) => (
                                                <div className="my-8 p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border-l-8 border-black dark:border-white italic">
                                                    {props.children}
                                                </div>
                                            ),
                                        }}
                                    >
                                        {video.content}
                                    </ReactMarkdown>
                                );
                            })()}
                        </div>
                    </div>
                )}
            </div>

            {/* Documents section */}
            {video.module.documents.length > 0 && (
                <div id="resources-section" className="space-y-4 pt-8 border-t border-zinc-100 dark:border-zinc-800">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Ressources Pédagogiques (PDF/Slides)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {video.module.documents.map((doc: { id: string; url: string; title: string }) => (
                            <a
                                key={doc.id}
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-black dark:hover:border-white hover:shadow-md transition group"
                            >
                                <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <span className="font-bold text-sm block truncate">{doc.title}</span>
                                    <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Télécharger</span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Q&A Forum Section */}
            <ForumSection videoId={video.id} initialQuestions={forumQuestions} />

            {/* Navigation prev/next */}
            <div className="flex items-center justify-between pt-6 border-t border-zinc-200 dark:border-zinc-800">
                {prevVideo ? (
                    <Link
                        href={`/courses/${params.id}/learn/${prevVideo.id}`}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition text-sm font-bold"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="max-w-[200px] truncate">{prevVideo.title}</span>
                    </Link>
                ) : <div />}

                {nextVideo ? (
                    <Link
                        href={`/courses/${params.id}/learn/${nextVideo.id}`}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition text-sm font-bold"
                    >
                        <span className="max-w-[200px] truncate">{nextVideo.title}</span>
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                ) : (
                    <Link
                        href={`/courses/${params.id}`}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition text-sm font-bold"
                    >
                        Cours terminé ✓
                    </Link>
                )}
            </div>
        </div>
    );
}
