async function getNote(id) {
    const res = await fetch(`http://localhost:3000/api/notes/${id}`, {
        cache: 'no-store',
    });
    if (!res.ok) {
        throw new Error('Failed to fetch note');
    }
    return res.json();
}

export default async function NotePage({ params }) {
    const note = await getNote(params.id);

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <a href="/" className="text-blue-500 hover:underline mb-8">
                &larr; Back to Notes
            </a>
            <h1 className="text-4xl font-bold mb-8">Note Details</h1>
            <div className="p-4 border rounded-md">
                <h2 className="text-2xl font-semibold">{note.title}</h2>
                <p className="text-gray-500">ID: {note.id}</p>
            </div>
        </main>
    );
}
