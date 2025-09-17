'use client'

import withAuth from '@/components/withAuth'
import { useAuth } from '@/lib/context/AuthContext'
import CategoryCard from '@/components/CategoryCard'
import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase/config'
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore'
import { Book, Code, Sigma, CheckSquare, Image as ImageIcon, Lightbulb, ArrowRight } from 'lucide-react'
import Link from 'next/link'

// Definisikan tipe untuk data
type Category = { id: string; name: string; userId: string; };
type Task = { id: string; content: string; status: string; };

function Home() {
  const { user } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [tasks, setTasks] = useState<Task[]>([]) // State baru untuk tugas

  // Mengambil data kategori
  useEffect(() => {
    if (user) {
      const q = query(collection(db, "categories"), where("userId", "==", user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const categoriesData: Category[] = [];
        querySnapshot.forEach((doc) => {
          categoriesData.push({ id: doc.id, ...doc.data() } as Category);
        });
        setCategories(categoriesData);
      });
      return () => unsubscribe();
    }
  }, [user]);

  // Mengambil 5 tugas terbaru
  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, "tasks"), 
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"), // Urutkan berdasarkan yang terbaru
        limit(5) // Ambil 5 saja
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const tasksData: Task[] = [];
        querySnapshot.forEach((doc) => {
          tasksData.push({ id: doc.id, ...doc.data() } as Task);
        });
        setTasks(tasksData);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const categoryVisuals = [
    { icon: Book, color: '#3b82f6' },
    { icon: Code, color: '#22c55e' },
    { icon: Sigma, color: '#a855f7' },
  ]

  return (
    <div className="container mx-auto p-6 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold">Selamat Datang Kembali!</h1>
        <p className="text-slate-400 mt-1">Kelola catatan dan tugas Anda dengan mudah.</p>
      </div>
      
      {/* Bagian Kategori */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold">Catatanku</h2>
        <div className="flex gap-4 overflow-x-auto py-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                id={category.id}
                icon={categoryVisuals[index % categoryVisuals.length].icon}
                name={category.name}
                count={0}
                color={categoryVisuals[index % categoryVisuals.length].color}
              />
            ))
          ) : (
            <div className="w-full text-center py-10">
              <p className="text-slate-400">Anda belum memiliki kategori.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- BAGIAN BARU: DASBOR TUGAS --- */}
      <div className="mt-8 flex-grow flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tugas Terbaru</h2>
          <Link href="/tugas" className="flex items-center gap-1 text-sm text-purple-400 hover:underline">
            Lihat Semua <ArrowRight size={14} />
          </Link>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 flex-grow">
          {tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.map(task => (
                <div key={task.id} className="flex items-center justify-between bg-slate-700/50 p-3 rounded-md">
                  <p className="text-slate-300">{task.content}</p>
                  <span className="text-xs capitalize bg-slate-600 px-2 py-1 rounded-full">{task.status.replace('-', ' ')}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-slate-500">Tidak ada tugas yang perlu ditampilkan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default withAuth(Home);