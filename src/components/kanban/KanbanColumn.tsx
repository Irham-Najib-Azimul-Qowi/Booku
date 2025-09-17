'use client'
import { Droppable, Draggable } from '@hello-pangea/dnd'
import { Trash2, Calendar } from 'lucide-react'
import { doc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'

type Item = {
  id: string;
  content: string;
  deadline?: string | null;
}

type KanbanColumnProps = {
  id: string;
  name: string;
  items: Item[];
}

export default function KanbanColumn({ id, name, items }: KanbanColumnProps) {
  
  // Fungsi untuk menangani penghapusan tugas
  const handleDelete = async (taskId: string) => {
    // Kondisi 'if (window.confirm(...))' dihapus dari sini.
    // Tugas akan langsung dihapus.
    try {
      await deleteDoc(doc(db, "tasks", taskId));
    } catch (error) {
      console.error("Gagal menghapus tugas: ", error);
      alert("Gagal menghapus tugas, silakan coba lagi.");
    }
  }

  return (
    <div className="bg-slate-800 rounded-lg p-4 flex flex-col">
      <h2 className="font-semibold text-white mb-4">{name}</h2>
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-4 flex-grow min-h-[100px] transition-colors rounded-md ${snapshot.isDraggingOver ? 'bg-slate-700/50' : ''}`}
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`bg-slate-700 p-3 rounded-md shadow-md group ${snapshot.isDragging ? 'opacity-80 shadow-lg scale-105' : ''}`}
                  >
                    <p className="text-sm text-slate-200 mb-2">{item.content}</p>
                    <div className="flex justify-between items-center">
                      {item.deadline ? (
                        <div className="flex items-center gap-1 text-xs text-yellow-400">
                          <Calendar size={12} />
                          <span>{new Date(item.deadline).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                      ) : (
                        <div></div>
                      )}
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-400"
                        title="Hapus tugas"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}