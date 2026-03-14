"use client";

import { useState } from "react";
import { submitApplication } from "@/actions/application";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";

export default function ApplyForm({ disciplines }: { disciplines: { id: string; name: string }[] }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const motivationLetter = formData.get("motivationLetter") as string;
        const academicBackground = formData.get("academicBackground") as string;
        const selectedDisciplineId = formData.get("selectedDisciplineId") as string;

        const res = await submitApplication({ motivationLetter, academicBackground, selectedDisciplineId });

        if (res.error) {
            setError(res.error);
            setIsLoading(false);
        } else {
            router.push("/dashboard?applicationSuccess=true");
            router.refresh();
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
                <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">
                    Faculté Choisie
                </label>
                <select
                    name="selectedDisciplineId"
                    required
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium appearance-none"
                    defaultValue=""
                >
                    <option value="" disabled>Sélectionnez une faculté...</option>
                    {disciplines.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">
                    Parcours Académique & Expérience
                </label>
                <textarea
                    name="academicBackground"
                    required
                    rows={5}
                    placeholder="Décrivez vos études antérieures, vos diplômes..."
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium resize-none"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">
                    Lettre de Motivation
                </label>
                <textarea
                    name="motivationLetter"
                    required
                    rows={8}
                    placeholder="Pourquoi souhaitez-vous rejoindre l&apos;ENSN et cette faculté en particulier ? Quelle est votre vision locale et internationale ?"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium resize-none"
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full px-8 py-5 bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 disabled:opacity-50"
            >
                {isLoading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Soumission en cours...</>
                ) : (
                    <><Send className="w-5 h-5" /> Soumettre le Dossier</>
                )}
            </button>
        </form>
    );
}

