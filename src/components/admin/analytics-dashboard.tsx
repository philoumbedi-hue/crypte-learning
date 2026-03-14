"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, Award, TrendingUp, BookOpen, Clock, FileText, CreditCard, UserPlus, Radio, Shield } from "lucide-react";
import Link from "next/link";

interface AnalyticsDashboardProps {
    stats: {
        totalStudents: number;
        totalCourses: number;
        certificatesIssued: number;
        totalRevenue: number;
        pendingApplications: number;
        liveNow: number;
        totalTeachers: number;
        recentEnrollments: {
            id: string;
            student: { name: string | null; email: string };
            course: { title: string };
            createdAt: Date | string;
        }[];
        chartData: {
            name: string;
            completions: number;
            inscriptions: number;
        }[];
    };
    userRole: string;
}

export default function AnalyticsDashboard({ stats, userRole }: AnalyticsDashboardProps) {

    return (
        <div className="space-y-8 animate-in fade-in duration-1000">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black mb-2 tracking-tight">Tableau de Bord Stratégique</h1>
                    <p className="text-zinc-500 font-medium tracking-tight">Vue d&apos;ensemble en temps réel des performances de CRYPTE.</p>
                </div>

                {stats.liveNow > 0 && (
                    <div className="flex items-center gap-3 px-4 py-2 bg-red-500/10 text-red-600 rounded-2xl border border-red-200 animate-pulse">
                        <Radio className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-widest">{stats.liveNow} Session{stats.liveNow > 1 ? 's' : ''} en direct</span>
                    </div>
                )}
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-bl-full transition-transform group-hover:scale-110" />
                    <div className="flex items-center gap-3 mb-4 relative z-10">
                        <div className="p-2 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400 rounded-xl">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-bold text-zinc-600 dark:text-zinc-400 tracking-tight">Cours</h3>
                    </div>
                    <div className="flex items-end gap-2 relative z-10">
                        <span className="text-3xl font-black">{stats.totalCourses}</span>
                        <span className="text-xs font-bold text-zinc-400 mb-1">Actifs</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-bl-full transition-transform group-hover:scale-110" />
                    <div className="flex items-center gap-3 mb-4 relative z-10">
                        <div className="p-2 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 rounded-xl">
                            <Users className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-bold text-zinc-600 dark:text-zinc-400 tracking-tight">Étudiants</h3>
                    </div>
                    <div className="flex items-end gap-2 relative z-10">
                        <span className="text-3xl font-black">{stats.totalStudents}</span>
                        <span className="text-xs font-bold text-emerald-500 mb-1 flex items-center gap-0.5"><TrendingUp className="w-3 h-3" /> Académie</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 dark:bg-amber-500/10 rounded-bl-full transition-transform group-hover:scale-110" />
                    <div className="flex items-center gap-3 mb-4 relative z-10">
                        <div className="p-2 bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400 rounded-xl">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-bold text-zinc-600 dark:text-zinc-400 tracking-tight">Revenus</h3>
                    </div>
                    <div className="flex items-end gap-2 relative z-10">
                        <span className="text-3xl font-black">{stats.totalRevenue.toLocaleString()} $</span>
                        <span className="text-xs font-bold text-zinc-400 mb-1">Total</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 dark:bg-red-500/10 rounded-bl-full transition-transform group-hover:scale-110" />
                    <div className="flex items-center gap-3 mb-4 relative z-10">
                        <div className="p-2 bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 rounded-xl">
                            <UserPlus className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-bold text-zinc-600 dark:text-zinc-400 tracking-tight">Candidatures</h3>
                    </div>
                    <div className="flex items-end gap-2 relative z-10">
                        <span className="text-3xl font-black">{stats.pendingApplications}</span>
                        <span className="text-xs font-bold text-red-500 mb-1">A traiter</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
                    <h3 className="text-lg font-bold mb-6 tracking-tight flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-500" /> Progression & Complétions
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.2} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', backgroundColor: 'var(--tooltip-bg, #fff)' }}
                                    itemStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
                                />
                                <Bar dataKey="completions" fill="#4f46e5" radius={[6, 6, 6, 6]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
                    <h3 className="text-lg font-bold mb-6 tracking-tight flex items-center gap-2">
                        <Users className="w-5 h-5 text-emerald-500" /> Nouvelles Inscriptions
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.2} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', backgroundColor: 'var(--tooltip-bg, #fff)' }}
                                    itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                                />
                                <Line type="monotone" dataKey="inscriptions" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Transactions & Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
                    <h3 className="text-lg font-bold mb-6 tracking-tight flex items-center gap-2">
                        <Clock className="w-5 h-5 text-zinc-500" /> Inscriptions Récentes
                    </h3>
                    <div className="space-y-4">
                        {stats.recentEnrollments.length === 0 ? (
                            <div className="text-center py-8 text-zinc-500">Aucune inscription récente.</div>
                        ) : (
                            stats.recentEnrollments.map((enr) => (
                                <div key={enr.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 flex items-center justify-center font-bold">
                                            {enr.student.name?.[0]?.toUpperCase() || "U"}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm tracking-tight">{enr.student.name || enr.student.email}</p>
                                            <p className="text-xs text-zinc-500">{enr.course.title}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-indigo-600 dark:text-indigo-400 text-[10px] uppercase tracking-widest">Inscrit</p>
                                        <p className="text-[10px] text-zinc-500">{new Date(enr.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-bold mb-4 tracking-tight px-2">Actions Rapides</h3>

                    {["SUPER_ADMIN", "ADMIN", "ADMIN_ACADEMIC"].includes(userRole) && (
                        <Link href="/admin/applications" className="flex items-center justify-between p-4 bg-indigo-600/5 border border-indigo-600/20 rounded-2xl hover:bg-indigo-600/10 transition group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-600 text-white rounded-xl">
                                    <UserPlus className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-sm">Gestion Candidatures ({stats.pendingApplications})</span>
                            </div>
                        </Link>
                    )}

                    {["SUPER_ADMIN", "ADMIN", "ADMIN_STUDENT"].includes(userRole) && (
                        <Link href="/admin/users" className="flex items-center justify-between p-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-black dark:hover:border-white transition group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition">
                                    <Shield className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-sm">Gérer les Comptes</span>
                            </div>
                        </Link>
                    )}

                    <Link href="/admin/courses" className="flex items-center justify-between p-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-black dark:hover:border-white transition group">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition">
                                <FileText className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-sm">Gestion des Cours</span>
                        </div>
                    </Link>

                    <Link href="/admin/live-sessions" className="flex items-center justify-between p-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-black dark:hover:border-white transition group">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition">
                                <Radio className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-sm">Visioconférences</span>
                        </div>
                    </Link>
                </div>
            </div>

            <style jsx global>{`
                :root { --tooltip-bg: #ffffff; }
                @media (prefers-color-scheme: dark) {
                    :root { --tooltip-bg: #09090b; }
                }
            `}</style>
        </div>
    );
}
