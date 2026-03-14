"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export default function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const initialQuery = searchParams.get("q") || "";
    const [query, setQuery] = useState(initialQuery);

    // Simple debounce logic if lib/hooks/use-debounce doesn't exist
    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (query) {
                params.set("q", query);
            } else {
                params.delete("q");
            }

            startTransition(() => {
                router.push(`/catalogue?${params.toString()}`);
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [query, router, searchParams]);

    return (
        <div className="relative w-full max-w-md group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <Search className={`w-5 h-5 transition-colors duration-300 ${query ? "text-indigo-500" : "text-slate-400 group-hover:text-slate-600"}`} />
            </div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un programme..."
                className="w-full pl-16 pr-14 py-5 bg-white border-2 border-slate-100 rounded-[2rem] text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm hover:shadow-md"
            />
            {query && (
                <button
                    onClick={() => setQuery("")}
                    className="absolute inset-y-0 right-6 flex items-center text-slate-400 hover:text-slate-900 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            )}
            {isPending && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-indigo-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 animate-[loading_1.5s_infinite_linear]" />
                </div>
            )}

            <style jsx>{`
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
            `}</style>
        </div>
    );
}
