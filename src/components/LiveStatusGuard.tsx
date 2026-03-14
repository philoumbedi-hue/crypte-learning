"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface LiveStatusGuardProps {
    sessionId: string;
    redirectUrl?: string;
    onFinished?: () => void;
}

export default function LiveStatusGuard({
    sessionId,
    redirectUrl,
    onFinished
}: LiveStatusGuardProps) {
    const router = useRouter();

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const response = await fetch(`/api/live/status/${sessionId}`, { cache: "no-store" });
                const data = await response.json();

                if (data.status === "FINISHED") {
                    if (onFinished) {
                        onFinished();
                    } else if (redirectUrl) {
                        router.push(redirectUrl);
                    }
                }
            } catch (error) {
                console.error("Failed to check live session status", error);
            }
        };

        // Check every 5 seconds
        const interval = setInterval(checkStatus, 5000);
        return () => clearInterval(interval);
    }, [sessionId, redirectUrl, onFinished, router]);

    return null; // This component is invisible
}
