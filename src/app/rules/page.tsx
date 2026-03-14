"use client";

import { Scale, Heart, ShieldAlert, BookOpen, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RulesPage() {
    const rules = [
        {
            icon: BookOpen,
            title: "Rigueur Académique",
            desc: "L'assiduité et l'engagement personnel sont les piliers de la réussite. Chaque étudiant s'engage à suivre l'intégralité du cursus avec discipline."
        },
        {
            icon: ShieldAlert,
            title: "Intégrité & Honnêteté",
            desc: "Le plagiat et la triche sont strictement interdits. L'excellence ne se construit que sur le travail authentique et l'effort personnel."
        },
        {
            icon: Heart,
            title: "Respect & Éthique",
            desc: "Un comportement respectueux envers le corps professoral et les autres étudiants est exigé en toutes circonstances, sur tous les canaux."
        },
        {
            icon: Scale,
            title: "Souveraineté Numérique",
            desc: "L'utilisation des ressources de la plateforme doit être conforme aux objectifs de l'institut et au respect de la souveraineté nationale."
        }
    ];

    return (
        <main className="min-h-screen bg-zinc-50 text-slate-900 selection:bg-indigo-100 py-32 px-6">
            <div className="max-w-5xl mx-auto space-y-24">
                {/* Header Section */}
                <div className="space-y-12">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-indigo-600 transition-colors group"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Retour au Portail Principal
                    </Link>

                    <div className="space-y-6">
                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs font-black uppercase tracking-[0.5em] text-indigo-500"
                        >
                            Cadre Disciplinaire
                        </motion.h2>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9]"
                        >
                            Règlement <br />
                            <span className="text-slate-400">INTÉRIEUR</span>
                        </motion.h1>
                        <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl italic">
                            &quot;L&apos;excellence académique est indissociable d&apos;une discipline exemplaire.&quot;
                        </p>
                    </div>
                </div>

                {/* Rules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {rules.map((rule, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-10 bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 transition-all flex flex-col gap-6"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-indigo-600">
                                <rule.icon className="w-7 h-7" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-2xl font-black uppercase tracking-tight">{rule.title}</h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                    {rule.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* sanctions block */}
                <div className="p-12 md:p-16 rounded-[4rem] bg-indigo-600 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-1000">
                        <Scale className="w-48 h-48" />
                    </div>
                    <div className="relative z-10 space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-black uppercase tracking-tight">Mesures & Sanctions</h2>
                            <p className="text-indigo-100 font-medium leading-relaxed max-w-2xl">
                                Tout manquement grave aux dispositions du présent règlement peut entraîner des sanctions allant de l&apos;avertissement
                                à l&apos;exclusion définitive de la plateforme CRYPTE, sans préjudice des poursuites judiciaires éventuelles
                                en cas d&apos;atteinte à la propriété intellectuelle ou à la sécurité des systèmes.
                            </p>
                        </div>
                        <div className="h-px w-20 bg-white/30" />
                        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-200">
                            Fait à Likasi • Direction Académique ENSN
                        </div>
                    </div>
                </div>

                <div className="text-center pt-12">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                        © {new Date().getFullYear()} CRYPTE • INSTITUT SUPÉRIEUR D&apos;ÉTUDE SOCIALE
                    </p>
                </div>
            </div>
        </main>
    );
}
