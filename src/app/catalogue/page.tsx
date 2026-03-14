import db from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, BookOpen, ChevronRight, GraduationCap, Video } from "lucide-react";
import Image from "next/image";
import { domainImageMap } from "@/lib/domainImages";
import DisciplineSelect from "./discipline-select";
import SearchBar from "./search-bar";

interface CataloguePageProps {
    searchParams: { discipline?: string; q?: string };
}

export default async function CataloguePage({ searchParams }: CataloguePageProps) {
    const selectedDisciplineId = searchParams.discipline;

    // Fetch all disciplines for the sidebar with course counts
    const disciplines = await db.discipline.findMany({
        orderBy: { name: "asc" },
        include: {
            _count: {
                select: { courses: true }
            }
        }
    });

    // AUTO-SELECT FIRST DISCIPLINE IF NONE PROVIDED
    const activeDisciplineId = selectedDisciplineId || null;

    // Fetch courses, filtered by discipline AND search query
    const query = searchParams.q;

    const courses = (activeDisciplineId || query) ? await db.course.findMany({
        where: {
            AND: [
                activeDisciplineId ? { disciplineId: activeDisciplineId } : {},
                query ? {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } }
                    ]
                } : {}
            ]
        },
        include: {
            _count: {
                select: { modules: true },
            },
        },
        orderBy: { title: "asc" },
    }) : [];

    const selectedDiscipline = disciplines.find(d => d.id === activeDisciplineId);

    // Helper to clean domain names (remove leading emoji)
    const cleanName = (name: string) => name.replace(/^[\p{Emoji}\s]+/u, '');

    return (
        <div className="min-h-screen bg-white transition-colors duration-500 selection:bg-indigo-100 selection:text-indigo-900">
            {/* Main Content Area */}
            <div className="max-w-[1600px] mx-auto px-8 pb-32 pt-32">
                {/* --- CATALOGUE HERO --- */}
                <section className="relative mt-12 mb-20 rounded-[4rem] overflow-hidden bg-slate-900 shadow-2xl shadow-indigo-100/50 min-h-[400px] flex items-center">
                    <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-10" />
                    <Image
                        src="https://images.unsplash.com/photo-1523246227974-dee2c8557342?q=80&w=2000&auto=format&fit=crop"
                        alt="Background"
                        fill
                        className="object-cover opacity-40 grayscale-[0.5] mix-blend-overlay"
                        priority
                    />

                    <div className="relative z-20 py-24 px-12 md:px-24 max-w-5xl space-y-8">
                        {selectedDisciplineId ? (
                            <Link
                                href="/catalogue"
                                className="inline-flex items-center gap-2 text-indigo-300 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.3em] mb-4 group/back"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover/back:-translate-x-1 transition-transform" />
                                Retour aux Facultés
                            </Link>
                        ) : (
                            <div className="inline-flex items-center gap-3 px-5 py-2 bg-indigo-500/20 backdrop-blur-xl rounded-full border border-white/10 text-indigo-200 text-[10px] font-black uppercase tracking-[0.3em]">
                                <BookOpen className="w-4 h-4" />
                                Catalogue des Savoirs
                            </div>
                        )}
                        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] uppercase">
                            {selectedDiscipline ? cleanName(selectedDiscipline.name) : "Exploration Stratégique"}
                        </h1>
                        <p className="text-slate-300 text-lg md:text-2xl font-medium max-w-3xl leading-relaxed">
                            {selectedDiscipline
                                ? "Un curriculum d'élite conçu pour forger l'excellence technique et la vision stratégique dans ce domaine critique."
                                : "Accédez à nos facultés de pointe et maîtrisez les technologies qui définissent la souveraineté de demain."}
                        </p>

                        <div className="pt-8">
                            <SearchBar />
                        </div>
                    </div>
                </section>

                <div className="space-y-32">
                    {/* --- VISUAL DOMAIN GRID --- */}
                    {!selectedDisciplineId && (
                        <section className="space-y-16">
                            <div className="flex items-center justify-between">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-indigo-500">Choisir une Faculté</h2>
                                <div className="h-px flex-1 bg-slate-100 mx-10 hidden md:block" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{disciplines.length} Domaines d&apos;Expertise</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                                {disciplines.map((d) => {
                                    const image = domainImageMap[d.name] || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop";
                                    return (
                                        <Link
                                            key={d.id}
                                            href={`/catalogue?discipline=${d.id}`}
                                            className="group relative aspect-[4/5] rounded-[3.5rem] overflow-hidden border-8 border-white shadow-xl shadow-indigo-100/50 hover:shadow-2xl hover:shadow-indigo-200 hover:-translate-y-2 transition-all duration-700"
                                        >
                                            <Image
                                                src={image}
                                                alt={d.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-[4s] ease-out"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                                            <div className="absolute inset-0 p-10 flex flex-col justify-end gap-3">
                                                <span className="text-white font-black text-2xl leading-tight uppercase tracking-tight group-hover:text-indigo-300 transition-colors">
                                                    {cleanName(d.name)}
                                                </span>
                                                <div className="flex items-center justify-between mt-4">
                                                    <span className="px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-2xl text-[10px] font-black text-white/90 uppercase tracking-widest border border-white/10">
                                                        {d._count.courses} Cours
                                                    </span>
                                                    <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 shadow-xl shadow-indigo-500/50">
                                                        <ChevronRight className="w-6 h-6" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    <div className="flex flex-col lg:flex-row gap-20 items-start">
                        {/* SIDEBAR */}
                        <aside className="w-full lg:w-[360px] lg:sticky lg:top-32 space-y-16 shrink-0">
                            <div className="space-y-8">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 px-8">Exploration Rapide</h3>
                                <DisciplineSelect disciplines={disciplines} activeDisciplineId={activeDisciplineId} />
                            </div>

                            <div className="p-12 bg-slate-950 rounded-[4rem] text-white shadow-2xl shadow-indigo-100 relative overflow-hidden group">
                                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-indigo-600/20 rounded-full group-hover:scale-150 transition-transform duration-1000" />
                                <GraduationCap className="w-12 h-12 mb-8 text-indigo-500" />
                                <h4 className="text-2xl font-black leading-tight uppercase mb-6">Élite Académique</h4>
                                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                    Rejoignez une communauté de leaders et accédez à des ressources stratégiques exclusives.
                                </p>
                            </div>
                        </aside>

                        {/* MAIN CONTENT - COURSES */}
                        <main className="flex-1 min-h-[800px] space-y-12">
                            {selectedDisciplineId && (
                                <Link
                                    href="/catalogue"
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-slate-50 hover:bg-slate-100 rounded-3xl text-slate-500 hover:text-slate-900 transition-all text-xs font-black uppercase tracking-widest border border-slate-100 group/btn"
                                >
                                    <ArrowLeft className="w-5 h-5 group-hover/btn:-translate-x-1 transition-transform" />
                                    Toutes les Facultés
                                </Link>
                            )}
                            {courses.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {courses.map((course) => (
                                        <Link
                                            key={course.id}
                                            href={`/courses/${course.id}`}
                                            className="group bg-white border border-slate-100 rounded-[4rem] overflow-hidden hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-3 transition-all duration-700 flex flex-col"
                                        >
                                            {/* Course Banner */}
                                            <div className="aspect-[16/10] relative bg-slate-50 overflow-hidden">
                                                <div className="absolute top-8 left-8 px-5 py-2 bg-indigo-600 text-white rounded-full text-[9px] font-black uppercase tracking-[0.3em] shadow-2xl z-20">
                                                    Premium
                                                </div>
                                                {course.imageUrl ? (
                                                    <Image
                                                        src={course.imageUrl}
                                                        alt={course.title}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-[3s] ease-out"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <BookOpen className="w-20 h-20 text-slate-100" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                                                <div className="absolute bottom-8 right-8 px-5 py-2 bg-white/90 backdrop-blur-xl rounded-full text-[9px] font-black uppercase tracking-[0.3em] text-slate-900 border border-white/50 z-20 shadow-xl">
                                                    {course.level || "Expert"}
                                                </div>
                                            </div>

                                            {/* Card Body */}
                                            <div className="p-12 flex-1 flex flex-col justify-between space-y-10">
                                                <div className="space-y-6">
                                                    <div className="flex items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
                                                        <span>8 Semaines</span>
                                                        <span className="w-1.5 h-1.5 bg-indigo-200 rounded-full" />
                                                        <span>Certifiant</span>
                                                    </div>
                                                    <h3 className="text-2xl md:text-3xl font-black leading-tight tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors uppercase">
                                                        {course.title}
                                                    </h3>
                                                    {course.description && (
                                                        <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium line-clamp-3">
                                                            {course.description}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between pt-10 border-t border-slate-50">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-indigo-50 transition-colors">
                                                            <Video className="w-5 h-5 text-indigo-400" />
                                                        </div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{course._count.modules} Chapitres</span>
                                                    </div>
                                                    <div className="w-14 h-14 rounded-full bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all flex items-center justify-center shadow-lg group-hover:shadow-indigo-200 group-hover:scale-110 duration-500">
                                                        <ChevronRight className="w-7 h-7" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="w-full min-h-[600px] flex flex-col items-center justify-center text-center space-y-16 bg-slate-50 rounded-[4rem] p-12 md:p-24 border border-dashed border-slate-200 overflow-hidden relative">
                                    <div className="relative w-full max-w-2xl aspect-video rounded-[3rem] overflow-hidden shadow-2xl shadow-indigo-100 group/celebration">
                                        <Image
                                            src="/hero-graduation.png"
                                            alt="Étudiants célébrant leur réussite"
                                            fill
                                            className="object-cover group-hover/celebration:scale-110 transition-transform duration-[5s] ease-out"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                                    </div>
                                    <div className="space-y-6 relative z-10">
                                        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 uppercase">Votre Réussite Commence Ici</h2>
                                        <p className="text-slate-500 max-w-xl mx-auto font-medium text-lg md:text-2xl leading-relaxed">
                                            Veuillez sélectionner une faculté dans le menu ou la grille ci-dessus pour explorer nos programmes d&apos;excellence.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </div>

            <footer className="py-24 border-t border-slate-100 bg-white relative overflow-hidden">
                {/* Subtle background elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-indigo-100 to-transparent" />

                <div className="max-w-[1600px] mx-auto px-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 pb-24 border-b border-slate-50">
                        {/* Column 1: Identity & Sovereignty */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-4 group">
                                <div className="p-3 bg-indigo-600 rounded-2xl text-white group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-indigo-100">
                                    <GraduationCap className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-black tracking-tighter text-2xl text-slate-900 leading-none">CRYPTE</span>
                                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-indigo-500">Institut d&apos;Excellence</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-6">
                                {/* DRC Flag */}
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
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 leading-tight">Souveraineté</span>
                                        <span className="text-[8px] font-bold text-slate-400 uppercase">RDC • État Nation</span>
                                    </div>
                                </div>

                                {/* Africa Continent Symbol */}
                                <div className="flex items-center gap-4 py-4 px-6 bg-slate-50 rounded-2xl border border-slate-100 w-fit group hover:border-indigo-200 transition-colors">
                                    <div className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-100 text-indigo-600 transition-transform group-hover:scale-110">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                                            <path d="M4 14.5c.5-1 2.5-1.5 3-3s.5-3.5 2.5-4 4-1 5.5.5s1.5 2.5 1.5 4.5-.5 4-2.5 5.5-4 2.5-6 2.5-3-1-4-6z" />
                                            <path d="M12 2a10 10 0 1 1-6.32 17.74" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 leading-tight">Continent</span>
                                        <span className="text-[8px] font-bold text-slate-400 uppercase">Afrique • Futur</span>
                                    </div>
                                </div>
                            </div>
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
                                <Link href="/" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">Accueil</Link>
                                <Link href="/catalogue" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">Catalogue</Link>
                                <Link href="/dashboard" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">Mon Espace</Link>
                            </div>
                        </div>

                        {/* Column 4: Légalité */}
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
                    <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-slate-50">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
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
        </div>
    );
}
