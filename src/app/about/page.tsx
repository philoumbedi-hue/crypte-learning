"use client";

import { GraduationCap, Award, Target, ChevronRight, ChevronLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-white selection:bg-indigo-500/30 selection:text-indigo-200 py-32 px-6 overflow-hidden">
            <div className="max-w-6xl mx-auto space-y-32 relative">
                {/* Visual accents */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] -z-10" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-zinc-600/5 rounded-full blur-[100px] -z-10" />

                {/* Hero section */}
                <div className="space-y-12">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors group"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Retour au Portail Principal
                    </Link>

                    <div className="space-y-8">
                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs font-black uppercase tracking-[0.5em] text-indigo-500"
                        >
                            Notre Identité Institutionnelle
                        </motion.h2>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.85]"
                        >
                            L&apos;excellence <br />
                            <span className="text-zinc-600">ACADÉMIQUE</span>
                        </motion.h1>
                        <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl leading-relaxed font-medium italic">
                            &quot;Bâtir la souveraineté numérique nationale par la transmission d&apos;un savoir d&apos;exception.&quot;
                        </p>
                    </div>
                </div>

                {/* Cards Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <motion.section
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-12 rounded-[3.5rem] bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl space-y-8 hover:border-indigo-500/30 transition-all duration-500 group"
                    >
                        <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform duration-500">
                            <Target className="w-8 h-8" />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-3xl font-black uppercase tracking-tight">Notre Mission</h2>
                            <p className="text-zinc-400 leading-relaxed text-lg font-medium">
                                Démocratiser l&apos;accès à une éducation académique de standard international tout en restant ancré dans les ambitions du continent. Nous formons les leaders de demain aux technologies critiques.
                            </p>
                        </div>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-12 rounded-[3.5rem] bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl space-y-8 hover:border-indigo-500/30 transition-all duration-500 group"
                    >
                        <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform duration-500">
                            <Award className="w-8 h-8" />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-3xl font-black uppercase tracking-tight">Notre Vision</h2>
                            <p className="text-zinc-400 leading-relaxed text-lg font-medium">
                                Devenir la référence continentale de l&apos;excellence numérique, où la rigueur scientifique rencontre l&apos;innovation pour créer un impact souverain et durable.
                            </p>
                        </div>
                    </motion.section>
                </div>

                {/* Signature Block */}
                <section className="relative p-12 md:p-24 rounded-[4.5rem] bg-indigo-600 text-white text-center space-y-10 overflow-hidden group">
                    <div className="absolute top-0 right-0 p-16 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                        <GraduationCap className="w-64 h-64" />
                    </div>

                    <div className="relative z-10 space-y-6">
                        <ShieldCheck className="w-16 h-16 mx-auto mb-8 text-indigo-200" />
                        <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                            L&apos;ART DE DIRIGER <br />
                            PAR LE SAVOIR
                        </h2>
                        <p className="text-indigo-100 max-w-xl mx-auto font-medium text-lg md:text-xl italic">
                            &quot;Notre ambition est de construire une académie où chaque académien devient un architecte de la nation.&quot;
                        </p>
                    </div>

                    <div className="relative z-10 pt-12 border-t border-white/20 w-fit mx-auto">
                        <span className="text-sm font-black uppercase tracking-[0.4em] text-white">
                            PHILOSOPHE KASONGO
                        </span>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200 mt-2">
                            Direction Académique • ENSN
                        </div>
                    </div>
                </section>

                <footer className="pt-24 border-t border-zinc-900 flex flex-col items-center gap-8">
                    <Link href="/admissions" className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 hover:text-indigo-500 transition-all">
                        Rejoindre l&apos;Institut <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </Link>
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-700">
                        © {new Date().getFullYear()} CRYPTE • INSTITUT SUPÉRIEUR D&apos;ÉTUDE SOCIALE
                    </p>
                </footer>
            </div>
        </main>
    );
}
