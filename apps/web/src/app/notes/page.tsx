'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, Calendar, FileText, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase';

interface NoteItem {
    id: string;
    title: string;
    content: string;
    lastModified: number;
    user_id?: string;
    // Map DB fields if needed
    updated_at?: string;
}

export default function NotesPage() {
    const [notes, setNotes] = useState<NoteItem[]>([]);
    const [activeNote, setActiveNote] = useState<NoteItem | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Initial Load
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const supabase = createClient();
                const session = supabase ? (await supabase.auth.getSession()).data.session : null;

                if (session && supabase) {
                    setIsLoggedIn(true);
                    const { data: serverNotes, error } = await supabase
                        .from('notes')
                        .select('*')
                        .eq('user_id', session.user.id)
                        .order('updated_at', { ascending: false });

                    if (error) throw error;

                    if (serverNotes) {
                        const formatted: NoteItem[] = serverNotes.map((n: any) => ({
                            id: n.id,
                            title: n.title || '',
                            content: n.content || '',
                            lastModified: new Date(n.updated_at).getTime(),
                            user_id: n.user_id,
                            updated_at: n.updated_at
                        }));
                        setNotes(formatted);
                        if (formatted.length > 0) setActiveNote(formatted[0]);
                        else {
                            // Create new note for cloud
                            const newNote: NoteItem = {
                                id: '',
                                title: 'Untitled Note',
                                content: '',
                                lastModified: Date.now()
                            };
                            setNotes([newNote]);
                            setActiveNote(newNote);
                        }
                    }
                } else {
                    const saved = localStorage.getItem('my-notes');
                    if (saved) {
                        const parsed = JSON.parse(saved);
                        setNotes(parsed);
                        if (parsed.length > 0) setActiveNote(parsed[0]);
                        else {
                            // Create new note locally
                            const newNote: NoteItem = {
                                id: Date.now().toString(),
                                title: 'Untitled Note',
                                content: '',
                                lastModified: Date.now()
                            };
                            setNotes([newNote]);
                            setActiveNote(newNote);
                        }
                    } else {
                        // Create new note locally
                        const newNote: NoteItem = {
                            id: Date.now().toString(),
                            title: 'Untitled Note',
                            content: '',
                            lastModified: Date.now()
                        };
                        setNotes([newNote]);
                        setActiveNote(newNote);
                    }
                }
            } catch (error) {
                console.error("Failed to load notes", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    // Save Local Storage on Change (Backup/Guest)
    useEffect(() => {
        if (!isLoggedIn) {
            localStorage.setItem('my-notes', JSON.stringify(notes));
        }
    }, [notes, isLoggedIn]);

    const createNewNote = (loggedIn: boolean = isLoggedIn) => {
        const newNote: NoteItem = {
            id: loggedIn ? '' : Date.now().toString(),
            title: 'Untitled Note',
            content: '',
            lastModified: Date.now()
        };

        setNotes(prev => [newNote, ...prev]);
        setActiveNote(newNote);
    };

    const updateActiveNote = async (updates: Partial<NoteItem>) => {
        if (!activeNote) return;

        const updated = { ...activeNote, ...updates, lastModified: Date.now() };
        setActiveNote(updated);
        setNotes(prev => prev.map(n =>
            (n.id === activeNote.id || (n.lastModified === activeNote.lastModified && !n.id && !activeNote.id))
                ? updated : n
        ));
    };

    const handleSaveNote = async () => {
        if (!activeNote) return;
        if (isLoggedIn) {
            try {
                const supabase = createClient();
                if (!supabase) return;
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) return;

                const payload = {
                    title: activeNote.title,
                    content: activeNote.content,
                    user_id: session.user.id,
                    updated_at: new Date().toISOString()
                };

                if (activeNote.id) {
                    const { error } = await supabase
                        .from('notes')
                        .update(payload)
                        .eq('id', activeNote.id);
                    if (error) throw error;
                } else {
                    const { data, error } = await supabase
                        .from('notes')
                        .insert(payload)
                        .select()
                        .single();

                    if (error) throw error;
                    if (data) {
                        // Update local ID with real DB ID
                        const realId = data.id;
                        const realNote = { ...activeNote, id: realId, user_id: session.user.id };
                        setActiveNote(realNote);
                        setNotes(prev => prev.map(n => n === activeNote ? realNote : n));
                    }
                }
            } catch (err) {
                console.error("Failed to save note", err);
            }
        }
    };

    const deleteNote = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Delete this note?')) {
            const remaining = notes.filter(n => n.id !== id);
            setNotes(remaining);
            if (activeNote?.id === id) {
                setActiveNote(remaining.length > 0 ? remaining[0] : null);
            }

            if (isLoggedIn) {
                const supabase = createClient();
                if (supabase) {
                    await supabase.from('notes').delete().eq('id', id);
                }
            }
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-20 px-6 bg-[var(--color-bg)]">
            <div className="max-w-6xl mx-auto h-[75vh] flex gap-6">

                {/* Sidebar */}
                <div className="w-1/3 flex flex-col bg-[var(--color-bg-card)] rounded-[var(--radius-xl)] border border-[var(--color-border)] overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-[var(--color-border)] flex justify-between items-center">
                        <h2 className="font-serif text-xl pl-2">My Notes {isLoggedIn && <span className="text-xs text-green-600 bg-green-100 px-2 rounded-full">Cloud</span>}</h2>
                        <button
                            onClick={() => createNewNote(isLoggedIn)}
                            className="p-2 hover:bg-[var(--color-bg-warm)] rounded-lg transition-colors text-[var(--color-primary)]"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {isLoading ? (
                            <div className="flex justify-center p-4"><Loader2 className="animate-spin opacity-50" /></div>
                        ) : notes.map((note, idx) => (
                            <div
                                key={note.id || idx} // Fallback idx for temp new notes
                                onClick={() => setActiveNote(note)}
                                className={`
                                    p-4 rounded-xl cursor-pointer transition-colors group relative
                                    ${activeNote === note ? 'bg-[var(--color-bg-warm)]' : 'hover:bg-[var(--color-bg-warm)]/50'}
                                `}
                            >
                                <h3 className={`font-medium mb-1 truncate ${!note.title ? 'text-[var(--color-text-muted)]' : ''}`}>
                                    {note.title || 'Untitled Note'}
                                </h3>
                                <p className="text-xs text-[var(--color-text-muted)] truncate">
                                    {note.content || 'No additional text'}
                                </p>
                                <span className="text-[10px] text-[var(--color-text-muted)]/70 mt-2 block">
                                    {new Date(note.lastModified).toLocaleDateString()}
                                </span>

                                <button
                                    onClick={(e) => deleteNote(note.id, e)}
                                    className="absolute right-2 top-3 p-1.5 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Editor */}
                <div className="flex-1 bg-[var(--color-bg-card)] rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-sm flex flex-col overflow-hidden">
                    {activeNote ? (
                        <>
                            <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-start">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={activeNote.title}
                                        onChange={(e) => updateActiveNote({ title: e.target.value })}
                                        placeholder="Note Title"
                                        className="text-3xl font-serif bg-transparent w-full outline-none placeholder-[var(--color-text-muted)]/50 text-[var(--color-text)]"
                                    />
                                    <div className="flex items-center gap-2 mt-2 text-xs text-[var(--color-text-muted)]">
                                        <Calendar className="w-3 h-3" />
                                        Last edited: {new Date(activeNote.lastModified).toLocaleString()}
                                    </div>
                                </div>
                                {isLoggedIn && (
                                    <button
                                        onClick={handleSaveNote}
                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                        title="Save to Cloud"
                                    >
                                        <Save className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                            <textarea
                                value={activeNote.content}
                                onChange={(e) => updateActiveNote({ content: e.target.value })}
                                placeholder="Start typing your reflections here..."
                                className="flex-1 w-full p-6 bg-transparent outline-none resize-none leading-relaxed text-lg"
                            />
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-[var(--color-text-muted)]">
                            <FileText className="w-16 h-16 mb-4 opacity-20" />
                            <p className="text-lg">Select a note to view or create a new one.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
