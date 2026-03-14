"use client";

import { UserPlus, CheckCircle2, Award, ClipboardCheck, ChevronLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdmissionsPage() {
    const steps = [
        {
            number: "01",
            title: "Candidature en Ligne",
            desc: "Soumission de votre dossier académique via notre portail sécurisé.",
            icon: UserPlus
        },
        {
            number: "02",
            title: "Évaluation Préliminaire",
            desc: "Analyse de votre profil et de votre motivation par le comité pédagogique.",
            icon: ClipboardCheck
        },
        {
            number: "03",
            title: "Entretien d&apos;Excellence",
            desc: "Échange direct pour évaluer votre potentiel et votre alignement stratégique.",
            icon: Award
        },
        {
            number: "04",
            title: "Intégration",
            desc: "Validation finale et accès à votre espace académique CRYPTE.",
            icon: CheckCircle2
        }
    ];

    return (
        <main className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 py-32 px-6 overflow-hidden">
            <div className="max-w-6xl mx-auto space-y-24">
                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-10">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-indigo-600 transition-colors group"
                        >
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Retour au Portail
                        </Link>

                        <div className="space-y-6">
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9]"
                            >
                                Admissions <br />
                                <span className="text-indigo-600">D&apos;EXCELLENCE</span>
                            </motion.h1>
                            <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-xl">
                                Rejoignez une élite académique dédiée à la maîtrise des technologies souveraines.
                                Un processus de sélection rigoureux pour des futurs leaders d&apos;exception.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link href="/admissions/apply" className="px-10 py-5 bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 flex items-center gap-3">
                                Postuler Maintenant <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-square bg-slate-50 rounded-[4rem] flex items-center justify-center p-12 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-50" />
                            <div className="relative text-center space-y-4">
                                <div className="text-8xl font-black text-indigo-600 opacity-20">ENSN</div>
                                <div className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Standard Alpha Premium</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Requirements / Process Grid */}
                <div className="space-y-16">
                    <div className="text-center space-y-4">
                        <h2 className="text-xs font-black uppercase tracking-[0.5em] text-indigo-500">Parcours d&apos;Admission</h2>
                        <h3 className="text-4xl font-black uppercase tracking-tight">Le Chemin vers la Maîtrise</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative p-10 bg-slate-50 rounded-[3rem] border border-slate-100 hover:border-indigo-200 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100 transition-all group"
                            >
                                <div className="text-5xl font-black text-slate-100 group-hover:text-indigo-50/50 absolute top-8 right-8 transition-colors">
                                    {step.number}
                                </div>
                                <div className="space-y-6 relative z-10 pt-8">
                                    <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                        <step.icon className="w-7 h-7" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-xl font-black uppercase tracking-tight leading-tight">{step.title}</h4>
                                        <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Criteria Block */}
                <div className="bg-slate-900 rounded-[4rem] p-12 md:p-20 text-white flex flex-col md:flex-row gap-16 items-center">
                    <div className="flex-1 space-y-6">
                        <h2 className="text-3xl font-black uppercase tracking-tight">Critères de Sélection</h2>
                        <p className="text-slate-400 font-medium leading-relaxed">
                            Nous recherchons des profils passionnés, dotés d&apos;une forte curiosité intellectuelle et d&apos;une volonté
                            de contribuer à l&apos;autonomie technologique de leur nation. Une base académique solide est requise.
                        </p>
                    </div>
                    <div className="w-full md:w-auto flex flex-col gap-4">
                        {[
                            "Passion Technologique",
                            "Excellence Académique",
                            "Vision Stratégique",
                            "Éthique Institutionnelle"
                        ].map((c, i) => (
                            <div key={i} className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black uppercase tracking-widest text-[10px]">
                                {c}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
