"use client";

import { useState } from "react";
import { updateApplicationStatus } from "@/actions/application";
import { useRouter } from "next/navigation";
import { Loader2, Check, X, Calendar, Eye, ShieldCheck, Mail } from "lucide-react";

export default function ApplicationAdminClient({ initialApplications }: { initialApplications: unknown[] }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [applications, setApplications] = useState(initialApplications as any[]);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [interviewDate, setInterviewDate] = useState<{ [key: string]: string }>({});
    const router = useRouter();

    async function handleStatusUpdate(id: string, status: "PENDING" | "REVIEWING" | "INTERVIEW" | "ACCEPTED" | "REJECTED") {
        setLoadingId(id);
        const dateObj = interviewDate[id] ? new Date(interviewDate[id]) : undefined;

        const res = await updateApplicationStatus(id, status, dateObj);

        if (res.success && res.application) {
            setApplications(apps => apps.map(app => app.id === id ? res.application : app));
            router.refresh();
        } else {
            alert(res.error || "Une erreur est survenue.");
        }
        setLoadingId(null);
    }

    if (applications.length === 0) {
        return (
            <div className="p-16 text-center bg-slate-50 border border-dashed border-slate-200 rounded-[3rem]">
                <p className="text-slate-500 font-medium">Aucune candidature n&apos;a été soumise pour le moment.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {applications.map((app) => (
                <div key={app.id} className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 space-y-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">{app.user.name || "Candidat"}</h3>
                                <p className="text-sm font-medium text-slate-500 flex items-center gap-2 mt-1">
                                    <Mail className="w-4 h-4" /> {app.user.email}
                                </p>
                            </div>
                            <span className="px-4 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl">
                                {app.status}
                            </span>
                        </div>

                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2">Faculté demandée</p>
                            <p className="font-bold text-slate-800 bg-indigo-50/50 inline-block px-4 py-2 rounded-xl border border-indigo-100/50">{app.discipline.name}</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                            <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Parcours Académique</p>
                                <div className="p-4 bg-slate-50 rounded-2xl text-sm font-medium text-slate-600 leading-relaxed max-h-48 overflow-y-auto">
                                    {app.academicBackground}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Lettre de Motivation</p>
                                <div className="p-4 bg-slate-50 rounded-2xl text-sm font-medium text-slate-600 leading-relaxed max-h-48 overflow-y-auto">
                                    {app.motivationLetter}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-72 flex flex-col gap-3 bg-slate-50 p-6 rounded-3xl border border-slate-100 shrink-0">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center mb-2">Actions Décisionnelles</p>

                        {app.status === "PENDING" && (
                            <button
                                onClick={() => handleStatusUpdate(app.id, "REVIEWING")}
                                disabled={loadingId === app.id}
                                className="w-full py-4 bg-blue-600 text-white hover:bg-blue-700 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-lg shadow-blue-200 flex justify-center items-center gap-3 disabled:opacity-50"
                            >
                                {loadingId === app.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                                Évaluer le Dossier
                            </button>
                        )}

                        {app.status === "REVIEWING" && (
                            <div className="space-y-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Programmer l&apos;Entretien</label>
                                <input
                                    type="datetime-local"
                                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium text-slate-700"
                                    onChange={(e) => setInterviewDate({ ...interviewDate, [app.id]: e.target.value })}
                                />
                                <button
                                    onClick={() => handleStatusUpdate(app.id, "INTERVIEW")}
                                    disabled={loadingId === app.id || !interviewDate[app.id]}
                                    className="w-full py-3 bg-purple-600 text-white hover:bg-purple-700 font-black uppercase tracking-widest text-[10px] rounded-xl transition-all shadow-lg shadow-purple-200 flex justify-center items-center gap-2 disabled:opacity-50"
                                >
                                    {loadingId === app.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
                                    Fixer Entretien
                                </button>
                            </div>
                        )}

                        {app.status === "INTERVIEW" && (
                            <div className="flex flex-col gap-3 mt-auto">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center mb-1">Décision Finale</p>
                                <button
                                    onClick={() => handleStatusUpdate(app.id, "ACCEPTED")}
                                    disabled={loadingId === app.id}
                                    className="w-full py-3 bg-green-500 text-white hover:bg-green-600 font-black uppercase tracking-widest text-[10px] rounded-xl transition-all shadow-lg shadow-green-200 flex justify-center items-center gap-2"
                                >
                                    {loadingId === app.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                    Admettre
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate(app.id, "REJECTED")}
                                    disabled={loadingId === app.id}
                                    className="w-full py-3 bg-white border-2 border-red-100 text-red-500 hover:bg-red-50 font-black uppercase tracking-widest text-[10px] rounded-xl transition-all flex justify-center items-center gap-2"
                                >
                                    {loadingId === app.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                                    Recaler
                                </button>
                            </div>
                        )}

                        {(app.status === "ACCEPTED" || app.status === "REJECTED") && (
                            <div className="flex flex-col items-center justify-center gap-2 text-slate-400 text-xs font-bold py-8 mt-auto">
                                <ShieldCheck className="w-8 h-8 mb-2 opacity-50" />
                                <span className="tracking-widest uppercase">Dossier Clôturé</span>
                            </div>
                        )}

                        {app.status !== "REJECTED" && app.status !== "INTERVIEW" && app.status !== "ACCEPTED" && (
                            <button
                                onClick={() => handleStatusUpdate(app.id, "REJECTED")}
                                disabled={loadingId === app.id}
                                className="w-full mt-auto py-3 text-slate-400 hover:text-red-500 hover:bg-red-50 text-[10px] font-black uppercase tracking-widest rounded-xl transition-colors border border-transparent hover:border-red-100"
                            >
                                Rejeter sans suite
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
