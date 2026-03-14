import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { completeOnboarding } from "@/actions/onboarding";
import { User, Phone, Globe2, GraduationCap, ArrowRight } from "lucide-react";

export default async function OnboardingPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/signin");
    }

    // If onboarding already done, redirect to dashboard
    // If onboarding already done, redirect to dashboard
    const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { onboardingCompleted: true, name: true, email: true }
    });

    if (user?.onboardingCompleted) {
        redirect("/dashboard");
    }

    async function action(formData: FormData) {
        "use server";
        const name = formData.get("name") as string;
        const phone = formData.get("phone") as string;
        const nationality = formData.get("nationality") as string;

        await completeOnboarding({ name, phone: phone || undefined, nationality: nationality || undefined });
    }

    return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-60" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-60" />
            </div>

            <div className="w-full max-w-lg relative z-10">
                {/* Card Header */}
                <div className="text-center mb-10 space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-[2rem] shadow-2xl shadow-indigo-200 mx-auto">
                        <GraduationCap className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
                            Bienvenue !
                        </h1>
                        <p className="text-slate-500 font-medium mt-2">
                            Complétez votre profil pour accéder à la plateforme <span className="text-indigo-600 font-black">CRYPTE</span>.
                        </p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-500 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Première connexion détectée
                    </div>
                </div>

                {/* Form Card */}
                <form
                    action={action}
                    className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/80 border border-slate-100 p-10 space-y-8"
                >
                    {/* Full Name */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <User className="w-3.5 h-3.5" /> Nom Complet *
                        </label>
                        <input
                            name="name"
                            required
                            defaultValue={user?.name || ""}
                            placeholder="Ex: Jean-Paul Kabila"
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    {/* Email (read-only pre-filled) */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <Globe2 className="w-3.5 h-3.5" /> Adresse Email
                        </label>
                        <input
                            value={user?.email || ""}
                            readOnly
                            className="w-full p-4 bg-slate-100 border border-slate-200 rounded-2xl font-bold text-sm text-slate-400 cursor-not-allowed"
                        />
                    </div>

                    {/* Phone */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5" /> Numéro de Téléphone (Optionnel)
                        </label>
                        <input
                            name="phone"
                            type="tel"
                            placeholder="Ex: +243 81 XXX XXXX"
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    {/* Nationality */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <Globe2 className="w-3.5 h-3.5" /> Nationalité (Optionnel)
                        </label>
                        <input
                            name="nationality"
                            placeholder="Ex: Congolaise"
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 text-sm"
                    >
                        Accéder à la Plateforme
                        <ArrowRight className="w-5 h-5" />
                    </button>

                    <p className="text-center text-[11px] text-slate-400 font-medium">
                        Ces informations sont confidentielles et protégées selon notre{" "}
                        <a href="/privacy" className="text-indigo-600 hover:underline">
                            politique de confidentialité
                        </a>.
                    </p>
                </form>
            </div>
        </main>
    );
}
