"use client";

import { Scale, ShieldCheck, FileText, GraduationCap, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LegalPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-white selection:bg-indigo-500/30 selection:text-indigo-200 py-32 px-6 overflow-hidden">
            <div className="max-w-4xl mx-auto space-y-24 relative">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] -z-10" />

                {/* Header */}
                <div className="space-y-12">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors group"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Retour au Portail
                    </Link>

                    <div className="space-y-6">
                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs font-black uppercase tracking-[0.5em] text-indigo-500"
                        >
                            Conformité & Souveraineté
                        </motion.h2>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]"
                        >
                            Mentions <br />
                            <span className="text-zinc-600">LÉGALES</span>
                        </motion.h1>
                    </div>
                </div>

                {/* Sections */}
                <div className="space-y-10">
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="group p-10 bg-zinc-900/40 border border-zinc-800/50 rounded-[3rem] backdrop-blur-xl hover:border-indigo-500/30 transition-all duration-500"
                    >
                        <div className="flex items-center gap-6 mb-8">
                            <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tight">Éditeur de la plateforme</h2>
                        </div>
                        <div className="space-y-6 text-zinc-400 font-medium leading-relaxed">
                            <p>
                                La plateforme académique <strong className="text-white">CRYPTE</strong> est éditée par l&apos;Institut Supérieur d&apos;Étude Sociale (RDC).
                                Elle constitue l&apos;infrastructure numérique de référence pour la formation aux technologies stratégiques.
                            </p>
                            <div className="p-6 bg-black/40 rounded-2xl border border-zinc-800 text-sm space-y-2">
                                <div className="flex justify-between"><span>Siège social</span> <span className="text-zinc-200">Likasi, RDC</span></div>
                                <div className="flex justify-between"><span>Direction académique</span> <span className="text-zinc-200">Philosophe Kasongo</span></div>
                                <div className="flex justify-between"><span>Contact technique</span> <span className="text-zinc-200">philosophekasongo@gmail.com</span></div>
                            </div>
                        </div>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="group p-10 bg-zinc-900/40 border border-zinc-800/50 rounded-[3rem] backdrop-blur-xl hover:border-indigo-500/30 transition-all duration-500"
                    >
                        <div className="flex items-center gap-6 mb-8">
                            <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tight">Propriété Intellectuelle</h2>
                        </div>
                        <p className="text-zinc-400 font-medium leading-relaxed">
                            L&apos;intégralité des modules, codes sources, vidéos et contenus pédagogiques sont protégés par les lois internationales sur la propriété intellectuelle.
                            Toute reproduction ou exploitation non autorisée du &quot;Standard Alpha&quot; est passible de poursuites.
                        </p>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="group p-10 bg-zinc-900/40 border border-zinc-800/50 rounded-[3rem] backdrop-blur-xl hover:border-indigo-500/30 transition-all duration-500"
                    >
                        <div className="flex items-center gap-6 mb-8">
                            <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                                <Scale className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tight">Hébergement Souverain</h2>
                        </div>
                        <p className="text-zinc-400 font-medium leading-relaxed">
                            Conformément à nos principes de souveraineté numérique, l&apos;infrastructure technique est hébergée sur des serveurs garantissant
                            l&apos;indépendance des données et la résilience face aux menaces extérieures.
                        </p>
                    </motion.section>
                </div>

                <footer className="pt-24 border-t border-zinc-900 text-center flex flex-col items-center gap-6">
                    <GraduationCap className="w-10 h-10 text-zinc-700" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-600">
                        © {new Date().getFullYear()} CRYPTE • INSTITUT SUPÉRIEUR D&apos;ÉTUDE SOCIALE • ALPHA-01
                    </p>
                </footer>
            </div>
        </main>
    );
}
