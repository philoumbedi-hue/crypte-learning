"use client";

import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";

interface Discipline {
    id: string;
    name: string;
    _count: { courses: number };
}

interface DisciplineSelectProps {
    disciplines: Discipline[];
    activeDisciplineId: string | null;
}

export default function DisciplineSelect({ disciplines, activeDisciplineId }: DisciplineSelectProps) {
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        if (id) {
            router.push(`/catalogue?discipline=${id}`);
        }
    };

    return (
        <div className="relative w-full">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                <BookOpen className="w-4 h-4 text-zinc-400" />
            </div>
            <select
                value={activeDisciplineId || ""}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 text-sm font-bold appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-sm hover:border-zinc-400 dark:hover:border-zinc-500"
            >
                <option value="" disabled>Choisir un domaine...</option>
                {disciplines.map((d) => (
                    <option key={d.id} value={d.id}>
                        {d.name} ({d._count.courses} cours)
                    </option>
                ))}
            </select>
            {/* Custom chevron */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-zinc-400">
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </div>
        </div>
    );
}
