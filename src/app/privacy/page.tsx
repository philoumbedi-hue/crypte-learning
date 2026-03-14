"use client";

import { ShieldCheck, Lock, Eye, FileText, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PrivacyPage() {
    const sections = [
        {
            icon: ShieldCheck,
            title: "Protection des Données",
            content: "CRYPTE s'engage à protéger la vie privée de ses étudiants. Nous mettons en œuvre des mesures de sécurité de haut niveau pour garantir l'intégrité et la confidentialité de vos informations académiques et personnelles."
        },
        {
            icon: Eye,
            title: "Collecte d'Informations",
            content: "Nous collectons uniquement les données nécessaires à votre parcours pédagogique : identité (nom, email), progression dans les cours, et interactions au sein de la plateforme pour améliorer votre expérience d'apprentissage."
        },
        {
            icon: Lock,
            title: "Sécurité & Confidentialité",
            content: "Vos données sont cryptées et stockées sur des serveurs souverains. Aucune information n'est partagée avec des tiers à des fins commerciales. L'accès est strictement limité au personnel autorisé de l'institut."
        },
        {
            icon: FileText,
            title: "Vos Droits",
            content: "Conformément aux normes internationales, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Vous pouvez exercer ces droits à tout moment via votre profil."
        }
    ];

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30 selection:text-indigo-200 py-32 px-6">
            <div className="max-w-4xl mx-auto space-y-20">
                {/* Header */}
                <div className="space-y-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors group"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Retour à l&apos;accueil
                    </Link>

                    <div className="space-y-4">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]"
                        >
                            Politique de <br />
                            <span className="text-indigo-500">Confidentialité</span>
                        </motion.h1>
                        <p className="text-zinc-400 text-lg max-w-2xl font-medium">
                            Engagement institutionnel sur la protection des données et le respect de la vie privée numérique.
                        </p>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {sections.map((section, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-8 rounded-[2.5rem] bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-xl space-y-6 hover:border-indigo-500/30 transition-colors"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                <section.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold uppercase tracking-tight">{section.title}</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                                {section.content}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* detailed block */}
                <div className="p-12 rounded-[3.5rem] bg-indigo-600 space-y-8 relative overflow-hidden">
                    <div className="relative z-10 space-y-4">
                        <h2 className="text-3xl font-black uppercase tracking-tight">Utilisation des Cookies</h2>
                        <p className="text-indigo-100 text-sm leading-relaxed max-w-2xl font-medium">
                            Nous utilisons des cookies techniques essentiels au bon fonctionnement de la session et de la navigation.
                            Ces traceurs ne sont pas utilisés à des fins publicitaires. En continuant votre navigation sur CRYPTE,
                            vous acceptez l&apos;utilisation de ces outils nécessaires à l&apos;excellence de votre expérience pédagogique.
                        </p>
                    </div>
                    {/* Abstract background element */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                </div>

                <footer className="pt-12 border-t border-zinc-800 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">
                        © {new Date().getFullYear()} CRYPTE • INSTITUT D&apos;EXCELLENCE • RIVACY-PR0-V1
                    </p>
                </footer>
            </div>
        </main>
    );
}
