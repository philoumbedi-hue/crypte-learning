"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap, Lock, Mail, Loader2, User, Eye, EyeOff, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";
import { registerUser } from "@/actions/register";

function AuthForm() {
    const [tab, setTab] = useState<"login" | "register">("login");
    // Login state
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    // Register state
    const [name, setName] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [regConfirm, setRegConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    // Shared
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);


    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/catalogue";

    // Unified Login/Registration Logic (Frictionless)
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                email: loginEmail,
                password: loginPassword,
                redirect: false,
                callbackUrl,
            });

            if (res?.error) {
                if (res.error === "EMAIL_NOT_VERIFIED") {
                    setError("Votre email n'est pas encore vérifié.");
                } else {
                    setError("Identifiants invalides. Veuillez réessayer.");
                }
            } else {
                const { getSession } = await import("next-auth/react");
                const session = await getSession();
                const onboardingCompleted = session?.user?.onboardingCompleted;
                if (onboardingCompleted === false) {
                    router.push("/onboarding");
                } else {
                    router.push(callbackUrl);
                }
                router.refresh();
            }
        } catch {
            setError("Une erreur inattendue est survenue.");
        } finally {
            setLoading(false);
        }
    };

    // --- Register submit ---
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (regPassword !== regConfirm) {
            setError("Les mots de passe ne correspondent pas.");
            setLoading(false);
            return;
        }
        if (regPassword.length < 8) {
            setError("Le mot de passe doit contenir au moins 8 caractères.");
            setLoading(false);
            return;
        }

        try {
            await registerUser({ name, email: regEmail, password: regPassword });
            setSuccess("Votre compte a été créé avec succès ! Connectez-vous maintenant.");
            setTab("login");
            setRegEmail("");
            setRegPassword("");
            setRegConfirm("");
            setName("");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Erreur inconnue";
            console.error("DEBUG: Registration failed with:", message);
            if (message === "EMAIL_ALREADY_EXISTS") {
                setError("Cet email est déjà utilisé. Essayez de vous connecter.");
            } else {
                setError(`Erreur : ${message}`);
            }
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6">
            {/* Header */}
            <div className="text-center space-y-3">
                <div className="inline-flex p-4 bg-indigo-600 rounded-2xl text-white mb-2 shadow-lg shadow-indigo-200">
                    <GraduationCap className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                    <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 uppercase">
                        Plateforme CRYPTE
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                        Académie de Souveraineté Numérique
                    </p>
                </div>
            </div>

            {/* Tab Toggle */}
            <div className="flex bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-1 gap-1">
                <button
                    onClick={() => { setTab("login"); setError(""); setSuccess(""); }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab === "login"
                        ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                        : "text-zinc-400 hover:text-zinc-600"}`}
                >
                    Connexion
                </button>
                <button
                    onClick={() => { setTab("register"); setError(""); setSuccess(""); }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab === "register"
                        ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                        : "text-zinc-400 hover:text-zinc-600"}`}
                >
                    Inscription
                </button>
            </div>


            {/* Feedback messages */}
            {error && (
                <div className="p-4 text-sm font-medium text-red-600 bg-red-50 rounded-2xl border border-red-100">
                    {error}
                </div>
            )}
            {success && (
                <div className="p-4 text-sm font-medium text-green-600 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0" /> {success}
                </div>
            )}

            {/* LOGIN FORM */}
            {tab === "login" && (
                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                                type="email"
                                required
                                placeholder="votre@email.com"
                                className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Mot de passe</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm shadow-lg shadow-indigo-200"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Se connecter"}
                    </button>

                    <p className="text-center text-xs text-zinc-400 font-medium">
                        Pas encore de compte ?{" "}
                        <button type="button" onClick={() => setTab("register")} className="text-indigo-600 font-bold hover:underline">
                            Créer mon compte
                        </button>
                    </p>
                </form>
            )}

            {/* REGISTRATION FORM */}
            {tab === "register" && (
                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Nom Complet *</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                                type="text"
                                required
                                placeholder="Jean-Paul Kabila"
                                className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email *</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                                type="email"
                                required
                                placeholder="votre@email.com"
                                className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                                value={regEmail}
                                onChange={(e) => setRegEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Mot de passe *</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="Min. 8 caractères"
                                className="w-full pl-12 pr-12 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                                value={regPassword}
                                onChange={(e) => setRegPassword(e.target.value)}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Confirmer le mot de passe *</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                                value={regConfirm}
                                onChange={(e) => setRegConfirm(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm shadow-lg shadow-indigo-200"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Créer mon compte"}
                    </button>

                    <p className="text-center text-xs text-zinc-400 font-medium">
                        Déjà inscrit ?{" "}
                        <button type="button" onClick={() => setTab("login")} className="text-indigo-600 font-bold hover:underline">
                            Me connecter
                        </button>
                    </p>
                </form>
            )}
        </div>
    );
}

export default function SignInPage() {
    return (
        <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-zinc-950">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/hero-graduation.png"
                    alt="Background"
                    fill
                    className="object-cover opacity-70 select-none"
                    priority
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            </div>

            <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-700">
                <Suspense fallback={
                    <div className="flex items-center justify-center p-12">
                        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
                    </div>
                }>
                    <AuthForm />
                </Suspense>

                <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                    © {new Date().getFullYear()} CRYPTE E-learning • PHILOSOPHE KASONGO
                </p>
            </div>
        </div>
    );
}
