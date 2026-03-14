"use client";

import { useEffect, useState } from "react";
import AntigravityEditor from "@/components/admin/editor/AntigravityEditor";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

export default function ModuleEditPage({ params }: { params: { id: string, moduleId: string } }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [module, setModule] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchModule() {
            try {
                const res = await fetch(`/api/admin/courses/${params.id}/modules/${params.moduleId}/edit`);
                if (res.status === 401) {
                    toast.error("Non autorisé.");
                    return;
                }
                if (res.status === 404) {
                    setModule("NOT_FOUND");
                    return;
                }
                const data = await res.json();
                setModule(data);
            } catch {
                toast.error("Erreur de connexion");
            } finally {
                setLoading(false);
            }
        }
        fetchModule();
    }, [params.id, params.moduleId]);

    const handleSave = async (content: unknown) => {
        try {
            const res = await fetch(`/api/admin/courses/${params.id}/modules/${params.moduleId}/edit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
            });

            if (!res.ok) throw new Error("Erreur de sauvegarde");

            toast.success("Contenu Théorique sauvegardé", {
                style: {
                    background: "#000",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: "bold",
                    textTransform: "uppercase"
                }
            });
        } catch {
            toast.error("Erreur de sauvegarde");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    if (module === "NOT_FOUND" || !module && !loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white font-black uppercase tracking-widest text-xl flex-col gap-4">
                <span>Module non trouvé</span>
                <button onClick={() => router.push(`/admin/courses/${params.id}`)} className="text-xs text-zinc-500 underline">Retour au Cours</button>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col pt-0">
            <Toaster position="bottom-right" />
            <div className="flex-1 overflow-hidden">
                <AntigravityEditor
                    initialContent={module.theoryContent}
                    onSave={handleSave}
                    title={`Module: ${module.title}`}
                    backUrl={`/admin/courses/${params.id}`}
                />
            </div>
        </div>
    );
}
