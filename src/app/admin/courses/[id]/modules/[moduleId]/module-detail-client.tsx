"use client";

import { useState } from "react";
import { Plus, Trash2, FileEdit, Settings, VideoIcon, FileText, HelpCircle, ArrowLeft } from "lucide-react";
import { createVideo, deleteVideo, updateVideo } from "@/actions/video";
import { createQuiz, deleteQuiz, createQuestion, deleteQuestion } from "@/actions/quiz";
import { createDocument, deleteDocument } from "@/actions/document";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface Video {
    id: string;
    title: string;
    url: string;
    order: number;
    description: string | null;
    duration: number | null;
    type: string | null;
}

interface Document {
    id: string;
    title: string;
    url: string;
}

interface Quiz {
    id: string;
    title: string;
    questions: { id: string, text: string, options: string[], correctAnswer: string }[];
}

interface ModuleData {
    id: string;
    title: string;
    order: number;
    videos: Video[];
    documents: Document[];
    quizzes: Quiz[];
}

interface Course {
    id: string;
    title: string;
}

export default function ModuleDetailClient({ course, moduleData }: { course: Course, moduleData: ModuleData }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form states for new content
    const [newVideoTitle, setNewVideoTitle] = useState("");
    const [newVideoUrl, setNewVideoUrl] = useState("");
    const [newVideoDesc, setNewVideoDesc] = useState("");
    const [newVideoDuration, setNewVideoDuration] = useState("");
    const [newVideoType, setNewVideoType] = useState("Lecture");

    // Document form states
    const [newDocTitle, setNewDocTitle] = useState("");
    const [newDocUrl, setNewDocUrl] = useState("");
    const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
    const [uploadingDoc, setUploadingDoc] = useState(false);

    const [newQuizTitle, setNewQuizTitle] = useState("");
    const [newQuizDesc, setNewQuizDesc] = useState("");
    const [newQuizPassing, setNewQuizPassing] = useState("70");
    const [newQuizAttempts, setNewQuizAttempts] = useState("3");

    // Question form states
    const [activeQuizForQuestion, setActiveQuizForQuestion] = useState<string | null>(null);
    const [newQuestionText, setNewQuestionText] = useState("");
    const [newQuestionOptions, setNewQuestionOptions] = useState(["", "", "", ""]);
    const [newQuestionCorrect, setNewQuestionCorrect] = useState("");

    // Video editing states
    const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
    const [editingVideoTitle, setEditingVideoTitle] = useState("");
    const [editingVideoUrl, setEditingVideoUrl] = useState("");
    const [editingVideoDesc, setEditingVideoDesc] = useState("");
    const [editingVideoDuration, setEditingVideoDuration] = useState("");
    const [editingVideoType, setEditingVideoType] = useState("Lecture");

    const handleAddVideo = async () => {
        if (!newVideoTitle || !newVideoUrl) return;
        setLoading(true);
        try {
            await createVideo({
                title: newVideoTitle,
                url: newVideoUrl,
                description: newVideoDesc,
                duration: parseInt(newVideoDuration) || 0,
                type: newVideoType,
                moduleId: moduleData.id
            });
            setNewVideoTitle("");
            setNewVideoUrl("");
            setNewVideoDesc("");
            setNewVideoDuration("");
            toast.success("Vidéo ajoutée");
            router.refresh();
        } catch {
            alert("Erreur lors de l'ajout de la vidéo");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateVideo = async (id: string) => {
        if (!editingVideoTitle || !editingVideoUrl) return;
        setLoading(true);
        try {
            await updateVideo(id, {
                title: editingVideoTitle,
                url: editingVideoUrl,
                description: editingVideoDesc,
                duration: parseInt(editingVideoDuration) || 0,
                type: editingVideoType
            });
            setEditingVideoId(null);
            toast.success("Vidéo mise à jour");
            router.refresh();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Erreur inconnue";
            alert(`Erreur lors de la mise à jour: ${message}`);
        } finally {
            setLoading(false);
        }
    };

    const startEditingVideo = (vid: Video) => {
        setEditingVideoId(vid.id);
        setEditingVideoTitle(vid.title);
        setEditingVideoUrl(vid.url);
        setEditingVideoDesc(vid.description || "");
        setEditingVideoDuration(vid.duration?.toString() || "");
        setEditingVideoType(vid.type || "Lecture");
    };

    const handleAddDocument = async () => {
        if (!newDocTitle) return;
        if (!newDocUrl && !selectedPdf) return;

        setUploadingDoc(true);
        try {
            let finalUrl = newDocUrl;

            if (selectedPdf) {
                const formData = new FormData();
                formData.append("file", selectedPdf);

                const uploadRes = await fetch("/api/admin/upload", {
                    method: "POST",
                    body: formData
                });

                if (!uploadRes.ok) throw new Error("Échec de l'upload du fichier");

                const data = await uploadRes.json();
                finalUrl = data.url;
            }

            await createDocument({
                title: newDocTitle,
                url: finalUrl,
                moduleId: moduleData.id
            });

            setNewDocTitle("");
            setNewDocUrl("");
            setSelectedPdf(null);
            toast.success("Document ajouté avec succès");
            router.refresh();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Erreur";
            alert(`Erreur: ${message}`);
        } finally {
            setUploadingDoc(false);
        }
    };

    const handleDeleteDocument = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer ce document ?")) return;
        try {
            await deleteDocument(id);
            toast.success("Document supprimé");
            router.refresh();
        } catch {
            alert("Erreur lors de la suppression du document");
        }
    };

    const handleAddQuiz = async () => {
        if (!newQuizTitle) return;
        setLoading(true);
        try {
            await createQuiz({
                title: newQuizTitle,
                description: newQuizDesc,
                passingScore: parseInt(newQuizPassing) || 70,
                maxAttempts: parseInt(newQuizAttempts) || 3,
                moduleId: moduleData.id
            });
            setNewQuizTitle("");
            setNewQuizDesc("");
            router.refresh();
            toast.success("Quiz ajouté");
        } catch {
            alert("Erreur lors de l'ajout du quiz");
        } finally {
            setLoading(false);
        }
    };

    const handleAddQuestion = async (quizId: string) => {
        if (!newQuestionText || !newQuestionCorrect || newQuestionOptions.some(o => !o)) return;
        setLoading(true);
        try {
            await createQuestion({
                text: newQuestionText,
                options: newQuestionOptions,
                correctAnswer: newQuestionCorrect,
                quizId
            });
            setNewQuestionText("");
            setNewQuestionOptions(["", "", "", ""]);
            setNewQuestionCorrect("");
            setActiveQuizForQuestion(null);
            router.refresh();
            toast.success("Question ajoutée");
        } catch {
            alert("Erreur lors de l'ajout de la question");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteVideo = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer cette vidéo ?")) return;
        try {
            await deleteVideo(id);
            toast.success("Vidéo supprimée");
            router.refresh();
        } catch {
            alert("Erreur lors de la suppression de la vidéo");
        }
    };

    const handleDeleteQuiz = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer ce quiz ?")) return;
        try {
            await deleteQuiz(id);
            toast.success("Quiz supprimé");
            router.refresh();
        } catch {
            alert("Erreur lors de la suppression du quiz");
        }
    };

    const handleDeleteQuestion = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer cette question ?")) return;
        try {
            await deleteQuestion(id);
            toast.success("Question supprimée");
            router.refresh();
        } catch {
            alert("Erreur lors de la suppression de la question");
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-12">
            <div>
                <Link
                    href={`/admin/courses/${course.id}`}
                    className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" /> Retour au Cours ({course.title})
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-[0.4em] text-zinc-500 mb-2">Structure du Module</h2>
                        <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Chapitre {moduleData.order}: {moduleData.title}</h1>
                    </div>
                </div>
            </div>

            <div className="space-y-12">
                {/* VIDEOS SECTION */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <VideoIcon className="w-6 h-6 text-indigo-500" />
                        <h2 className="text-xl font-black uppercase tracking-tight">Leçons Vidéo</h2>
                    </div>

                    <div className="bg-white dark:bg-zinc-950 rounded-[2rem] p-6 border border-zinc-200 dark:border-zinc-800 space-y-8 shadow-sm">
                        <div className="space-y-3">
                            {moduleData.videos.map((vid: Video) => (
                                <div key={vid.id} className="space-y-2">
                                    <div className="flex justify-between items-center p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-xs font-bold text-zinc-500">
                                                {vid.order}
                                            </div>
                                            <span className="text-sm font-bold tracking-tight">{vid.title}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => startEditingVideo(vid)}
                                                className="p-2 text-zinc-400 hover:text-white transition-colors rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-700"
                                                title="Modifier les infos"
                                            >
                                                <Settings className="w-4 h-4" />
                                            </button>
                                            <Link
                                                href={`/admin/courses/${course.id}/modules/${moduleData.id}/lessons/${vid.id}/edit`}
                                                className="p-2 text-zinc-400 hover:text-blue-500 transition-colors rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-900/30"
                                                title="Éditer la doctrine (Word)"
                                            >
                                                <FileEdit className="w-4 h-4" />
                                            </Link>
                                            <button onClick={() => handleDeleteVideo(vid.id)} className="p-2 text-zinc-400 hover:text-red-500 transition-colors rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-red-900/30">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {editingVideoId === vid.id && (
                                        <div className="p-4 bg-zinc-100 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3">Modification de la Leçon</div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                                <input type="text" placeholder="Titre leçon" className="text-xs p-2 rounded border dark:bg-zinc-800 dark:border-zinc-700" value={editingVideoTitle} onChange={e => setEditingVideoTitle(e.target.value)} />
                                                <input type="text" placeholder="URL YouTube / Vimeo" className="text-xs p-2 rounded border dark:bg-zinc-800 dark:border-zinc-700" value={editingVideoUrl} onChange={e => setEditingVideoUrl(e.target.value)} />
                                            </div>
                                            <div className="flex flex-wrap gap-3 mb-3">
                                                <input type="text" placeholder="Description" className="flex-1 text-xs p-2 rounded border dark:bg-zinc-800 dark:border-zinc-700" value={editingVideoDesc} onChange={e => setEditingVideoDesc(e.target.value)} />
                                                <input type="text" placeholder="Durée en min" className="w-24 text-xs p-2 rounded border dark:bg-zinc-800 dark:border-zinc-700" value={editingVideoDuration} onChange={e => setEditingVideoDuration(e.target.value)} />
                                                <input type="text" placeholder="Type" className="w-32 text-xs p-2 rounded border dark:bg-zinc-800 dark:border-zinc-700" value={editingVideoType} onChange={e => setEditingVideoType(e.target.value)} />
                                            </div>
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => setEditingVideoId(null)} className="text-[10px] font-bold uppercase py-2 px-4 rounded-lg bg-zinc-200 dark:bg-zinc-800 hover:opacity-80 transition">Annuler</button>
                                                <button onClick={() => handleUpdateVideo(vid.id)} className="text-[10px] font-bold uppercase py-2 px-4 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:opacity-80 transition">Enregistrer</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {moduleData.videos.length === 0 && (
                                <p className="text-zinc-500 text-sm italic py-4">Aucune leçon vidéo définie.</p>
                            )}
                        </div>

                        <div className="space-y-4 p-6 bg-zinc-50 dark:bg-zinc-900/30 rounded-2xl border border-zinc-100 dark:border-zinc-800 mt-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                                <Plus className="w-3 h-3" /> Ajouter une Vidéo
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input type="text" placeholder="Titre de la vidéo" className="text-xs p-3 rounded-xl border dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 outline-none" value={newVideoTitle} onChange={e => setNewVideoTitle(e.target.value)} />
                                <input type="text" placeholder="URL vidéo (YouTube)" className="text-xs p-3 rounded-xl border dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 outline-none" value={newVideoUrl} onChange={e => setNewVideoUrl(e.target.value)} />
                            </div>
                            <textarea
                                placeholder="Description pédagogique..."
                                className="w-full text-xs p-3 rounded-xl border dark:bg-zinc-900 min-h-[80px] focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={newVideoDesc}
                                onChange={e => setNewVideoDesc(e.target.value)}
                            />
                            <div className="grid grid-cols-3 gap-3">
                                <input type="number" placeholder="Durée (sec)" className="text-xs p-3 rounded-xl border dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 outline-none" value={newVideoDuration} onChange={e => setNewVideoDuration(e.target.value)} />
                                <select
                                    className="text-xs p-3 rounded-xl border dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={newVideoType}
                                    onChange={e => setNewVideoType(e.target.value)}
                                >
                                    <option value="Lecture">Cours Magistral</option>
                                    <option value="Demo">Démonstration</option>
                                    <option value="Case Study">Étude de Cas</option>
                                </select>
                                <button onClick={handleAddVideo} disabled={loading} className="bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl text-xs font-bold transition-opacity hover:opacity-90 disabled:opacity-50">
                                    Ajouter
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* DOCUMENTS SECTION */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <FileText className="w-6 h-6 text-red-500" />
                        <h2 className="text-xl font-black uppercase tracking-tight">Documents Annexes</h2>
                    </div>

                    <div className="bg-white dark:bg-zinc-950 rounded-[2rem] p-6 border border-zinc-200 dark:border-zinc-800 space-y-8 shadow-sm">
                        <div className="space-y-3">
                            {moduleData.documents.map((doc: Document) => (
                                <div key={doc.id} className="flex justify-between items-center p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                    <div className="flex items-center gap-3">
                                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold tracking-tight hover:underline hover:text-indigo-600">
                                            {doc.title}
                                        </a>
                                    </div>
                                    <button onClick={() => handleDeleteDocument(doc.id)} className="p-2 text-zinc-400 hover:text-red-500 transition-colors rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-red-900/30">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {moduleData.documents.length === 0 && (
                                <p className="text-zinc-500 text-sm italic py-4">Aucun document annexé.</p>
                            )}
                        </div>

                        <div className="space-y-4 p-6 bg-zinc-50 dark:bg-zinc-900/30 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                                <Plus className="w-3 h-3" /> Associer un Document
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Titre du document (ex: Support PDF)"
                                    className="text-xs p-3 rounded-xl border dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={newDocTitle}
                                    onChange={e => setNewDocTitle(e.target.value)}
                                />
                                <div className="flex flex-col gap-2">
                                    <input
                                        type="url"
                                        placeholder="Lien web externe (URL) OU..."
                                        className="text-xs p-3 rounded-xl border dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={newDocUrl}
                                        onChange={e => setNewDocUrl(e.target.value)}
                                        disabled={!!selectedPdf}
                                    />
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => setSelectedPdf(e.target.files?.[0] || null)}
                                            disabled={!!newDocUrl}
                                        />
                                        <div className={`text-xs p-3 rounded-xl border text-center font-medium transition-colors ${selectedPdf ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white dark:bg-zinc-900 text-zinc-500 dark:border-zinc-800 hover:border-indigo-300'}`}>
                                            {selectedPdf ? selectedPdf.name : "...Sélectionner un fichier local"}
                                        </div>
                                    </div>
                                    {selectedPdf && (
                                        <button onClick={() => setSelectedPdf(null)} className="text-[10px] text-red-500 hover:underline text-right mt-1">
                                            Annuler le fichier
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end pt-2">
                                <button
                                    onClick={handleAddDocument}
                                    disabled={uploadingDoc || !newDocTitle || (!newDocUrl && !selectedPdf)}
                                    className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl text-xs font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
                                >
                                    {uploadingDoc ? "Upload..." : "Enregistrer le Document"}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* QUIZZES SECTION */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <HelpCircle className="w-6 h-6 text-green-500" />
                        <h2 className="text-xl font-black uppercase tracking-tight">Quiz & Évaluations</h2>
                    </div>

                    <div className="bg-white dark:bg-zinc-950 rounded-[2rem] p-6 border border-zinc-200 dark:border-zinc-800 space-y-8 shadow-sm">
                        <div className="space-y-6">
                            {moduleData.quizzes.map((quiz: Quiz) => (
                                <div key={quiz.id} className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 shadow-sm">
                                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                                        <span className="font-bold text-lg">{quiz.title}</span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setActiveQuizForQuestion(activeQuizForQuestion === quiz.id ? null : quiz.id)}
                                                className="text-xs px-4 py-2 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 font-bold rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors flex items-center gap-1"
                                            >
                                                <Plus className="w-3 h-3" /> Question
                                            </button>
                                            <button onClick={() => handleDeleteQuiz(quiz.id)} className="p-2 bg-white dark:bg-zinc-900 text-zinc-400 hover:text-red-500 shadow-sm rounded-lg transition-colors border border-zinc-200 dark:border-zinc-700">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Questions List */}
                                    <div className="pr-4 border-zinc-200 dark:border-zinc-800 space-y-4 mb-6">
                                        {quiz.questions?.map((q) => (
                                            <div key={q.id} className="text-sm bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                                <div className="flex justify-between items-start group mb-3">
                                                    <p className="font-bold">{q.text}</p>
                                                    <button onClick={() => handleDeleteQuestion(q.id)} className="text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {q.options?.map((opt: string, i: number) => (
                                                        <span key={i} className={`text-xs px-3 py-1.5 rounded-lg border ${opt === q.correctAnswer ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400 font-bold" : "bg-zinc-50 border-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:border-zinc-700"}`}>
                                                            {opt}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                        {quiz.questions?.length === 0 && (
                                            <p className="text-xs text-zinc-400 italic">Ce quiz n&apos;a pas encore de questions.</p>
                                        )}
                                    </div>

                                    {/* Add Question Form */}
                                    {activeQuizForQuestion === quiz.id && (
                                        <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl space-y-4 border border-zinc-200 dark:border-zinc-700 shadow-inner mt-4">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Nouvelle Question</div>
                                            <input
                                                type="text"
                                                placeholder="L'intitulé de la question..."
                                                className="w-full text-xs p-3 rounded-lg border dark:bg-zinc-950 focus:ring-2 focus:ring-indigo-500 outline-none"
                                                value={newQuestionText}
                                                onChange={e => setNewQuestionText(e.target.value)}
                                            />
                                            <div className="grid grid-cols-2 gap-3">
                                                {newQuestionOptions.map((opt, i) => (
                                                    <input
                                                        key={i}
                                                        type="text"
                                                        placeholder={`Option ${i + 1}`}
                                                        className="text-xs p-3 rounded-lg border dark:bg-zinc-950 focus:ring-1 focus:ring-zinc-400 outline-none"
                                                        value={opt}
                                                        onChange={e => {
                                                            const next = [...newQuestionOptions];
                                                            next[i] = e.target.value;
                                                            setNewQuestionOptions(next);
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="La bonne réponse (doit être exactement l'une des 4 options ci-dessus)"
                                                className="w-full text-xs p-3 rounded-lg border-2 border-green-100 dark:border-green-900/50 dark:bg-zinc-950 focus:border-green-400 outline-none"
                                                value={newQuestionCorrect}
                                                onChange={e => setNewQuestionCorrect(e.target.value)}
                                            />
                                            <div className="flex justify-end pt-2">
                                                <button
                                                    onClick={() => handleAddQuestion(quiz.id)}
                                                    disabled={loading}
                                                    className="bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-lg text-xs font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
                                                >
                                                    {loading ? "..." : "Valider la Question"}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {moduleData.quizzes.length === 0 && (
                                <p className="text-zinc-500 text-sm italic py-4">Aucun quiz d&apos;évaluation créé pour ce module.</p>
                            )}
                        </div>

                        <div className="space-y-4 p-6 bg-zinc-50 dark:bg-zinc-900/30 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                <Plus className="w-3 h-3" /> Créer un Examen / Quiz
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input type="text" placeholder="Titre du quiz" className="text-xs p-3 rounded-xl border dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 outline-none" value={newQuizTitle} onChange={e => setNewQuizTitle(e.target.value)} />
                                <input type="number" placeholder="Seuil de réussite (%)" className="text-xs p-3 rounded-xl border dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 outline-none" value={newQuizPassing} onChange={e => setNewQuizPassing(e.target.value)} />
                            </div>
                            <textarea
                                placeholder="Instructions / Description..."
                                className="w-full text-xs p-3 rounded-xl border dark:bg-zinc-900 min-h-[60px] focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={newQuizDesc}
                                onChange={e => setNewQuizDesc(e.target.value)}
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <input type="number" placeholder="Tentatives max" className="text-xs p-3 rounded-xl border dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 outline-none" value={newQuizAttempts} onChange={e => setNewQuizAttempts(e.target.value)} />
                                <button onClick={handleAddQuiz} disabled={loading} className="bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl text-xs font-bold transition-opacity hover:opacity-90 disabled:opacity-50">
                                    Créer le Quiz
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
