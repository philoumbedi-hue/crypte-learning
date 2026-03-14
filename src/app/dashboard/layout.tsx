import Link from "next/link";

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-8 flex items-center justify-between sticky top-0 z-10">
                <div className="font-bold text-xl">CRYPTE</div>
                <nav className="flex items-center gap-6">
                    <Link href="/dashboard" className="font-medium">Dashboard</Link>
                    <Link href="/courses" className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white">Mes Cours</Link>
                    <Link href="/" className="text-sm text-zinc-500 hover:underline">Accueil</Link>
                </nav>
            </header>
            <main className="max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    );
}
