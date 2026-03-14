import { getDisciplines } from "@/actions/discipline";
import DisciplinesList from "./discipline-list";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDisciplinesPage() {
    const disciplines = await getDisciplines();

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Retour au Dashboard
            </Link>

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Gestion des Disciplines</h1>
                    <p className="text-zinc-500 mt-1">Organisez vos cours par domaines d&apos;études.</p>
                </div>
            </div>
            <DisciplinesList disciplines={disciplines} />
        </div>
    );
}
