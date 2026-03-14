"use client";

import { useState } from "react";
import Image from "next/image";
import { MessageSquare, Send, Reply, CheckCircle2, User } from "lucide-react";
import { postQuestion, postAnswer } from "@/actions/forum";
import { useSession } from "next-auth/react";

interface ForumUser {
    name: string | null;
    role: string;
    image: string | null;
}

interface ForumAnswer {
    id: string;
    content: string;
    createdAt: Date;
    user: ForumUser;
    isAccepted: boolean;
}

interface ForumQuestion {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    isResolved: boolean;
    user: ForumUser;
    answers: ForumAnswer[];
}

export default function ForumSection({ videoId, initialQuestions }: { videoId: string, initialQuestions: ForumQuestion[] }) {
    const { data: session } = useSession();
    const [questions, setQuestions] = useState<ForumQuestion[]>(initialQuestions);
    const [newQuestionStr, setNewQuestionStr] = useState("");
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyStr, setReplyStr] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePostQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newQuestionStr.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const result = await postQuestion(videoId, newQuestionStr);
            // Optimistic update
            const newQ: ForumQuestion = {
                id: result.id,
                title: result.title,
                content: result.content,
                createdAt: result.createdAt,
                isResolved: result.isResolved,
                user: {
                    name: session?.user?.name || "Vous",
                    role: session?.user?.role || "STUDENT",
                    image: session?.user?.image || null
                },
                answers: []
            };
            setQuestions([newQ, ...questions]);
            setNewQuestionStr("");
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la publication de la question");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePostReply = async (questionId: string, e: React.FormEvent) => {
        e.preventDefault();
        if (!replyStr.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const result = await postAnswer(questionId, replyStr);
            // Optimistic update
            setQuestions(questions.map(q => {
                if (q.id === questionId) {
                    return {
                        ...q,
                        answers: [...q.answers, {
                            id: result.id,
                            content: result.content,
                            createdAt: result.createdAt,
                            isAccepted: result.isAccepted,
                            user: {
                                name: session?.user?.name || "Vous",
                                role: session?.user?.role || "STUDENT",
                                image: session?.user?.image || null
                            }
                        }]
                    };
                }
                return q;
            }));
            setReplyStr("");
            setReplyingTo(null);
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la publication de la réponse");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isPrivileged = (role: string) => ["SUPER_ADMIN", "ADMIN", "TEACHER", "MODERATOR"].includes(role);

    return (
        <div className="mt-16 pt-16 border-t border-zinc-200 dark:border-zinc-800 animate-in fade-in duration-1000">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-2xl">
                    <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-black tracking-tight">Forum d&apos;Entraide</h2>
                    <p className="text-sm text-zinc-500">Posez vos questions ou aidez vos camarades sur cette leçon.</p>
                </div>
            </div>

            {/* Post Question Form */}
            <form onSubmit={handlePostQuestion} className="mb-10 relative">
                <textarea
                    placeholder="Une zone d'ombre dans cette leçon ? Posez votre question ici..."
                    className="w-full min-h-[120px] p-5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] focus:ring-2 focus:ring-indigo-500 outline-none resize-y text-sm shadow-sm"
                    value={newQuestionStr}
                    onChange={(e) => setNewQuestionStr(e.target.value)}
                />
                <div className="absolute bottom-4 right-4 flex items-center justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting || !newQuestionStr.trim()}
                        className="flex items-center gap-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-bold hover:opacity-90 transition disabled:opacity-50 shadow-md"
                    >
                        <Send className="w-4 h-4" /> Publier
                    </button>
                </div>
            </form>

            <div className="space-y-6">
                {questions.length === 0 ? (
                    <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/50 rounded-[2rem] border border-dashed border-zinc-200 dark:border-zinc-800">
                        <p className="text-zinc-500 font-medium">Soyez le premier à poser une question sur cette leçon !</p>
                    </div>
                ) : (
                    questions.map((q) => (
                        <div key={q.id} className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-6 shadow-sm relative overflow-hidden">
                            {q.isResolved && (
                                <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 flex items-start justify-end p-3 rounded-bl-full">
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                </div>
                            )}

                            {/* Question Header */}
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-800 shrink-0">
                                    {q.user.image ? (
                                        <Image src={q.user.image} alt={q.user.name || "User"} width={40} height={40} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <User className="w-5 h-5 text-zinc-400" />
                                    )}
                                </div>
                                <div className="pt-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm tracking-tight">{q.user.name || "Étudiant Anonyme"}</span>
                                        {isPrivileged(q.user.role) && (
                                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400 text-[9px] font-black uppercase tracking-widest rounded">Équipe Pédagogique</span>
                                        )}
                                        <span className="text-[10px] text-zinc-400">• {new Date(q.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">{q.content}</p>
                                </div>
                            </div>

                            {/* Options */}
                            <div className="flex items-center gap-4 ml-14 mb-6">
                                <button
                                    onClick={() => setReplyingTo(replyingTo === q.id ? null : q.id)}
                                    className="text-xs font-bold text-zinc-500 hover:text-black dark:hover:text-white flex items-center gap-1.5 transition"
                                >
                                    <Reply className="w-3.5 h-3.5" /> Répondre
                                </button>
                                <span className="text-xs font-medium text-zinc-400">{q.answers.length} réponses</span>
                            </div>

                            {/* Answers Array */}
                            {q.answers.length > 0 && (
                                <div className="ml-8 pl-6 border-l-2 border-zinc-100 dark:border-zinc-800 space-y-5">
                                    {q.answers.map(ans => (
                                        <div key={ans.id} className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-800">
                                                {ans.user.image ? (
                                                    <Image src={ans.user.image} alt="User" width={32} height={32} className="w-full h-full rounded-full object-cover" />
                                                ) : (
                                                    <User className="w-4 h-4 text-zinc-400" />
                                                )}
                                            </div>
                                            <div className="flex-1 bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl rounded-tl-sm border border-zinc-100 dark:border-zinc-800">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-xs">{ans.user.name}</span>
                                                    {isPrivileged(ans.user.role) && (
                                                        <span className="px-1.5 py-0.5 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-widest rounded flex items-center gap-1">
                                                            <CheckCircle2 className="w-2.5 h-2.5" /> Officiel
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{ans.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Reply Input */}
                            {replyingTo === q.id && (
                                <form onSubmit={(e) => handlePostReply(q.id, e)} className="mt-4 ml-14 flex items-center gap-3">
                                    <input
                                        type="text"
                                        placeholder="Écrivez votre réponse..."
                                        className="flex-1 px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={replyStr}
                                        onChange={(e) => setReplyStr(e.target.value)}
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !replyStr.trim()}
                                        className="p-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full hover:opacity-90 disabled:opacity-50"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </form>
                            )}

                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
