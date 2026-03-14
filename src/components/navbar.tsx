"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { GraduationCap, User, Menu, X, LogOut, Shield } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { hasRequiredRole, Role } from "@/lib/rbac-shared";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import NotificationDropdown from "@/components/notification-dropdown";

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Hide navbar on specialized layouts where it's redundant or covering content
    const isSpecializedRoute = pathname?.includes("/learn") || pathname?.startsWith("/admin");

    useEffect(() => {
        if (isSpecializedRoute) return;
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isSpecializedRoute]);

    const [isLiveActive, setIsLiveActive] = useState(false);

    useEffect(() => {
        // Fetch if any live session is active
        const checkLiveStatus = async () => {
            try {
                const response = await fetch("/api/live/status", { cache: "no-store" });
                const data = await response.json();
                setIsLiveActive(data.isLive);
            } catch (err) {
                console.error("Failed to check live status", err);
            }
        };
        checkLiveStatus();
        const interval = setInterval(checkLiveStatus, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    if (isSpecializedRoute) return null;

    const navLinks = [
        { name: "Accueil", href: "/" },
        {
            name: "Catalogue",
            href: session ? "/catalogue" : "/auth/signin"
        },
        {
            name: "DIRECT",
            href: "/live",
            isLive: true
        },
        { name: "Facultés", href: "/#faculties" },
    ].filter(link => !link.isLive || isLiveActive);

    return (
        <nav
            className={clsx(
                "fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out flex items-center justify-between px-8 py-3 rounded-2xl border w-[95%] md:w-auto md:min-w-[700px]",
                isScrolled
                    ? "bg-white/80 backdrop-blur-2xl border-slate-200 shadow-2xl shadow-indigo-100/50"
                    : "bg-white/40 backdrop-blur-md border-white/20 shadow-sm"
            )}
        >
            {/* Brand */}
            <Link href="/" className="flex items-center gap-3 group">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-100 group-hover:scale-110 transition-all duration-300">
                    <GraduationCap className="w-6 h-6" />
                </div>
                <span className="text-sm font-black uppercase tracking-[0.3em] text-slate-900 hidden sm:block">
                    Crypte
                </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={clsx(
                            "text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-2",
                            link.isLive ? "text-red-500 hover:text-red-600" : "text-slate-500 hover:text-indigo-600"
                        )}
                    >
                        {link.name}
                        {link.isLive && isLiveActive && (
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                        )}
                    </Link>
                ))}

                {/* Admin Link */}
                {session?.user?.role && hasRequiredRole(session.user.role as Role, "TEACHER") && (
                    <Link
                        href="/admin"
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 hover:text-indigo-600 transition-colors border-l border-slate-200 pl-8 ml-2"
                    >
                        <Shield className="w-4 h-4" />
                        Admin
                    </Link>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                {session ? (
                    <div className="flex items-center gap-3">
                        <NotificationDropdown />
                        <Link
                            href="/profile"
                            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
                        >
                            <User className="w-4 h-4" />
                            Profil
                        </Link>
                        <Link
                            href="/dashboard"
                            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                        >
                            Espace
                        </Link>
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all shadow-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            Déconnexion
                        </button>
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="sm:hidden p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Link
                            href="/auth/signin"
                            className="px-8 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                        >
                            Connexion
                        </Link>
                    </div>
                )}

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-slate-600 hover:text-indigo-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full mt-4 left-0 right-0 bg-white shadow-2xl rounded-[2rem] border border-slate-100 py-8 px-8 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex flex-col gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-sm font-black uppercase tracking-[0.2em] text-slate-600 hover:text-indigo-600 transition-colors border-b border-slate-50 pb-4"
                            >
                                {link.name}
                            </Link>
                        ))}

                        {session ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-4 text-sm font-black uppercase tracking-[0.2em] text-slate-600"
                                >
                                    <User className="w-5 h-5" /> Espace Étudiant
                                </Link>
                                <button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="flex items-center gap-4 text-sm font-black uppercase tracking-[0.2em] text-red-500 pt-4 border-t border-slate-50"
                                >
                                    <LogOut className="w-5 h-5" /> Déconnexion
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/auth/signin"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-8 py-4 bg-indigo-600 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl text-center shadow-lg shadow-indigo-100"
                                >
                                    Connexion
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
