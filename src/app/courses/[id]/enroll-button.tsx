"use client";

import { useState } from "react";
import { enrollInCourse } from "@/actions/enrollment";
import { CheckCircle, Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EnrollmentButton({ courseId, isEnrolled, isLoggedIn }: { courseId: string, isEnrolled: boolean, isLoggedIn: boolean, courseTitle?: string, userId?: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const handleEnrollClick = async () => {
        if (!isLoggedIn) {
            router.push("/auth/signin");
            return;
        }

        setLoading(true);
        try {
            await enrollInCourse(courseId);
            router.refresh();
        } catch (error) {
            alert(error instanceof Error ? error.message : "Erreur lors de l'inscription");
        } finally {
            setLoading(false);
        }
    };

    if (isEnrolled) {
        return (
            <button
                disabled
                className="flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white rounded-xl font-bold border-b-4 border-green-700 w-full"
            >
                <CheckCircle className="w-5 h-5" /> Déjà inscrit
            </button>
        );
    }

    return (
        <button
            onClick={handleEnrollClick}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-xl font-black uppercase tracking-widest border-b-4 border-indigo-950 w-full hover:translate-y-[-2px] active:translate-y-[2px] transition-all disabled:opacity-50 shadow-xl shadow-indigo-900/20"
        >
            {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <ShieldCheck className="w-5 h-5" />
            )}
            {isLoggedIn ? "S'inscrire au cours" : "Se connecter pour s'inscrire"}
        </button>
    );
}
