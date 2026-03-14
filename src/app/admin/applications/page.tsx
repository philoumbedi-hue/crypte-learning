import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import ApplicationAdminClient from "./application-admin-client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AdminApplicationsPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN_ACADEMIC" && session.user.role !== "ADMIN")) {
        redirect("/dashboard");
    }

    const applications = await db.application.findMany({
        include: {
            user: true,
            discipline: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Retour au Dashboard
            </Link>

            <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 border-b border-slate-200 pb-4">
                Gestion des Candidatures
            </h1>
            <p className="text-slate-500 font-medium">
                Examinez les dossiers d&apos;admission, planifiez les entretiens et validez l&apos;intégration des candidats à l&apos;ENSN.
            </p>

            <ApplicationAdminClient initialApplications={applications} />
        </div>
    );
}

