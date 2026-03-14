"use client";

import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { updateLiveSessionStatus } from "@/actions/live-session";
import { useRouter } from "next/navigation";

interface EndLiveButtonProps {
    sessionId: string;
}

export default function EndLiveButton({ sessionId }: EndLiveButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleEndSession = async () => {
        if (!confirm("Voulez-vous vraiment terminer cette session magistrale ? Cela la marquera comme terminée pour tous les étudiants.")) {
            return;
        }

        setLoading(true);
        try {
            await updateLiveSessionStatus(sessionId, "FINISHED");
            router.push("/dashboard");
        } catch (error) {
            console.error("Failed to end session", error);
            alert("Erreur lors de la fermeture de la session.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleEndSession}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <CheckCircle className="w-4 h-4" />
            )}
            Terminer la Session
        </button>
    );
}
