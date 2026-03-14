"use client";

import { useState } from "react";
import JitsiMeetComponent from "./JitsiMeetComponent";
import { Maximize2, Minimize2, VideoOff, CheckCircle, Loader2 } from "lucide-react";
import LiveStatusGuard from "./LiveStatusGuard";
import { updateLiveSessionStatus } from "@/actions/live-session";

interface LiveMeetingOverlayProps {
    sessionId: string;
    roomName: string;
    userName: string;
    userEmail: string;
    isAdmin: boolean;
    courseTitle: string;
    sessionTitle: string;
    onClose: () => void;
}

export default function LiveMeetingOverlay({
    sessionId,
    roomName,
    userName,
    userEmail,
    isAdmin,
    courseTitle,
    sessionTitle,
    onClose
}: LiveMeetingOverlayProps) {
    const [isFullContent, setIsFullContent] = useState(true);
    const [isEnding, setIsEnding] = useState(false);

    const handleEndSession = async () => {
        if (!confirm("Voulez-vous vraiment terminer cette session magistrale ? Cela la marquera comme terminée pour tous les étudiants.")) {
            return;
        }

        setIsEnding(true);
        try {
            await updateLiveSessionStatus(sessionId, "FINISHED");
            onClose();
        } catch (error) {
            console.error("Failed to end session", error);
            alert("Erreur lors de la fermeture de la session.");
            setIsEnding(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
            {/* Live Guard for automatic closure if session ends */}
            <LiveStatusGuard sessionId={sessionId} onFinished={onClose} />

            {/* Header Bar */}
            <header className="bg-zinc-950 border-b border-white/10 p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{courseTitle}</span>
                        </div>
                        <h2 className="text-sm font-bold text-white uppercase tracking-tight">{sessionTitle}</h2>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <button
                        onClick={() => setIsFullContent(!isFullContent)}
                        className="p-2 text-zinc-400 hover:text-white transition-colors rounded-xl bg-white/5"
                        title={isFullContent ? "Réduire" : "Agrandir"}
                    >
                        {isFullContent ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>

                    {isAdmin ? (
                        <button
                            onClick={handleEndSession}
                            disabled={isEnding}
                            className="flex items-center gap-2 px-4 md:px-6 py-2 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
                        >
                            {isEnding ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <CheckCircle className="w-4 h-4" />
                            )}
                            <span className="hidden md:inline">Terminer le live</span>
                            <span className="md:hidden">Terminer</span>
                        </button>
                    ) : (
                        <button
                            onClick={onClose}
                            className="flex items-center gap-2 px-4 md:px-6 py-2 bg-zinc-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-700 transition-all"
                        >
                            <VideoOff className="w-4 h-4" />
                            <span className="hidden md:inline">Quitter</span>
                        </button>
                    )}
                </div>
            </header>

            {/* Meeting Container */}
            <main className={`flex-1 relative bg-black transition-all duration-500 ${isFullContent ? 'p-0' : 'p-8 md:p-12 lg:p-20'}`}>
                <div className="w-full h-full rounded-none md:rounded-[2rem] overflow-hidden shadow-2xl border border-white/5">
                    <JitsiMeetComponent
                        roomName={roomName}
                        userName={userName}
                        userEmail={userEmail}
                        isAdmin={isAdmin}
                    />
                </div>
            </main>

            {/* Subtle Brand Info */}
            {!isFullContent && (
                <footer className="p-6 bg-zinc-950 text-center">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">
                        CRYPTE • ACADÉMIE • SESSION SÉCURISÉE
                    </div>
                </footer>
            )}
        </div>
    );
}
