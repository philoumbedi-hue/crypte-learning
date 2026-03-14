"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Info, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function ImportForm() {
    const router = useRouter();
    const [json, setJson] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const parsed = JSON.parse(json);
            if (!parsed.discipline || !parsed.course) {
                throw new Error("Structure JSON invalide : 'discipline' ou 'course' manquant.");
            }

            const response = await fetch("/api/admin/import-curriculum", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: json,
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || "Erreur lors de l'importation");
            }

            setSuccess(true);
            setJson("");
            router.refresh();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Une erreur inattendue est survenue.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl space-y-6">
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl flex gap-3">
                <Info className="h-5 w-5 text-zinc-400 shrink-0" />
                <div className="space-y-1">
                    <h3 className="text-sm font-bold uppercase tracking-widest">Guide d&apos;importation</h3>
                    <p className="text-xs text-zinc-500">
                        Collez le JSON structuré contenant la discipline, le cours et les modules pédagogiques.
                        Le système créera automatiquement tous les éléments et leurs relations.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    placeholder='{ "discipline": "...", "course": { ... } }'
                    className="w-full min-h-[400px] p-4 rounded-xl font-mono text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
                    value={json}
                    onChange={(e) => setJson(e.target.value)}
                    disabled={isLoading}
                />

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={isLoading || !json.trim()}
                        className="bg-black dark:bg-white text-white dark:text-black hover:opacity-90 disabled:opacity-50 font-bold px-8 py-3 rounded-xl transition flex items-center justify-center min-w-[200px]"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Importation...
                            </>
                        ) : (
                            "Importer le Curriculum"
                        )}
                    </button>
                </div>
            </form>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 p-4 rounded-xl text-red-600 dark:text-red-400 flex gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <div className="space-y-1">
                        <h3 className="font-bold text-sm">Erreur d&apos;importation</h3>
                        <p className="text-xs">{error}</p>
                    </div>
                </div>
            )}

            {success && (
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-4 rounded-xl text-green-700 dark:text-green-400 flex gap-3 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <div className="space-y-1">
                        <h3 className="font-bold text-sm">Importation Réussie</h3>
                        <p className="text-xs">
                            Le curriculum a été importé avec succès dans CRYPTE - E-learning CRYPTE.
                            Vous pouvez maintenant le consulter dans la liste des cours.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
