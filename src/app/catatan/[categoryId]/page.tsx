'use client'

import { useState, useEffect } from 'react';
import withAuth from "@/components/withAuth";
import Link from "next/link";
import { ArrowLeft, PlusCircle, Trash2, UserPlus } from "lucide-react";
import { useAuth } from '@/lib/context/AuthContext';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, collection, query, where, onSnapshot, Timestamp, addDoc, serverTimestamp, deleteDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import Modal from '@/components/Modal';

// Tipe untuk data
type Category = {
  name: string;
  members: string[]; // Anggota berdasarkan UID
};

type Note = {
  id: string;
  title: string;
  lastUpdated: Timestamp;
};

function CategoryDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const categoryId = params.categoryId as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  // Mengambil data kategori dan catatan
  useEffect(() => {
    if (user && categoryId) {
      const categoryDocRef = doc(db, 'categories', categoryId);
      getDoc(categoryDocRef).then(docSnap => {
        if (docSnap.exists()) {
          setCategory(docSnap.data() as Category);
        }
      });

      // Kueri baru untuk kolaborasi: ambil catatan jika categoryId cocok DAN userId pengguna ada di dalam array 'members' kategori tersebut.
      // Catatan: Ini memerlukan perubahan aturan keamanan dan struktur data yang lebih kompleks di masa depan.
      // Untuk sekarang, kita akan filter berdasarkan userId pemilik.
      const q = query(
        collection(db, "notes"),
        where("categoryId", "==", categoryId),
        where("userId", "==", user.uid)
      );
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const notesData: Note[] = [];
        querySnapshot.forEach((doc) => {
          notesData.push({ id: doc.id, ...doc.data() } as Note);
        });
        setNotes(notesData);
      });

      return () => unsubscribe();
    }
  }, [user, categoryId]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newNoteTitle.trim() === '' || !user) return;
    try {
      await addDoc(collection(db, "notes"), {
        title: newNoteTitle,
        content: [{ id: Date.now().toString(), type: 'text', content: '' }],
        categoryId: categoryId,
        userId: user.uid,
        lastUpdated: serverTimestamp(),
      });
      setNewNoteTitle('');
      setIsAddNoteModalOpen(false);
    } catch (error) { console.error("Error adding note: ", error); }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteDoc(doc(db, "notes", noteId));
    } catch (error) { console.error("Gagal menghapus catatan: ", error); }
  };
  
  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteEmail.trim() === '' || !user) return;
    const categoryRef = doc(db, 'categories', categoryId);
    try {
      // Logika penuh memerlukan Cloud Function untuk mengubah email menjadi UID
      await updateDoc(categoryRef, {
        members: arrayUnion(inviteEmail)
      });
      alert(`Undangan dikirim ke ${inviteEmail}`);
      setInviteEmail('');
      setIsInviteModalOpen(false);
    } catch (error) { console.error("Gagal mengundang pengguna: ", error); }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-slate-400 hover:text-white"><ArrowLeft size={24} /></Link>
          <h1 className="text-3xl font-bold">{category ? category.name : 'Memuat...'}</h1>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={() => setIsInviteModalOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"><UserPlus size={18} /> Undang</button>
           <button onClick={() => setIsAddNoteModalOpen(true)} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg"><PlusCircle size={18} /> Tambah Catatan</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.length > 0 ? (
          notes.map(note => (
            <div key={note.id} className="bg-slate-800 rounded-lg group relative">
              <Link href={`/catatan/${categoryId}/${note.id}`} className="block p-5 h-full hover:bg-slate-700/50 transition-colors rounded-lg">
                <h3 className="font-semibold text-white truncate">{note.title}</h3>
                <p className="text-sm text-slate-400 mt-2">
                  Diperbarui: {note.lastUpdated?.toDate().toLocaleDateString('id-ID')}
                </p>
              </Link>
              <button onClick={() => handleDeleteNote(note.id)} className="absolute top-2 right-2 p-1.5 bg-red-500/50 hover:bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" title="Hapus Catatan">
                <Trash2 size={14} className="text-white"/>
              </button>
            </div>
          ))
        ) : (
          <p className="text-slate-400 col-span-full text-center py-10">Belum ada catatan di kategori ini. Silakan buat satu!</p>
        )}
      </div>

      <Modal isOpen={isAddNoteModalOpen} onClose={() => setIsAddNoteModalOpen(false)} title="Buat Catatan Baru">
        <form onSubmit={handleAddNote}>
          <label htmlFor="noteTitle" className="block text-sm font-medium text-slate-300">Judul Catatan</label>
          <input
            id="noteTitle" type="text" value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-purple-500"
            placeholder="Contoh: Ringkasan Materi Bab 1" required
          />
          <div className="mt-4 flex justify-end">
            <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg">Simpan</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} title="Undang Anggota ke Kategori">
        <form onSubmit={handleInviteUser}>
          <label htmlFor="inviteEmail" className="block text-sm font-medium text-slate-300">Email Pengguna</label>
          <input
            id="inviteEmail" type="email" value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-purple-500"
            placeholder="contoh@email.com" required
          />
          <div className="mt-4 flex justify-end">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg">Kirim Undangan</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default withAuth(CategoryDetailPage);