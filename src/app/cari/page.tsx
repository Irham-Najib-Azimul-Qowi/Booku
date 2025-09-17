'use client'
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import withAuth from '@/components/withAuth';
import { useAuth } from '@/lib/context/AuthContext';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import Link from 'next/link';

// Definisikan tipe untuk hasil
type NoteResult = { id: string; title: string; categoryId: string; };
type TaskResult = { id: string; content: string; status: string; };

function SearchResults() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('q') || '';

  const [notes, setNotes] = useState<NoteResult[]>([]);
  const [tasks, setTasks] = useState<TaskResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && searchTerm) {
      const performSearch = async () => {
        setLoading(true);
        // Cari di koleksi 'notes'
        const notesQuery = query(
          collection(db, 'notes'),
          where('userId', '==', user.uid),
          where('title', '>=', searchTerm),
          where('title', '<=', searchTerm + '\uf8ff')
        );
        const noteSnapshots = await getDocs(notesQuery);
        const notesData = noteSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() })) as NoteResult[];
        setNotes(notesData);

        // Cari di koleksi 'tasks'
        const tasksQuery = query(
          collection(db, 'tasks'),
          where('userId', '==', user.uid),
          where('content', '>=', searchTerm),
          where('content', '<=', searchTerm + '\uf8ff')
        );
        const taskSnapshots = await getDocs(tasksQuery);
        const tasksData = taskSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() })) as TaskResult[];
        setTasks(tasksData);

        setLoading(false);
      };
      performSearch();
    } else {
      setLoading(false);
    }
  }, [user, searchTerm]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Hasil Pencarian untuk: <span className="text-purple-400">"{searchTerm}"</span>
      </h1>
      
      {loading ? (
        <p>Mencari...</p>
      ) : (
        <div className="space-y-8">
          {/* Hasil Catatan */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Catatan Ditemukan</h2>
            {notes.length > 0 ? (
              <div className="space-y-2">
                {notes.map(note => (
                  <Link key={note.id} href={`/catatan/${note.categoryId}/${note.id}`} className="block bg-slate-800 hover:bg-slate-700 p-4 rounded-lg">
                    {note.title}
                  </Link>
                ))}
              </div>
            ) : <p className="text-slate-400">Tidak ada catatan yang cocok.</p>}
          </div>

          {/* Hasil Tugas */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Tugas Ditemukan</h2>
            {tasks.length > 0 ? (
              <div className="space-y-2">
                {tasks.map(task => (
                  <Link key={task.id} href="/tugas" className="block bg-slate-800 hover:bg-slate-700 p-4 rounded-lg">
                    {task.content} <span className="text-xs bg-slate-600 px-2 py-1 rounded-full ml-2">{task.status}</span>
                  </Link>
                ))}
              </div>
            ) : <p className="text-slate-400">Tidak ada tugas yang cocok.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

// Gunakan Suspense untuk menangani 'useSearchParams'
function SearchPage() {
    return (
        <Suspense fallback={<div>Memuat...</div>}>
            <SearchResults />
        </Suspense>
    )
}

export default withAuth(SearchPage);