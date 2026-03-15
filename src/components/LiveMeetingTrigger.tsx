"use client";

import { useState } from "react";
import { Video } from "lucide-react";
import LiveMeetingOverlay from "./LiveMeetingOverlay";

interface LiveMeetingTriggerProps {
    sessionId: string;
    roomName: string;
    userName: string;
    userEmail: string;
    isAdmin: boolean;
    courseTitle: string;
    sessionTitle: string;
    buttonClassName?: string;
    buttonLabel?: string;
}

import { useRouter } from "next/navigation";

export default function LiveMeetingTrigger({
    sessionId,
    buttonClassName = "w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest text-[10px] transition-all bg-red-600 text-white hover:bg-red-700 shadow-lg",
    buttonLabel: explicitLabel,
    isAdmin
}: LiveMeetingTriggerProps) {
    const router = useRouter();
    const buttonLabel = explicitLabel || (isAdmin ? "Lancer la visio" : "Rejoindre la visio");

    return (
        <button
            onClick={() => router.push(`/live/${sessionId}`)}
            className={buttonClassName}
        >
            <Video className="w-3.5 h-3.5" />
            {buttonLabel}
        </button>
    );
}
