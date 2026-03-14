import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import ImportForm from "./import-form";
import { hasRequiredRole } from "@/lib/rbac";
import type { Role } from "@/lib/rbac";

export default async function ImportPage() {
    const session = await getServerSession(authOptions);

    if (!session || !hasRequiredRole(session.user.role as Role, "SUPER_ADMIN")) {
        redirect("/");
    }


    return (
        <div className="p-8 space-y-8">
            <Link
                href="/admin"
                className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors mb-2 inline-block"
            >
                ← Retour à l’administration
            </Link>
            <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tight">Importation de Curriculum</h1>
                <p className="text-zinc-500 dark:text-zinc-400">
                    Insérez automatiquement des structures académiques complexes via JSON.
                </p>
            </div>

            <ImportForm />
        </div>
    );
}
