"use client";

import { useEffect, useRef, useCallback } from "react";
import { saveVideoProgress } from "@/actions/progress";

interface VideoPlayerProps {
    videoId: string;        // Database ID
    videoUrl: string;       // Source URL
    initialTimestamp?: number;
}

/**
 * Robust YouTube ID extraction
 */
function extractYouTubeId(url: string): string {
    if (!url) return "";
    if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim();

    const patterns = [
        /[?&]v=([a-zA-Z0-9_-]{11})/,
        /youtu\.be\/([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) return match[1];
    }
    return "";
}

/**
 * Vimeo ID extraction
 */
function extractVimeoId(url: string): string {
    const match = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/);
    return match ? match[1] : "";
}

/**
 * Detect source type
 */
function getSourceType(url: string) {
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
    if (url.includes("vimeo.com")) return "vimeo";
    if (url.match(/\.(mp4|webm|ogg|mov|m4v)($|\?)/i) || url.includes("supabase.co/storage")) return "direct";
    return "iframe";
}

export default function VideoPlayer({ videoId, videoUrl, initialTimestamp = 0 }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const saveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const currentTimeRef = useRef<number>(initialTimestamp);
    const durationRef = useRef<number>(0);
    const isPlayingRef = useRef(false);

    const sourceType = getSourceType(videoUrl);

    // Auto-save logic
    const startAutoSave = useCallback(() => {
        if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
        saveIntervalRef.current = setInterval(() => {
            if (isPlayingRef.current) {
                const completed = durationRef.current > 0 && currentTimeRef.current / durationRef.current > 0.95;
                saveVideoProgress(videoId, Math.floor(currentTimeRef.current), completed);
            }
        }, 8000);
    }, [videoId]);

    const stopAutoSave = useCallback(() => {
        if (saveIntervalRef.current) {
            clearInterval(saveIntervalRef.current);
            saveIntervalRef.current = null;
        }
    }, []);

    useEffect(() => {
        return () => stopAutoSave();
    }, [stopAutoSave]);

    // --- HTML5 DIRECT PLAYER LOGIC ---
    const handleTimeUpdate = () => {
        if (videoRef.current) {
            currentTimeRef.current = videoRef.current.currentTime;
            durationRef.current = videoRef.current.duration;
        }
    };

    const handlePlay = useCallback(() => {
        isPlayingRef.current = true;
        startAutoSave();
    }, [startAutoSave]);

    const handlePause = useCallback(() => {
        isPlayingRef.current = false;
        stopAutoSave();
        if (videoRef.current) {
            const completed = videoRef.current.duration > 0 && videoRef.current.currentTime / videoRef.current.duration > 0.95;
            saveVideoProgress(videoId, Math.floor(videoRef.current.currentTime), completed);
        }
    }, [videoId, stopAutoSave]);

    // Initialize HTML5 video start time
    useEffect(() => {
        if (sourceType === "direct" && videoRef.current && initialTimestamp > 0) {
            videoRef.current.currentTime = initialTimestamp;
        }
    }, [sourceType, initialTimestamp]);

    // --- IFRAME (YouTube/Vimeo) MESSAGE LISTENER ---
    useEffect(() => {
        if (sourceType === "direct") return;

        const handleMessage = (event: MessageEvent) => {
            // YouTube integration
            if (event.origin.includes("youtube.com")) {
                try {
                    const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
                    if (data?.info?.currentTime !== undefined) currentTimeRef.current = data.info.currentTime;
                    if (data?.info?.duration !== undefined) durationRef.current = data.info.duration;

                    if (data?.info?.playerState === 1) {
                        isPlayingRef.current = true;
                        startAutoSave();
                    } else if (data?.info?.playerState === 2 || data?.info?.playerState === 0) {
                        isPlayingRef.current = false;
                        stopAutoSave();
                        const completed = data.info.playerState === 0 || (durationRef.current > 0 && currentTimeRef.current / durationRef.current > 0.95);
                        saveVideoProgress(videoId, Math.floor(currentTimeRef.current), completed);
                    }
                } catch { /* ignore */ }
            }

            // Vimeo integration (simple logic)
            if (event.origin.includes("vimeo.com")) {
                try {
                    const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
                    if (data.event === "play") handlePlay();
                    if (data.event === "pause") handlePause();
                    if (data.event === "finish") {
                        saveVideoProgress(videoId, Math.floor(currentTimeRef.current), true);
                        stopAutoSave();
                    }
                } catch { /* ignore */ }
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [videoId, sourceType, startAutoSave, stopAutoSave, handlePlay, handlePause]);

    // RENDER LOGIC
    if (sourceType === "youtube") {
        const ytId = extractYouTubeId(videoUrl);
        const startParam = Math.floor(initialTimestamp) > 0 ? `&start=${Math.floor(initialTimestamp)}` : "";

        // Configuration native et robuste :
        // On repasse sur youtube.com (mieux pour les sessions existantes diminuant les CAPTCHA)
        // On retire 'origin' qui peut poser problème en local/pooler
        const embedUrl = `https://www.youtube.com/embed/${ytId}?enablejsapi=1&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1${startParam}`;

        return (
            <div className="relative w-full rounded-2xl overflow-hidden bg-black shadow-2xl" style={{ aspectRatio: "16/9" }}>
                <iframe
                    src={embedUrl}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                    referrerPolicy="strict-origin-when-cross-origin"
                />
            </div>
        );
    }

    if (sourceType === "vimeo") {
        const vimeoId = extractVimeoId(videoUrl);
        const embedUrl = `https://player.vimeo.com/video/${vimeoId}?api=1&autoplay=0`;

        return (
            <div className="relative w-full rounded-2xl overflow-hidden bg-black shadow-2xl" style={{ aspectRatio: "16/9" }}>
                <iframe
                    src={embedUrl}
                    title="Vimeo video player"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                />
            </div>
        );
    }

    if (sourceType === "direct") {
        return (
            <div className="relative w-full rounded-2xl overflow-hidden bg-black shadow-2xl" style={{ aspectRatio: "16/9" }}>
                <video
                    ref={videoRef}
                    src={videoUrl}
                    controls
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => saveVideoProgress(videoId, Math.floor(currentTimeRef.current), true)}
                    className="absolute inset-0 w-full h-full object-contain"
                />
            </div>
        );
    }

    // Fallback: Generic Iframe
    return (
        <div className="relative w-full rounded-2xl overflow-hidden bg-black shadow-2xl" style={{ aspectRatio: "16/9" }}>
            <iframe
                src={videoUrl}
                title="External content"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-none"
            />
        </div>
    );
}
