import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import ApplyForm from "./apply-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function ApplyPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        redirect("/auth/signin?callbackUrl=/admissions/apply");
    }

    const existingApp = await db.application.findFirst({
        where: {
            userId: session.user.id,
            status: {
                not: "REJECTED"
            }
        }
    });

    if (existingApp) {
        redirect("/dashboard?applicationExists=true");
    }

    const disciplines = await db.discipline.findMany({
        orderBy: { name: "asc" }
    });

    return (
        <main className="min-h-screen bg-zinc-50 py-32 px-6">
            <div className="max-w-3xl mx-auto space-y-12">
                <div className="space-y-6">
                    <Link
                        href="/admissions"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-indigo-600 transition-colors group"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Retour aux Admissions
                    </Link>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-900">
                            Candidature <span className="text-indigo-600">Officielle</span>
                        </h1>
                        <p className="text-slate-500 font-medium mt-4 leading-relaxed">
                            Soumettez votre dossier pour postuler à un cursus de la plateforme. Décrivez votre parcours et vos motivations avec authenticité.
                        </p>
                    </div>
                </div>

                <div className="p-8 md:p-12 bg-white rounded-[3rem] border border-slate-200 shadow-2xl shadow-indigo-100/20">
                    <ApplyForm disciplines={disciplines} />
                </div>
            </div>
        </main>
    );
}

