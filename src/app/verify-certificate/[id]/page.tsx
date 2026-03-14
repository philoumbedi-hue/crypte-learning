import db from "@/lib/db";
import { Award, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function VerifyCertificatePage({ params }: { params: { id: string } }) {
    if (!params.id) notFound();

    const certificate = await db.certificate.findUnique({
        where: { id: params.id },
        include: {
            student: { select: { name: true } },
            course: { select: { title: true, discipline: { select: { name: true } } } }
        }
    });

    if (!certificate) {
        return (
            <div className="min-h-screen pt-32 pb-16 px-6 bg-zinc-50 dark:bg-black flex flex-col items-center justify-center">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 max-w-lg w-full text-center shadow-xl">
                    <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-black mb-4">Certificat Introuvable</h1>
                    <p className="text-zinc-500 mb-8 leading-relaxed">
                        L&apos;identifiant fourni ne correspond à aucun certificat valide dans notre base de données.
                    </p>
                    <Link href="/" className="px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl inline-block hover:opacity-90 transition">
                        Retour à l&apos;accueil
                    </Link>
                </div>
            </div>
        );
    }

    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit', month: 'long', year: 'numeric'
    }).format(new Date(certificate.createdAt));

    return (
        <div className="min-h-screen pt-32 pb-16 px-6 bg-zinc-50 dark:bg-black flex flex-col items-center justify-center">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 max-w-2xl w-full text-center shadow-xl overflow-hidden relative">

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 blur-3xl rounded-full" />

                <div className="relative z-10 space-y-8">
                    <div className="w-24 h-24 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-2 ring-8 ring-amber-50 dark:ring-amber-900/20">
                        <Award className="w-12 h-12" />
                    </div>

                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 font-bold text-xs uppercase tracking-widest rounded-full mb-6 border border-green-200 dark:border-green-800/30">
                            <CheckCircle className="w-4 h-4" /> Certificat Authentique Validé
                        </div>
                        <h1 className="text-4xl font-black mb-2">Vérification de Certificat</h1>
                        <p className="text-zinc-500 font-medium">Informations officielles du dossier académique</p>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-950 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800 text-left space-y-6">
                        <div>
                            <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">Détenteur du certificat</p>
                            <p className="text-2xl font-bold">{certificate.student.name}</p>
                        </div>

                        <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800" />

                        <div>
                            <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">Programme Complété</p>
                            <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{certificate.course.title}</p>
                            <p className="text-sm font-medium text-zinc-500 mt-1">{certificate.course.discipline.name}</p>
                        </div>

                        <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800" />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">Date d&apos;émission</p>
                                <p className="font-bold">{formattedDate}</p>
                            </div>
                            <div>
                                <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">ID Unique</p>
                                <p className="font-mono text-xs text-zinc-600 bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded inline-block">{certificate.id}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
