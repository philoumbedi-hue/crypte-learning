

export default function CatalogueLoading() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black animate-in fade-in duration-500">
            {/* Header Mirror */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
                <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-8 h-8 animate-pulse" />
                        <div className="h-5 w-20 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                    </div>
                </div>
            </header>

            <div className="max-w-[1600px] mx-auto px-6 py-8">
                {/* Hero Skeleton */}
                <div className="h-64 mb-12 rounded-[3rem] bg-zinc-200 dark:bg-zinc-900 animate-pulse" />

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Skeleton */}
                    <aside className="w-full lg:w-[260px] space-y-6">
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    </aside>

                    {/* Main Content Skeleton */}
                    <main className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden animate-pulse">
                                    <div className="aspect-video bg-zinc-100 dark:bg-zinc-800" />
                                    <div className="p-10 space-y-4">
                                        <div className="h-3 w-20 bg-zinc-100 dark:bg-zinc-800 rounded" />
                                        <div className="h-6 w-full bg-zinc-100 dark:bg-zinc-800 rounded" />
                                        <div className="h-4 w-3/4 bg-zinc-100 dark:bg-zinc-800 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
