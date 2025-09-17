'use client'
import { useState, useEffect } from 'react'
import withAuth from "@/components/withAuth"
import { Plus, ArrowLeft } from "lucide-react"
import Link from 'next/link'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import KanbanColumn from '@/components/kanban/KanbanColumn'
import Modal from '@/components/Modal'
import { useAuth } from '@/lib/context/AuthContext'
import { db } from '@/lib/firebase/config'
import { collection, query, where, onSnapshot, doc, writeBatch, addDoc, serverTimestamp  } from 'firebase/firestore'

// Tipe data
type Task = { id: string; content: string; userId: string; status: 'todo' | 'in-progress' | 'done'; order: number; };
type Column = { name: string; items: Task[]; };
type Columns = { [key: string]: Column; };

function TugasPage() {
  const { user } = useAuth();
  const [columns, setColumns] = useState<Columns>({
    'todo': { name: 'To Do', items: [] },
    'in-progress': { name: 'In Progress', items: [] },
    'done': { name: 'Done', items: [] },
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState('');
  const [newDeadline, setNewDeadline] = useState(''); // State baru untuk deadline


  // Mengambil data dari Firestore
  useEffect(() => {
    if (user) {
      const q = query(collection(db, "tasks"), where("userId", "==", user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newColumns: Columns = {
          'todo': { name: 'To Do', items: [] },
          'in-progress': { name: 'In Progress', items: [] },
          'done': { name: 'Done', items: [] },
        };
        snapshot.docs.forEach(doc => {
          const task = { id: doc.id, ...doc.data() } as Task;
          if (task.status && newColumns[task.status]) {
            newColumns[task.status].items.push(task);
          }
        });
        Object.values(newColumns).forEach(col => col.items.sort((a, b) => a.order - b.order));
        setColumns(newColumns);
      });
      return () => unsubscribe();
    }
  }, [user]);

  // Menangani logika drag-and-drop
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColId = source.droppableId;
    const destColId = destination.droppableId;

    const newColumns = { ...columns };
    const sourceCol = newColumns[sourceColId];
    const destCol = newColumns[destColId];
    const [movedItem] = sourceCol.items.splice(source.index, 1);

    if (sourceColId === destColId) {
      sourceCol.items.splice(destination.index, 0, movedItem);
    } else {
      destCol.items.splice(destination.index, 0, movedItem);
    }
    
    setColumns(newColumns);
    updateFirestore(newColumns);
  };

  async function updateFirestore(updatedColumns: Columns) {
    const batch = writeBatch(db);
    Object.entries(updatedColumns).forEach(([columnId, column]) => {
      column.items.forEach((item, index) => {
        const docRef = doc(db, 'tasks', item.id);
        batch.update(docRef, { order: index, status: columnId });
      });
    });
    await batch.commit();
  }
  
  // Menangani penambahan tugas baru
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskContent.trim() === '' || !user) return;
    try {
      const todoColumn = columns['todo'];
      const newOrder = todoColumn.items.length;
      await addDoc(collection(db, "tasks"), {
        content: newTaskContent, userId: user.uid, status: 'todo', order: newOrder, createdAt: serverTimestamp(), deadline: newDeadline || null, // Simpan deadline, atau null jika kosong
      });
      setNewTaskContent('');
      setNewDeadline(''); 
      setIsModalOpen(false);
    } catch (error) { console.error("Error adding task: ", error); }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
            <Link href="/" className="text-slate-400 hover:text-white">
                <ArrowLeft size={24} />
            </Link>
            <h1 className="text-3xl font-bold">Manajemen Tugas</h1>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg">
          <Plus size={18} /> Tambah Tugas
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {Object.entries(columns).map(([columnId, column]) => (
            <KanbanColumn key={columnId} id={columnId} name={column.name} items={column.items} />
          ))}
        </div>
      </DragDropContext>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Buat Tugas Baru">
        <form onSubmit={handleAddTask}>
          <label htmlFor="taskContent" className="block text-sm font-medium text-slate-300">Deskripsi Tugas</label>
          <textarea
            id="taskContent" value={newTaskContent} onChange={(e) => setNewTaskContent(e.target.value)}
            className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-purple-500"
            placeholder="Contoh: Belajar Next.js" required rows={3}
          />
          {/* Input baru untuk Deadline */}
          <div className="mt-4">
            <label htmlFor="taskDeadline" className="block text-sm font-medium text-slate-300">
              Tenggat Waktu (Opsional)
            </label>
            <input
              id="taskDeadline"
              type="date"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
              className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-purple-500"
            />
          </div>

          <div className="mt-4 flex justify-end"></div>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg">
              Simpan Tugas
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default withAuth(TugasPage);

