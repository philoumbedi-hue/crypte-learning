"use client";

import { Mail, Phone, MapPin, Send, GraduationCap } from "lucide-react";
import Link from "next/link";
import MeshBackground from "@/components/ui/MeshBackground";
import { useState } from "react";

export default function ContactPage() {
    const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");
        setTimeout(() => setStatus("sent"), 1500);
    };

    return (
        <main className="relative min-h-screen bg-black text-white selection:bg-white/30 pt-32 pb-20 px-6">
            <MeshBackground />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center space-y-4 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h2 className="text-sm font-black uppercase tracking-[0.5em] text-zinc-500">Service des Admissions</h2>
                    <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                        REJOINDRE <br /> <span className="text-zinc-500">L&apos;EXCELLENCE</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Info Side */}
                    <div className="space-y-12 animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
                        <section className="space-y-6">
                            <h3 className="text-2xl font-bold uppercase tracking-tight">Coordonnées Académiques</h3>
                            <p className="text-zinc-400 text-lg leading-relaxed">
                                Pour toute demande d&apos;admission ou information complémentaire sur nos facultés souveraines, nos officiers d&apos;admission sont à votre disposition.
                            </p>
                        </section>

                        <div className="space-y-8">
                            <div className="flex items-start gap-6 group">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-white/10 transition-all">
                                    <Mail className="w-6 h-6 text-zinc-400 group-hover:text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Email Officiel</p>
                                    <p className="text-xl font-bold">philosophekasongo@gmail.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6 group">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-white/10 transition-all">
                                    <Phone className="w-6 h-6 text-zinc-400 group-hover:text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Assistance Téléphonique</p>
                                    <p className="text-xl font-bold">+243 990 626 378</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6 group">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-white/10 transition-all">
                                    <MapPin className="w-6 h-6 text-zinc-400 group-hover:text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Siège Académique</p>
                                    <p className="text-xl font-bold italic text-zinc-400">Kikula, Likasi, RDC</p>
                                </div>
                            </div>
                        </div>

                        {/* Back Link */}
                        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors uppercase text-sm font-bold tracking-widest">
                            ← Retour à l&apos;accueil
                        </Link>
                    </div>

                    {/* Form Side */}
                    <div className="animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
                        <div className="p-8 md:p-12 bg-zinc-950/50 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl space-y-8">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold tracking-tight">Dossier de Candidature</h3>
                                <p className="text-zinc-500 text-sm">Remplissez ce formulaire pour initier votre processus d&apos;admission.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Nom Complet</label>
                                        <input required type="text" className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm" placeholder="Ex: Jean Paul" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Email de contact</label>
                                        <input required type="email" className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm" placeholder="Ex: jean.paul@email.com" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Faculté visée</label>
                                    <select className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm appearance-none">
                                        <option className="bg-zinc-900">Défense Réseau</option>
                                        <option className="bg-zinc-900">IA & Big Data</option>
                                        <option className="bg-zinc-900">Infrastructure Cloud</option>
                                        <option className="bg-zinc-900">Cryptographie Post-Quantique</option>
                                        <option className="bg-zinc-900">Télécoms Souveraines</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Message / Motivations</label>
                                    <textarea rows={4} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm resize-none" placeholder="Décrivez brièvement votre parcours et vos ambitions..."></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={status !== "idle"}
                                    className="w-full py-5 bg-white text-black font-black rounded-2xl text-lg uppercase tracking-tighter hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {status === "idle" && <><Send className="w-5 h-5" /> Envoyer la demande</>}
                                    {status === "sending" && <span className="animate-pulse">Envoi en cours...</span>}
                                    {status === "sent" && "Dossier envoyé avec succès !"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Footer simple */}
                <div className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40">
                    <div className="flex items-center gap-3">
                        <GraduationCap className="w-6 h-6" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
                            © {new Date().getFullYear()} CRYPTE • EXCELLENCE ACADÉMIQUE
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
