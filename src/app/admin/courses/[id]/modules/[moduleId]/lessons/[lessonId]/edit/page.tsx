"use client";

import { useEffect, useState } from "react";
import AntigravityEditor from "@/components/admin/editor/AntigravityEditor";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

export default function LessonEditPage({ params }: { params: { id: string, moduleId: string, lessonId: string } }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [lesson, setLesson] = useState<{ id: string, title: string, content: any } | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchLesson() {
            try {
                const res = await fetch(`/api/admin/courses/${params.id}/modules/${params.moduleId}/lessons/${params.lessonId}/edit`);
                if (!res.ok) throw new Error("Failed to fetch lesson");
                const data = await res.json();
                setLesson(data);
            } catch (error) {
                console.error(error);
                toast.error("Erreur lors du chargement de la leçon");
            } finally {
                setLoading(false);
            }
        }
        fetchLesson();
    }, [params.id, params.moduleId, params.lessonId]);

    const handleSave = async (content: unknown) => {
        try {
            const res = await fetch(`/api/admin/courses/${params.id}/modules/${params.moduleId}/lessons/${params.lessonId}/edit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                toast.error(`Erreur (${res.status}): ${errorText}`);
                return;
            }

            toast.success("Contenu de la leçon sauvegardé", {
                style: {
                    background: "#000",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontSize: "12px",
                    fontWeight: "bold",
                    textTransform: "uppercase"
                }
            });
        } catch (error) {
            toast.error("Erreur réseau ou connexion");
            console.error(error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Chargement du Système d&apos;Édition...</p>
                </div>
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-white">
                <h1 className="text-2xl font-black uppercase tracking-tighter mb-4">Leçon non trouvée</h1>
                <button
                    onClick={() => router.back()}
                    className="px-6 py-2 bg-white text-black font-bold rounded-xl hover:scale-105 transition"
                >
                    Retour
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-[#0a0a0a]">
            <Toaster position="bottom-right" />
            <div className="flex-1 overflow-hidden relative">
                <AntigravityEditor
                    initialContent={lesson.content}
                    onSave={handleSave}
                    title={`Leçon: ${lesson.title}`}
                    backUrl={`/admin/courses/${params.id}`}
                />
            </div>
        </div>
    );
}
