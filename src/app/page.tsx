"use client";

import Link from "next/link";
import {
  GraduationCap,
  Shield,
  BrainCircuit,
  Cloud,
  Atom,
  Satellite,
  ArrowRight
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

const STEPS = [
  {
    number: "01",
    title: "Candidature",
    description: "Inscrivez-vous et soumettez votre dossier pour rejoindre l'excellence de l'ENSN.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop"
  },
  {
    number: "02",
    title: "Exploration",
    description: "Accédez au catalogue complet et découvrez nos facultés de pointe spécialisées.",
    image: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?q=80&w=1200&auto=format&fit=crop"
  },
  {
    number: "03",
    title: "Maîtrise",
    description: "Suivez vos cours magistraux et obtenez vos certifications numériques de haut niveau.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop"
  }
];

const FACULTIES = [
  {
    title: "Défense Réseau",
    description: "Protection des infrastructures critiques et résilience cybernétique nationale.",
    icon: Shield,
    color: "from-blue-600/20 to-indigo-600/20",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Intelligence Artificielle",
    description: "Algorithmes souverains et traitement massif de données pour la décision stratégique.",
    icon: BrainCircuit,
    color: "from-purple-600/20 to-pink-600/20",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Infrastructures Cloud",
    description: "Souveraineté des données et déploiement de solutions cloud natales sécurisées.",
    icon: Cloud,
    color: "from-cyan-600/20 to-blue-600/20",
    image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Post-Quantique",
    description: "Cryptographie de nouvelle génération face aux futures menaces computationnelles.",
    icon: Atom,
    color: "from-amber-600/20 to-orange-600/20",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Télécoms Souveraines",
    description: "Réseaux de communication résilients et indépendance des flux d'information.",
    icon: Satellite,
    color: "from-emerald-600/20 to-teal-600/20",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
  },
];

import MeshBackground from "@/components/ui/MeshBackground";
import { useSession } from "next-auth/react";
import { LivePromotion } from "@/components/LivePromotion";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* --- HERO SECTION: Pure Symmetry & Order --- */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-32 bg-slate-50/50">
        <MeshBackground />

        <div className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-16 relative z-10 w-full animate-in fade-in slide-in-from-bottom-10 duration-1000">
          {/* Text Block - Perfectly Centered */}
          <div className="space-y-10 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex py-2 px-6 rounded-full bg-white border border-slate-200 text-indigo-600 text-[10px] font-black uppercase tracking-[0.4em] shadow-sm mb-4"
            >
              Établissement d&apos;Excellence
            </motion.div>

            <div className="space-y-8">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-slate-900 uppercase">
                BIENVENU SUR LA <br />
                PLATEFORME <span className="text-indigo-600">CRYPTE</span> <br />
                E-LEARNING
              </h1>

              <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 leading-relaxed font-medium">
                Maîtrisez les technologies stratégiques au sein de notre académie de pointe. <br className="hidden md:block" />
                Une immersion totale dans le savoir d&apos;exception pour les futurs leaders.
              </p>
            </div>
          </div>

          {/* Symmetrical Hero Image & Integrated Actions */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="w-full max-w-5xl aspect-video rounded-[4rem] overflow-hidden shadow-2xl shadow-indigo-100 border-[16px] border-white relative group"
          >
            <Image
              src="/images/graduation_succes.png"
              alt="Célébration de la réussite - Crypte"
              fill
              className="object-cover transition-transform duration-[20s] group-hover:scale-110 ease-out"
              priority
            />
            {/* Darker gradient for better button contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/10 to-slate-900/60" />

            {/* Integrated CTA Buttons Overlay */}
            <div className="absolute inset-0 flex flex-col sm:flex-row items-center justify-center gap-6 p-12">
              <Link
                href={session ? "/dashboard" : "/auth/signin"}
                className="group flex items-center gap-4 px-12 py-6 bg-indigo-600 text-white font-black rounded-3xl shadow-2xl hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all duration-300 text-sm uppercase tracking-widest pointer-events-auto"
              >
                {session ? "Mon Espace Étudiant" : "Démarrer l&apos;Apprentissage"} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              {!session ? (
                <Link
                  href="/auth/signin"
                  className="px-12 py-6 bg-white/90 backdrop-blur-xl border border-white text-slate-900 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-white hover:scale-105 transition-all duration-300 pointer-events-auto shadow-2xl shadow-indigo-500/10"
                >
                  Connexion
                </Link>
              ) : (
                <Link
                  href="/catalogue"
                  className="px-12 py-6 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all duration-300 pointer-events-auto"
                >
                  Explorer nos Facultés
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- LIVE PROMOTION --- */}
      <LivePromotion />

      {/* --- STEPS SECTION --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {STEPS.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="group flex flex-col items-center space-y-8"
            >
              {/* Image Portal */}
              <div className="relative w-full aspect-[4/5] rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl shadow-indigo-100/50 group-hover:scale-[1.02] transition-transform duration-700">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover transition-transform duration-[10s] group-hover:scale-110 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 via-transparent to-transparent opacity-40" />

                {/* Step Number Overlay */}
                <div className="absolute top-8 left-8 flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl text-indigo-600 font-black text-xs shadow-xl">
                  {step.number}
                </div>
              </div>

              {/* Text - Pure Symmetry */}
              <div className="text-center space-y-4 px-4">
                <h4 className="text-3xl font-black tracking-tighter uppercase text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {step.title}
                </h4>
                <p className="text-slate-500 font-medium leading-relaxed max-w-[280px] mx-auto text-sm">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- BENTO FACULTIES SECTION --- */}
      <section className="py-32 px-6 max-w-7xl mx-auto bg-slate-50 rounded-[4rem]">
        <div className="space-y-6 mb-24 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-xs font-black uppercase tracking-[0.4em] text-indigo-500 mb-4 block"
          >
            Spécialisations Académiques
          </motion.span>
          <h2 className="text-4xl md:text-7xl font-black tracking-tight uppercase text-slate-900">
            DOMAINES D&apos;<span className="text-indigo-600">EXPERTISE</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">
            Un curriculum d&apos;élite conçu pour former les pionniers de l&apos;indépendance technique nationale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {FACULTIES.map((faculty, idx) => (
            <Link
              href="/auth/signin"
              key={idx}
              className="group flex flex-col overflow-hidden rounded-[3rem] bg-white border border-slate-100 shadow-sm transition-all duration-700 hover:shadow-2xl hover:shadow-indigo-100 hover:translate-y-[-10px]"
            >
              {/* Standardized Header */}
              <div className="relative h-[240px] w-full overflow-hidden">
                <Image
                  src={faculty.image}
                  alt={faculty.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out"
                />

                {/* Floating Icon - Standardized position */}
                <div className="absolute top-6 left-6 p-4 bg-white shadow-xl text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                  <faculty.icon className="w-6 h-6" />
                </div>
              </div>

              <div className="p-10 space-y-6 bg-white flex flex-col flex-grow">
                <div className="flex items-center justify-between">
                  <h4 className="text-2xl font-black tracking-tight uppercase text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {faculty.title}
                  </h4>
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>

                <p className="text-slate-500 text-sm font-medium leading-relaxed group-hover:text-slate-700 line-clamp-3">
                  {faculty.description}
                </p>

                <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Cursus Standard</span>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Souveraineté</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Card */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <Link
          href="/auth/signin"
          className="group relative p-16 rounded-[4rem] bg-indigo-600 flex flex-col items-center justify-center text-center gap-8 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
        >
          <div className="p-8 bg-white text-indigo-600 rounded-full group-hover:scale-110 transition-transform shadow-lg">
            <ArrowRight className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <span className="text-sm font-black uppercase tracking-[0.4em] text-indigo-200 block">Prêt à commencer ?</span>
            <span className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white block">Explorez tout le catalogue</span>
          </div>
        </Link>
      </section>

      {/* --- INSTITUTIONAL FOOTER --- */}
      <footer className="relative pt-32 pb-16 bg-white border-t border-slate-100 overflow-hidden">
        {/* Subtle background element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-indigo-100 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 pb-24 border-b border-slate-50">
            {/* Column 1: Identity & Flag */}
            <div className="space-y-8">
              <div className="flex items-center gap-4 group">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-100 group-hover:scale-110 transition-transform duration-500">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">CRYPTE</span>
                  <span className="text-[8px] font-black uppercase tracking-[0.3em] text-indigo-500">Institut d&apos;Excellence</span>
                </div>
              </div>

              {/* DRC Flag - Aesthetic Integration */}
              <div className="flex items-center gap-4 py-4 px-6 bg-slate-50 rounded-2xl border border-slate-100 w-fit group hover:border-indigo-200 transition-colors">
                <div className="w-10 h-7 rounded-[4px] overflow-hidden shadow-sm relative">
                  <svg viewBox="0 0 800 600" className="w-full h-full object-cover">
                    <rect width="800" height="600" fill="#007FFF" />
                    <path d="M 0,530 L 700,0 L 800,0 L 800,70 L 100,600 L 0,600 Z" fill="#F7D117" />
                    <path d="M 0,555 L 740,0 L 800,0 L 800,45 L 60,600 L 0,600 Z" fill="#CE1021" />
                    <polygon points="150,110 188,227 289,227 207,287 238,401 150,331 62,401 93,287 11,227 112,227" fill="#F7D117" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Souveraineté</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">RDC • État Nation</span>
                </div>
              </div>

              <p className="text-slate-500 text-xs font-medium leading-relaxed max-w-[240px]">
                Bâtir l&apos;indépendance numérique par l&apos;excellence académique et la rigueur stratégique.
              </p>
            </div>

            {/* Column 2: Doctrine */}
            <div className="space-y-8">
              <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Piliers de l&apos;ENSN</h5>
              <div className="flex flex-col gap-4">
                {[
                  "Rigueur Académique",
                  "Excellence Stratégique",
                  "Autonomie Technique",
                  "Souveraineté Nationale"
                ].map((text) => (
                  <div key={text} className="flex items-center gap-3 group cursor-default">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-200 group-hover:bg-indigo-500 transition-colors" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-600 group-hover:text-slate-900 transition-colors">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Navigation */}
            <div className="space-y-8">
              <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Navigation</h5>
              <div className="flex flex-col gap-4">
                <Link href="/about" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">L&apos;Institut</Link>
                <Link href="/admissions" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">Admissions</Link>
                <Link href="/catalogue" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">Programmes</Link>
                <Link href="/contact" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">Contact</Link>
              </div>
            </div>

            {/* Column 4: Legal */}
            <div className="space-y-8">
              <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Légalité</h5>
              <div className="flex flex-col gap-4">
                <Link href="/legal" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">Mentions Légales</Link>
                <Link href="/privacy" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">Confidentialité</Link>
                <Link href="/rules" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">Règlement Intérieur</Link>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              © {new Date().getFullYear()} CRYPTE • INSTITUT SUPÉRIEUR D&apos;ÉTUDE SOCIALE
            </p>
            <div className="flex items-center gap-8">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400">Standard Alpha Premium</span>
              <div className="w-px h-10 bg-slate-100 hidden md:block" />
              <p className="text-[10px] font-bold text-slate-400">République Démocratique du Congo</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
