"use client";

import { useEffect, useState } from "react";
import { Radio, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface LiveSession {
    id: string;
    title: string;
    course: {
        title: string;
    };
}

export function LivePromotion() {
    const [liveSession, setLiveSession] = useState<LiveSession | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLive = async () => {
            try {
                const response = await fetch("/api/live/current", { cache: "no-store" });
                const data = await response.json();
                if (data.session) {
                    setLiveSession(data.session);
                }
            } catch (err) {
                console.error("Failed to fetch live promotion", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLive();
    }, []);

    if (loading || !liveSession) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto px-6 mb-16"
            >
                <div className="relative overflow-hidden rounded-[3rem] bg-zinc-900 border border-zinc-800 p-1 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.15),transparent)]">
                    <div className="flex flex-col lg:flex-row items-center gap-10 p-8 md:p-12 relative z-10">
                        {/* Status + Icon */}
                        <div className="flex-shrink-0 relative">
                            <div className="w-24 h-24 bg-red-600/10 rounded-3xl flex items-center justify-center border border-red-600/20">
                                <Radio className="w-10 h-10 text-red-500 animate-pulse" />
                            </div>
                            <div className="absolute -top-2 -right-2 px-3 py-1 bg-red-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-xl">
                                Live
                            </div>
                        </div>

                        {/* Title & Desc */}
                        <div className="flex-grow text-center lg:text-left space-y-4">
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">
                                Session en cours : {liveSession.course.title}
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
                                {liveSession.title}
                            </h3>
                            <p className="text-zinc-400 text-sm font-medium italic opacity-80">
                                Join the elite circle of knowledge in real-time.
                            </p>
                        </div>

                        {/* Action */}
                        <Link
                            href={`/live/${liveSession.id}`}
                            className="bg-white text-zinc-900 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/5 group"
                        >
                            Rejoindre la visio <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
