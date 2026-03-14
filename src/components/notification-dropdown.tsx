"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, BookOpen, MessageSquare, Award, Info } from "lucide-react";
import { getNotifications, markAsRead, markAllAsRead } from "@/actions/notifications";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    link: string | null;
    createdAt: Date;
}

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    const fetchNotifications = async () => {
        try {
            const data = await getNotifications();
            setNotifications(data);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();

        // Polling every 60 seconds
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Close on navigation
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMarkAsRead = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();

        // Optimistic update
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );

        await markAsRead(id);
    };

    const handleMarkAllAsRead = async (e: React.MouseEvent) => {
        e.preventDefault();

        // Optimistic update
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

        await markAllAsRead();
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const getIcon = (type: string) => {
        switch (type) {
            case "COURSE": return <BookOpen className="w-4 h-4 text-blue-500" />;
            case "FORUM": return <MessageSquare className="w-4 h-4 text-amber-500" />;
            case "CERTIFICATE": return <Award className="w-4 h-4 text-indigo-500" />;
            default: return <Info className="w-4 h-4 text-zinc-500" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-black" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
                        <h3 className="font-black tracking-tight">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition flex items-center gap-1"
                            >
                                <Check className="w-3.5 h-3.5" /> Tout marquer
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {isLoading ? (
                            <div className="p-8 text-center text-sm text-zinc-500 font-medium animate-pulse">
                                Chargement...
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center text-sm text-zinc-500 flex flex-col items-center">
                                <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-3">
                                    <Bell className="w-5 h-5 text-zinc-300" />
                                </div>
                                Aucune notification pour le moment.
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                {notifications.map((notif) => {
                                    const content = (
                                        <>
                                            <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center border ${!notif.isRead ? 'border-indigo-200 dark:border-indigo-800/50 bg-white dark:bg-zinc-950 shadow-sm' : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900'}`}>
                                                {getIcon(notif.type)}
                                            </div>
                                            <div className="flex-1 pr-6">
                                                <p className={`text-sm ${!notif.isRead ? 'font-black text-black dark:text-white' : 'font-bold text-zinc-700 dark:text-zinc-300'}`}>
                                                    {notif.title}
                                                </p>
                                                <p className="text-xs text-zinc-500 mt-1 leading-relaxed line-clamp-2">
                                                    {notif.message}
                                                </p>
                                                <p className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase mt-2">
                                                    {new Date(notif.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            {!notif.isRead && (
                                                <button
                                                    onClick={(e) => handleMarkAsRead(e, notif.id)}
                                                    className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-black dark:hover:text-white transition group"
                                                    title="Marquer comme lu"
                                                >
                                                    <Check className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
                                                    <div className="w-2 h-2 bg-indigo-500 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:opacity-0 transition" />
                                                </button>
                                            )}
                                        </>
                                    );

                                    const className = `relative p-4 flex gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition border-b border-zinc-100 dark:border-zinc-800 last:border-0 ${!notif.isRead ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : ''}`;

                                    const handleClick = () => {
                                        if (!notif.isRead) markAsRead(notif.id);
                                        if (!notif.link) setIsOpen(false);
                                    };

                                    if (notif.link) {
                                        return (
                                            <Link
                                                key={notif.id}
                                                href={notif.link}
                                                className={className}
                                                onClick={handleClick}
                                            >
                                                {content}
                                            </Link>
                                        );
                                    }

                                    return (
                                        <div
                                            key={notif.id}
                                            className={className}
                                            onClick={handleClick}
                                        >
                                            {content}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
