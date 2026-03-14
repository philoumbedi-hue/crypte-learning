"use client";

import { useEditor, EditorContent, JSONContent, Content } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { TextAlign } from "@tiptap/extension-text-align";
import { Placeholder } from "@tiptap/extension-placeholder";
import EditorToolbar from "./EditorToolbar";
import { useState, useCallback } from "react";

interface AntigravityEditorProps {
    initialContent: Content;
    onSave: (content: JSONContent) => Promise<void>;
    title?: string;
    backUrl?: string;
}

export default function AntigravityEditor({ initialContent, onSave, title, backUrl }: AntigravityEditorProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-blue-600 underline cursor-pointer",
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: "rounded-lg border border-zinc-200 my-8 max-w-full h-auto shadow-sm mx-auto block",
                },
            }),
            Table.configure({
                resizable: true,
                allowTableNodeSelection: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Placeholder.configure({
                placeholder: "Commencez à rédiger la doctrine souveraine...",
            }),
        ],
        content: initialContent,
        editorProps: {
            attributes: {
                class: "prose prose-zinc max-w-none focus:outline-none min-h-[1050px] text-zinc-900 leading-relaxed",
            },
        },
    });

    const handleSave = useCallback(async () => {
        if (!editor || isSaving) return;
        setIsSaving(true);
        try {
            await onSave(editor.getJSON());
        } finally {
            setIsSaving(false);
            setShowConfirm(false);
        }
    }, [editor, isSaving, onSave]);

    // Trigger to open the confirmation modal (called from toolbar)
    const requestSave = useCallback(() => {
        if (!editor || isSaving) return;
        setShowConfirm(true);
    }, [editor, isSaving]);

    return (
        <div className="flex flex-col h-full bg-[#0a0a0a] relative">
            <EditorToolbar editor={editor} onSave={requestSave} isSaving={isSaving} title={title} backUrl={backUrl} />

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-zinc-950 border border-white/10 rounded-3xl p-10 max-w-md w-full mx-4 shadow-[0_40px_80px_rgba(0,0,0,0.8)] space-y-6">
                        <div className="text-center space-y-3">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
                                <span className="text-2xl">💾</span>
                            </div>
                            <h2 className="text-xl font-black uppercase tracking-tighter text-white">Confirmer la sauvegarde</h2>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                Voulez-vous sauvegarder cette doctrine ? Les modifications seront visibles immédiatement par les étudiants.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 py-3 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:border-white/30 transition-all text-sm font-bold uppercase tracking-tight"
                            >
                                Non, annuler
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex-1 py-3 rounded-xl bg-white text-black font-black hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-tight disabled:opacity-50"
                            >
                                {isSaving ? "Sauvegarde..." : "Oui, sauvegarder"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 bg-zinc-950/40 custom-scrollbar">
                {/* A4 Document Container */}
                <div className="mx-auto bg-white text-black min-h-[1123px] w-full max-w-[816px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-sm p-12 md:p-20 lg:p-24 animate-in fade-in slide-in-from-bottom-4 duration-700 relative overflow-hidden ring-1 ring-white/10">
                    {/* Subtle margins markers/guides can be added here if needed */}
                    <div className="relative z-10">
                        <EditorContent editor={editor} />
                    </div>
                </div>
            </div>

            {/* Styles for Tiptap Tables & Scrollbar */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                .ProseMirror table {
                    border-collapse: collapse;
                    table-layout: fixed;
                    width: 100%;
                    margin: 2rem 0;
                    overflow: hidden;
                }
                .ProseMirror td, .ProseMirror th {
                    min-width: 1em;
                    border: 1px solid #e2e8f0;
                    padding: 12px 16px;
                    vertical-align: top;
                    box-sizing: border-box;
                    position: relative;
                }
                .ProseMirror th {
                    font-weight: bold;
                    text-align: left;
                    background-color: #f8fafc;
                }
                .ProseMirror .selectedCell:after {
                    z-index: 2;
                    content: "";
                    position: absolute;
                    left: 0; right: 0; top: 0; bottom: 0;
                    background: rgba(0, 0, 0, 0.05);
                    pointer-events: none;
                }
                .ProseMirror .column-resize-handle {
                    position: absolute;
                    right: -2px;
                    top: 0;
                    bottom: 0;
                    width: 4px;
                    background-color: #3b82f6;
                    pointer-events: none;
                }
                .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #94a3b8;
                    pointer-events: none;
                    height: 0;
                }
                
                /* Typography Overrides for A4 feel */
                .prose h1 { font-weight: 800; font-size: 2.25rem; margin-bottom: 2rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.5rem; }
                .prose h2 { font-weight: 700; font-size: 1.5rem; margin-top: 2rem; }
                .prose h3 { font-weight: 600; font-size: 1.25rem; }
                .prose p { margin-top: 1.25rem; margin-bottom: 1.25rem; }
                .prose blockquote { border-left-color: #e2e8f0; font-style: italic; color: #64748b; }
            `}</style>
        </div>
    );
}
