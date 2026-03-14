"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Vérification de votre compte...");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Lien de vérification manquant.");
            return;
        }

        const verifyToken = async () => {
            try {
                const response = await fetch("/api/auth/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();

                if (response.ok) {
                    setStatus("success");
                    setMessage("Votre compte a été activé avec succès !");
                } else {
                    setStatus("error");
                    setMessage(data.error || "Le lien est invalide ou a expiré.");
                }
            } catch {
                setStatus("error");
                setMessage("Une erreur est survenue lors de la vérification.");
            }
        };

        verifyToken();
    }, [token]);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 shadow-2xl border border-zinc-200 dark:border-zinc-800 text-center space-y-6">

                <div className="flex justify-center">
                    {status === "loading" && (
                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-full animate-spin">
                            <Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                        </div>
                    )}
                    {status === "success" && (
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
                            <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    )}
                    {status === "error" && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-full">
                            <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-black tracking-tight uppercase">
                        {status === "loading" ? "Vérification..." : status === "success" ? "Compte Activé" : "Erreur"}
                    </h1>
                    <p className="text-zinc-500 font-medium">{message}</p>
                </div>

                {status !== "loading" && (
                    <div className="pt-4">
                        <Link
                            href="/auth/signin"
                            className="bg-black dark:bg-white text-white dark:text-black w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:opacity-90 transition flex items-center justify-center gap-2 group"
                        >
                            {status === "success" ? "Se Connecter" : "Retour à l'accueil"}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
