'use client'
import { useState, useEffect } from 'react'
import withAuth from '@/components/withAuth'
import { useAuth } from '@/lib/context/AuthContext'
import { db } from '@/lib/firebase/config'
import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore' // Import addDoc
import CategoryCard from '@/components/CategoryCard'
import Modal from '@/components/Modal' // Import Modal
import { PlusCircle, Book, Code, Sigma, CheckSquare, Image as ImageIcon, Lightbulb } from 'lucide-react' // Import PlusCircle

// Tipe data (tidak berubah)
type Category = {
  id: string;
  name: string;
  userId: string;
};

function CatatanIndukPage() {
  const { user } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  
  // State untuk modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  // useEffect untuk mengambil data (tidak berubah)
  useEffect(() => {
    if (user) {
      const q = query(collection(db, "categories"), where("userId", "==", user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const categoriesData: Category[] = [];
        querySnapshot.forEach((doc) => {
          categoriesData.push({ id: doc.id, ...doc.data() } as Category);
        });
        setCategories(categoriesData);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [user]);

  // Fungsi untuk menambah kategori baru
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim() === '' || !user) return;
    try {
      await addDoc(collection(db, "categories"), {
        name: newCategoryName,
        userId: user.uid,
      });
      setNewCategoryName('');
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const categoryVisuals = [
    { icon: Book, color: '#3b82f6' },
    { icon: Code, color: '#22c55e' },
    { icon: Sigma, color: '#a855f7' },
    { icon: CheckSquare, color: '#f97316' },
    { icon: ImageIcon, color: '#ef4444' },
    { icon: Lightbulb, color: '#eab308' },
  ]

  if (loading) {
    return <p className="text-center p-10">Memuat kategori...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Semua Kategori Catatan</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          <PlusCircle size={18} />
          Tambah Kategori
        </button>
      </div>
      
      {categories.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
          {categories.map((category, index) => {
            const visual = categoryVisuals[index % categoryVisuals.length]; 
            return (
              <CategoryCard
                key={category.id}
                id={category.id}
                icon={visual.icon}
                name={category.name}
                count={0}
                color={visual.color}
              />
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-800 rounded-lg">
          <p className="text-slate-400">Anda belum memiliki kategori catatan.</p>
        </div>
      )}

      {/* Modal untuk menambah kategori */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Buat Kategori Baru">
        <form onSubmit={handleAddCategory}>
          <label htmlFor="categoryName" className="block text-sm font-medium text-slate-300">
            Nama Kategori
          </label>
          <input
            id="categoryName"
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-purple-500"
            placeholder="Contoh: Proyek Web"
            required
          />
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Simpan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default withAuth(CatatanIndukPage)