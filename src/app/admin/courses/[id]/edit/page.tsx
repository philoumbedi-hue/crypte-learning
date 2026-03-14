"use client";

import { useEffect, useState } from "react";
import AntigravityEditor from "@/components/admin/editor/AntigravityEditor";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

export default function CourseEditPage({ params }: { params: { id: string } }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchCourse() {
            try {
                console.log("Client-side fetching course with ID:", params.id);
                const res = await fetch(`/api/admin/courses/${params.id}/edit`);
                if (res.status === 401) {
                    toast.error("Non autorisé. Veuillez vous reconnecter.");
                    return;
                }
                if (res.status === 403) {
                    setCourse("FORBIDDEN");
                    return;
                }
                if (res.status === 404) {
                    setCourse("NOT_FOUND");
                    return;
                }
                if (!res.ok) {
                    toast.error(`Erreur serveur (${res.status})`);
                    return;
                }
                const data = await res.json();
                setCourse(data);
            } catch (error) {
                toast.error("Erreur de connexion au serveur");
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchCourse();
    }, [params.id]);

    const handleSave = async (content: unknown) => {
        try {
            const res = await fetch(`/api/admin/courses/${params.id}/edit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error("Save failed:", res.status, errorText);
                toast.error(`Erreur (${res.status}): ${errorText}`);
                return;
            }

            toast.success("Doctrine sauvegardée avec succès", {
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
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    if (course === "NOT_FOUND" || course === "FORBIDDEN" || !course && !loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white font-black uppercase tracking-widest text-xl flex-col gap-4">
                <span>{course === "FORBIDDEN" ? "Accès Refusé" : "Cours non trouvé"}</span>
                <p className="text-xs text-zinc-500 max-w-xs text-center normal-case tracking-normal font-normal">
                    {course === "FORBIDDEN"
                        ? "Vous n'avez pas les permissions pour modifier ce contenu (réservé à l'auteur ou l'administration)."
                        : "Le cours demandé n'existe pas ou a été supprimé."}
                </p>
                <button
                    onClick={() => router.push('/admin/courses')}
                    className="text-xs text-indigo-400 hover:text-white underline mt-4"
                >
                    Retour à la liste
                </button>
            </div>
        );
    }


    return (
        <div className="h-screen flex flex-col pt-0">
            <Toaster position="bottom-right" />
            <div className="flex-1 overflow-hidden">
                <AntigravityEditor
                    initialContent={course.content}
                    onSave={handleSave}
                    title={course.title}
                    backUrl={`/admin/courses/${params.id}`}
                />
            </div>
        </div>
    );
}
