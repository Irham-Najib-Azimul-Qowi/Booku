'use client'
import { ElementType } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { doc, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/lib/context/AuthContext';

type CategoryCardProps = {
  id: string;
  icon: ElementType;
  name: string;
  count: number;
  color: string;
};

export default function CategoryCard({ id, icon: Icon, name, count, color }: CategoryCardProps) {
  const { user } = useAuth();

  // Fungsi untuk menghapus kategori dan semua catatannya
  const handleDeleteCategory = async () => {
    // Kondisi 'window.confirm' dihapus dari sini
    if (!user) return;

    try {
      const batch = writeBatch(db);

      // 1. Temukan semua catatan di dalam kategori ini
      const notesQuery = query(collection(db, "notes"), where("categoryId", "==", id), where("userId", "==", user.uid));
      const notesSnapshot = await getDocs(notesQuery);
      
      // 2. Tandai semua catatan tersebut untuk dihapus
      notesSnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });

      // 3. Tandai dokumen kategori itu sendiri untuk dihapus
      const categoryRef = doc(db, 'categories', id);
      batch.delete(categoryRef);

      // 4. Jalankan semua operasi penghapusan
      await batch.commit();

    } catch (error) {
      console.error("Gagal menghapus kategori dan catatannya: ", error);
      alert("Gagal menghapus kategori.");
    }
  };

  return (
    <div className="flex-shrink-0 w-60 group relative">
      <Link href={`/catatan/${id}`} className="block h-full">
        <div className="bg-slate-800 p-5 rounded-xl h-full hover:bg-slate-700/50 transition-colors cursor-pointer">
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-lg" style={{ backgroundColor: color }}>
              <Icon size={24} className="text-white" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold text-white">{name}</h3>
            {/* <p className="text-sm text-slate-400">{count} items</p> */}
          </div>
        </div>
      </Link>
      <button 
        onClick={handleDeleteCategory}
        className="absolute top-2 right-2 p-1.5 bg-red-500/50 hover:bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        title="Hapus Kategori"
      >
        <Trash2 size={14} className="text-white"/>
      </button>
    </div>
  );
}
