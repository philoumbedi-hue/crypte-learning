"use client";

import { useState } from "react";
import Image from "next/image";
import { MessageSquare, Send, Stars, User, Star } from "lucide-react";
import { postReview } from "@/actions/review";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

export interface ReviewUser {
    name: string | null;
    image: string | null;
    role: string;
}

export interface Review {
    id: string;
    content: string;
    rating: number | null;
    createdAt: Date;
    user: ReviewUser;
}

export default function ReviewSection({ courseId, initialReviews }: { courseId: string, initialReviews: Review[] }) {
    const { data: session } = useSession();
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const [content, setContent] = useState("");
    const [rating, setRating] = useState<number>(5);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const result = await postReview(courseId, content, rating);
            const newReview: Review = {
                id: result.id,
                content: result.content,
                rating: result.rating,
                createdAt: result.createdAt,
                user: {
                    name: session?.user?.name || "Étudiant",
                    image: session?.user?.image || null,
                    role: session?.user?.role || "STUDENT"
                }
            };
            setReviews([newReview, ...reviews]);
            setContent("");
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la publication du commentaire");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="mt-20 pt-16 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-4 mb-10">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                    <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-3xl font-black tracking-tight uppercase">Espace de Commentaire</h2>
                    <p className="text-zinc-500">Partagez votre expérience sur ce programme avec la communauté.</p>
                </div>
            </div>

            {session ? (
                <form onSubmit={handleSubmit} className="mb-16 bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Note globale :</span>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="transition-transform hover:scale-125 focus:outline-none"
                                >
                                    <Star
                                        className={cn(
                                            "w-6 h-6",
                                            star <= rating ? "fill-amber-400 text-amber-400" : "text-zinc-300 dark:text-zinc-700"
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <textarea
                            placeholder="Qu'avez-vous pensé de ce cours ? Vos retours nous aident à nous améliorer..."
                            className="w-full min-h-[150px] p-6 bg-zinc-50 dark:bg-black border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-sm transition-all"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting || !content.trim()}
                            className="absolute bottom-4 right-4 flex items-center gap-3 px-8 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition disabled:opacity-50 shadow-lg shadow-indigo-500/20"
                        >
                            <Send className="w-4 h-4" /> Publier mon avis
                        </button>
                    </div>
                </form>
            ) : (
                <div className="mb-16 p-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center">
                    <p className="text-zinc-500 font-medium">Connectez-vous pour laisser votre avis sur cette formation.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {reviews.length === 0 ? (
                    <div className="md:col-span-2 py-20 text-center">
                        <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900/50 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-300">
                            <Stars className="w-10 h-10" />
                        </div>
                        <p className="text-zinc-400 font-medium">Aucun avis pour le moment. Soyez le premier !</p>
                    </div>
                ) : (
                    reviews.map((rev) => (
                        <div key={rev.id} className="bg-white dark:bg-zinc-900/50 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 flex flex-col gap-4 shadow-sm group hover:border-indigo-500/30 transition-all">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-200 dark:border-zinc-700">
                                        {rev.user.image ? (
                                            <Image src={rev.user.image} alt={rev.user.name || ""} width={48} height={48} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-6 h-6 text-zinc-400" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-black text-sm tracking-tight">{rev.user.name || "Étudiant Anonyme"}</div>
                                        <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{new Date(rev.createdAt).toLocaleDateString('fr-FR')}</div>
                                    </div>
                                </div>
                                {rev.rating && (
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={cn(
                                                    "w-3.5 h-3.5",
                                                    i < rev.rating! ? "fill-amber-400 text-amber-400" : "text-zinc-200 dark:text-zinc-800"
                                                )}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
                                &quot;{rev.content}&quot;
                            </p>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
