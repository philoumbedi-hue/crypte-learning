"use client";

import { useRef } from "react";
import Link from "next/link";
import { Editor } from "@tiptap/react";
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Heading1,
    Heading2,
    List,
    ListOrdered,
    Quote,
    Terminal,
    Minus,
    Image as ImageIcon,
    Link as LinkIcon,
    Table as TableIcon,
    Columns,
    Rows,
    Trash2,
    AlignCenter,
    AlignLeft,
    AlignRight,
    AlignJustify,
    Undo,
    Redo,
    Save,
    Upload,
    ChevronLeft
} from "lucide-react";

interface EditorToolbarProps {
    editor: Editor | null;
    onSave: () => void;
    isSaving: boolean;
    title?: string;
    backUrl?: string;
}



export default function EditorToolbar({ editor, onSave, isSaving, title, backUrl }: EditorToolbarProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    if (!editor) return null;

    const addImage = () => {
        const url = window.prompt("Entrez l'URL de l'image (Souveraineté Numérique)");
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Erreur d'upload");

            const data = await res.json();
            editor.chain().focus().setImage({ src: data.url }).run();
        } catch (error) {
            alert("Erreur lors de l'upload de l'image");
            console.error(error);
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const setLink = () => {
        const url = window.prompt("Entrez l'URL du lien");
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const btnClass = (active: boolean) =>
        `p-2 rounded-lg transition-all duration-200 ${active
            ? "bg-white text-black shadow-lg scale-105"
            : "text-zinc-400 hover:text-white hover:bg-white/10 hover:scale-105"
        }`;

    const ToolGroup = ({ children, label }: { children: React.ReactNode; label: string }) => (
        <div className="flex flex-col items-center gap-1.5 px-3 border-r border-white/5 last:border-r-0">
            <div className="flex items-center gap-1">
                {children}
            </div>
            <span className="text-[9px] font-bold uppercase tracking-tighter text-zinc-600 block">{label}</span>
        </div>
    );

    return (
        <div className="sticky top-0 z-[110] w-full bg-zinc-950/90 backdrop-blur-2xl border-b border-white/10 flex flex-col shadow-2xl">
            {/* Title Bar */}
            <div className="px-6 py-2 border-b border-white/5 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-3">
                    {backUrl && (
                        <Link
                            href={backUrl}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-all text-[10px] font-bold uppercase tracking-wide"
                        >
                            <ChevronLeft size={14} />
                            Retour
                        </Link>
                    )}
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Doctrine en cours de rédaction</span>
                    <span className="text-zinc-700 mx-2">|</span>
                    <h2 className="text-sm font-bold truncate max-w-[400px] text-white uppercase tracking-tight">{title || "Document sans titre"}</h2>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-zinc-600 uppercase">Crypte Authoring System v2.0</span>
                </div>
            </div>

            <div className="p-3 flex items-center justify-between gap-6">
                <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 no-scrollbar">

                    {/* 🅰 Font & Text */}
                    <ToolGroup label="Police">
                        <button
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={btnClass(editor.isActive("bold"))}
                            title="Gras"
                        >
                            <Bold size={16} />
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={btnClass(editor.isActive("italic"))}
                            title="Italique"
                        >
                            <Italic size={16} />
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            className={btnClass(editor.isActive("underline"))}
                            title="Souligné"
                        >
                            <Underline size={16} />
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            className={btnClass(editor.isActive("strike"))}
                            title="Barré"
                        >
                            <Strikethrough size={16} />
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            className={btnClass(editor.isActive("heading", { level: 1 }))}
                            title="Titre 1"
                        >
                            <Heading1 size={16} />
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            className={btnClass(editor.isActive("heading", { level: 2 }))}
                            title="Titre 2"
                        >
                            <Heading2 size={16} />
                        </button>
                    </ToolGroup>

                    {/* 📐 Structure */}
                    <ToolGroup label="Structure">
                        <button
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            className={btnClass(editor.isActive("bulletList"))}
                            title="Liste à puces"
                        >
                            <List size={16} />
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            className={btnClass(editor.isActive("orderedList"))}
                            title="Liste numérotée"
                        >
                            <ListOrdered size={16} />
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                            className={btnClass(editor.isActive("blockquote"))}
                            title="Citation"
                        >
                            <Quote size={16} />
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                            className={btnClass(editor.isActive("codeBlock"))}
                            title="Bloc de code"
                        >
                            <Terminal size={16} />
                        </button>
                        <button
                            onClick={() => editor.chain().focus().setHorizontalRule().run()}
                            className={btnClass(false)}
                            title="Ligne horizontale"
                        >
                            <Minus size={16} />
                        </button>
                    </ToolGroup>

                    {/* 📍 Alignment */}
                    <ToolGroup label="Alignement">
                        <button
                            onClick={() => editor.chain().focus().setTextAlign("left").run()}
                            className={btnClass(editor.isActive({ textAlign: "left" }))}
                            title="Aligner à gauche"
                        >
                            <AlignLeft size={16} />
                        </button>
                        <button
                            onClick={() => editor.chain().focus().setTextAlign("center").run()}
                            className={btnClass(editor.isActive({ textAlign: "center" }))}
                            title="Centrer"
                        >
                            <AlignCenter size={16} />
                        </button>
                        <button
                            onClick={() => editor.chain().focus().setTextAlign("right").run()}
                            className={btnClass(editor.isActive({ textAlign: "right" }))}
                            title="Aligner à droite"
                        >
                            <AlignRight size={16} />
                        </button>
                        <button
                            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                            className={btnClass(editor.isActive({ textAlign: "justify" }))}
                            title="Justifier"
                        >
                            <AlignJustify size={16} />
                        </button>
                    </ToolGroup>

                    {/* 📊 Insert */}
                    <ToolGroup label="Insertion">
                        <button onClick={addImage} className={btnClass(false)} title="Image via URL">
                            <ImageIcon size={16} />
                        </button>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className={btnClass(false)}
                            title="Uploader une image locale"
                        >
                            <Upload size={16} />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleUpload}
                        />
                        <button onClick={setLink} className={btnClass(editor.isActive("link"))} title="Lien hypertexte">
                            <LinkIcon size={16} />
                        </button>
                        <button
                            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                            className={btnClass(editor.isActive("table"))}
                            title="Tableau"
                        >
                            <TableIcon size={16} />
                        </button>
                    </ToolGroup>

                    {/* 🗄️ Table Controls (Conditional) */}
                    {editor.isActive("table") && (
                        <ToolGroup label="Tableau+">
                            <button onClick={() => editor.chain().focus().addColumnAfter().run()} className={btnClass(false)} title="Ajouter Colonne">
                                <Columns size={14} className="rotate-90" />
                            </button>
                            <button onClick={() => editor.chain().focus().addRowAfter().run()} className={btnClass(false)} title="Ajouter Ligne">
                                <Rows size={14} />
                            </button>
                            <button onClick={() => editor.chain().focus().deleteColumn().run()} className={btnClass(false)} title="Supprimer Colonne">
                                <div className="relative"><Columns size={14} className="rotate-90" /><span className="absolute -top-1 -right-1 text-[8px] text-red-500 font-bold">x</span></div>
                            </button>
                            <button onClick={() => editor.chain().focus().deleteRow().run()} className={btnClass(false)} title="Supprimer Ligne">
                                <div className="relative"><Rows size={14} /><span className="absolute -top-1 -right-1 text-[8px] text-red-500 font-bold">x</span></div>
                            </button>
                            <button onClick={() => editor.chain().focus().deleteTable().run()} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all" title="Supprimer Tableau">
                                <Trash2 size={14} />
                            </button>
                        </ToolGroup>
                    )}

                    {/* 🔄 History */}
                    <ToolGroup label="Historique">
                        <button
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={!editor.can().undo()}
                            className="p-2 text-zinc-400 hover:text-white disabled:opacity-20 transition-all"
                            title="Annuler"
                        >
                            <Undo size={16} />
                        </button>
                        <button
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={!editor.can().redo()}
                            className="p-2 text-zinc-400 hover:text-white disabled:opacity-20 transition-all"
                            title="Rétablir"
                        >
                            <Redo size={16} />
                        </button>
                    </ToolGroup>
                </div>

                {/* Save Button */}
                <button
                    onClick={onSave}
                    disabled={isSaving}
                    className="flex items-center gap-3 px-8 py-3 bg-white text-black font-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50 group shrink-0"
                >
                    {isSaving ? (
                        <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : (
                        <Save size={18} className="group-hover:rotate-12 transition-transform" />
                    )}
                    <span className="hidden lg:inline uppercase tracking-tighter text-xs">Sauvegarder la Doctrine</span>
                </button>
            </div>
        </div>
    );
}
