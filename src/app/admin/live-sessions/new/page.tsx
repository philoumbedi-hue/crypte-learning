import db from "@/lib/db";
import { createLiveSession } from "@/actions/live-session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Video, Calendar, Link as LinkIcon, AlignLeft, Clock, Zap, RefreshCw } from "lucide-react";
import crypto from "crypto";

export default async function NewLiveSessionPage() {
    const courses = await db.course.findMany({
        select: { id: true, title: true },
        orderBy: { title: "asc" }
    });

    async function action(formData: FormData) {
        "use server";
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;

        // Generate automatic Jitsi Meet URL
        const randomString = crypto.randomBytes(4).toString("hex");
        const safeTitle = title.replace(/[^a-zA-Z0-9]/g, "");
        const meetUrl = `https://meet.jit.si/Crypte-${safeTitle}-${randomString}`;

        const courseId = formData.get("courseId") as string;

        const isInstant = formData.get("isInstant") === "true";

        let startTime: Date;
        let endTime: Date | undefined;
        let status: string;

        if (isInstant) {
            startTime = new Date();
            status = "LIVE";
        } else {
            startTime = new Date(formData.get("startTime") as string);
            const endTimeStr = formData.get("endTime") as string;
            endTime = endTimeStr ? new Date(endTimeStr) : undefined;
            status = "SCHEDULED";
        }

        await createLiveSession({
            title,
            description,
            meetUrl,
            startTime,
            endTime,
            courseId,
            status
        });

        redirect("/admin/live-sessions");
    }

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-12">
            <Link
                href="/admin/live-sessions"
                className="inline-flex items-center gap-2 text-zinc-500 hover:text-black transition font-bold text-sm"
            >
                <ArrowLeft className="w-4 h-4" />
                Retour à la liste
            </Link>

            <div className="space-y-4">
                <h1 className="text-4xl font-black tracking-tight uppercase">Programmer un Live</h1>
                <p className="text-zinc-500 font-medium">Créez une nouvelle session de visioconférence Google Meet pour vos étudiants.</p>
            </div>

            <form action={action} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[3rem] p-12 space-y-10 shadow-xl shadow-indigo-100/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                            <Video className="w-3.5 h-3.5" /> Titre de la Session
                        </label>
                        <input
                            name="title"
                            required
                            placeholder="ex: Introduction à la Cryptographie"
                            className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                            <ArrowLeft className="w-3.5 h-3.5 rotate-90" /> Faculté / Cours Associé
                        </label>
                        <select
                            name="courseId"
                            required
                            className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 transition-all font-bold appearance-none"
                        >
                            <option value="">Sélectionner un cours...</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>{course.title}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                        <LinkIcon className="w-3.5 h-3.5" /> Lien de Visioconférence
                    </label>
                    <div className="flex items-center gap-4 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-800 rounded-xl">
                            <RefreshCw className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <div className="font-bold text-sm text-indigo-900 dark:text-indigo-100">Génération Automatique</div>
                            <div className="text-xs text-indigo-600/70 dark:text-indigo-400/70 font-medium">
                                Un lien unique et sécurisé (Jitsi Meet) sera créé automatiquement lors de la validation.
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-yellow-500" /> Type de Lancement
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="relative flex items-start gap-4 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 cursor-pointer hover:border-indigo-500 transition-colors group">
                            <input type="radio" name="isInstant" value="false" defaultChecked className="mt-1 w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                            <div>
                                <h4 className="font-bold text-sm">Programmer pour plus tard</h4>
                                <p className="text-xs text-zinc-500 mt-1">Définissez une date et une heure précises. Les étudiants seront notifiés.</p>
                            </div>
                        </label>
                        <label className="relative flex items-start gap-4 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 cursor-pointer hover:border-indigo-500 transition-colors group">
                            <input type="radio" name="isInstant" value="true" className="mt-1 w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                            <div>
                                <h4 className="font-bold text-sm text-indigo-600">Lancer Immédiatement</h4>
                                <p className="text-xs text-zinc-500 mt-1">La session passe directement en statut &quot;LIVE&quot;.</p>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Note: In a fully interactive client component, we would hide these date fields if isInstant is true.
                    Since this is a Server Component, they remain visible but are ignored by the server action if isInstant=true.
                    We make them conditionally required visually via CSS if possible, but for simplicity here we just make them optional in HTML. */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" /> Date & Heure de Début (Si programmé)
                        </label>
                        <input
                            name="startTime"
                            type="datetime-local"
                            className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" /> Heure de Fin (Optionnelle)
                        </label>
                        <input
                            name="endTime"
                            type="datetime-local"
                            className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                        <AlignLeft className="w-3.5 h-3.5" /> Description / Objectifs
                    </label>
                    <textarea
                        name="description"
                        rows={4}
                        placeholder="Qu'allez-vous aborder dans cette session ?"
                        className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    />
                </div>

                <div className="pt-8">
                    <button
                        type="submit"
                        className="w-full py-6 bg-black dark:bg-white text-white dark:text-black rounded-[2rem] font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-indigo-200/50"
                    >
                        Créer la Session Live
                    </button>
                </div>
            </form>
        </div>
    );
}
