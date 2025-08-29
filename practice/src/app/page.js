'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
    const [notes, setNotes] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editingTitle, setEditingTitle] = useState('');

    async function fetchNotes() {
        const res = await fetch('http://localhost:3000/api/notes');
        const data = await res.json();
        setNotes(data);
    }

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        const res = await fetch('http://localhost:3000/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTitle }),
        });

        if (res.ok) {
            setNewTitle('');
            fetchNotes(); // Re-fetch all notes
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('정말로 이 노트를 삭제하시겠습니까?')) {
            return;
        }
        const res = await fetch(`http://localhost:3000/api/notes/${id}`, {
            method: 'DELETE',
        });
        if (res.ok) {
            fetchNotes(); // Re-fetch all notes
        }
    };

    const handleUpdate = async (e, id) => {
        e.preventDefault();
        const res = await fetch(`http://localhost:3000/api/notes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: editingTitle }),
        });

        if (res.ok) {
            setEditingNoteId(null);
            setEditingTitle('');
            fetchNotes(); // Re-fetch all notes
        }
    };

    const startEditing = (note) => {
        setEditingNoteId(note.id);
        setEditingTitle(note.title);
    };

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <h1 className="text-4xl font-bold mb-8">Notes</h1>

            <form onSubmit={handleCreate} className="mb-8">
                <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="새로운 노트 제목"
                    className="border p-2 mr-2 text-black"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    노트 추가
                </button>
            </form>

            <ul className="w-full max-w-md">
                {notes.map((note) => (
                    <li key={note.id} className="mb-2 flex items-center justify-between w-full p-2 border rounded">
                        {editingNoteId === note.id ? (
                            <form onSubmit={(e) => handleUpdate(e, note.id)} className="flex-grow flex items-center">
                                <input
                                    type="text"
                                    value={editingTitle}
                                    onChange={(e) => setEditingTitle(e.target.value)}
                                    className="border p-1 mr-2 text-black flex-grow"
                                    required
                                    autoFocus
                                />
                                <button type="submit" className="bg-green-500 text-white p-1 rounded text-sm">
                                    저장
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingNoteId(null)}
                                    className="bg-gray-500 text-white p-1 rounded ml-2 text-sm"
                                >
                                    취소
                                </button>
                            </form>
                        ) : (
                            <>
                                <Link href={`/notes/${note.id}`} className="text-blue-500 hover:underline">
                                    {note.title}
                                </Link>
                                <div>
                                    <button
                                        onClick={() => startEditing(note)}
                                        className="bg-yellow-500 text-white p-1 rounded text-sm"
                                    >
                                        수정
                                    </button>
                                    <button
                                        onClick={() => handleDelete(note.id)}
                                        className="bg-red-500 text-white p-1 rounded ml-2 text-sm"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </main>
    );
}
