'use client';

import { useEffect, useState } from 'react';

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [newTitle, setNewTitle] = useState('');

  async function fetchBooks() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/books', { cache: 'no-store' });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `목록 조회 실패 (${res.status})`);
      }
      const data = await res.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message || '에러가 발생했습니다');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 0,
          title: newTitle,
          description: '',
          pageCount: 0,
          excerpt: ''
        })
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `생성 실패 (${res.status})`);
      }
      setNewTitle('');
      fetchBooks();
    } catch (e) {
      alert(e?.message || '생성 중 에러');
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>Books</h1>
      <form onSubmit={handleCreate} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          placeholder="새 책 제목"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{ flex: 1, padding: 8, border: '1px solid #ccc', borderRadius: 6 }}
        />
        <button type="submit" style={{ padding: '8px 12px' }}>추가</button>
      </form>
      {loading ? (
        <p>로딩 중...</p>
      ) : error ? (
        <p style={{ color: 'crimson' }}>{error}</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 8 }}>
          {books.map((b) => (
            <li key={b.id} style={{ border: '1px solid #eee', padding: 12, borderRadius: 8 }}>
              <div style={{ fontWeight: 700 }}>{b.title}</div>
              <div style={{ color: '#666', fontSize: 13 }}>id: {b.id}</div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}


