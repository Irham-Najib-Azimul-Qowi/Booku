'use client'

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import withAuth from "@/components/withAuth";
import Link from "next/link";
import { ArrowLeft, GripVertical, Trash2, Pilcrow, Code, Sigma, CheckSquare } from "lucide-react";
import { useAuth } from '@/lib/context/AuthContext';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Impor komponen blok secara dinamis untuk menghindari error SSR
const TextBlock = dynamic(() => import('@/components/editor/TextBlock'), { ssr: false });
const ChecklistBlock = dynamic(() => import('@/components/editor/ChecklistBlock'), { ssr: false });
const CodeBlock = dynamic(() => import('@/components/editor/CodeBlock'), { ssr: false });
const MathBlock = dynamic(() => import('@/components/editor/MathBlock'), { ssr: false });

// Tipe untuk setiap jenis blok
type BlockType = 'text' | 'checklist' | 'code' | 'math';
type Block = { id: string; type: BlockType; content: any; };

// Komponen terpisah untuk setiap item yang bisa di-drag
function SortableBlock({ id, block, index, onUpdate, onDelete, onAddBlock }: { id: string, block: Block, index: number, onUpdate: (id: string, content: any) => void, onDelete: (id: string) => void, onAddBlock: (index: number, type: BlockType) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="group relative">
      <div {...attributes} {...listeners} className="absolute -left-8 top-1/2 -translate-y-1/2 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab text-slate-500" title="Seret untuk memindahkan">
        <GripVertical />
      </div>
      <button onClick={() => onDelete(block.id)} className="absolute -right-8 top-1/2 -translate-y-1/2 p-1 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-400" title="Hapus blok">
        <Trash2 size={18} />
      </button>
      
      <div className="p-4 bg-slate-800 rounded-lg min-h-[50px]">
        {block.type === 'text' && <TextBlock initialContent={block.content} onUpdate={(json) => onUpdate(block.id, json)} />}
        {block.type === 'checklist' && <ChecklistBlock initialContent={block.content} onUpdate={(json) => onUpdate(block.id, json)} />}
        {block.type === 'code' && <CodeBlock initialContent={block.content} onUpdate={(json) => onUpdate(block.id, json)} />}
        {block.type === 'math' && <MathBlock initialContent={block.content} onUpdate={(content) => onUpdate(block.id, content)} />}
      </div>
      
      <div className="h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-full border-t border-dashed border-slate-600 relative">
          <div className="absolute left-1/2 -translate-x-1/2 -top-4 flex gap-2 bg-slate-800 p-1 rounded-md shadow-lg">
            <button title="Tambah Teks" onClick={() => onAddBlock(index + 1, 'text')} className="hover:bg-slate-600 p-1 rounded"><Pilcrow size={16}/></button>
            <button title="Tambah Kode" onClick={() => onAddBlock(index + 1, 'code')} className="hover:bg-slate-600 p-1 rounded"><Code size={16}/></button>
            <button title="Tambah Checklist" onClick={() => onAddBlock(index + 1, 'checklist')} className="hover:bg-slate-600 p-1 rounded"><CheckSquare size={16}/></button>
            <button title="Tambah Matematika" onClick={() => onAddBlock(index + 1, 'math')} className="hover:bg-slate-600 p-1 rounded"><Sigma size={16}/></button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Komponen utama halaman editor
function NoteEditorPage() {
  const { user } = useAuth();
  const params = useParams();
  const noteId = params.noteId as string;
  const categoryId = params.categoryId as string;
  
  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  useEffect(() => {
    if (user && noteId) {
      const noteDocRef = doc(db, 'notes', noteId);
      getDoc(noteDocRef).then(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || 'Tanpa Judul');
          setBlocks(data.content && data.content.length > 0 ? data.content : [{ id: Date.now().toString(), type: 'text', content: '' }]);
        }
        setLoading(false);
      });
    }
  }, [user, noteId]);

  const handleSaveChanges = async () => {
    if (!user) return;
    setIsSaving(true);
    const noteDocRef = doc(db, 'notes', noteId);
    try {
      await setDoc(noteDocRef, {
        title, content: blocks, lastUpdated: serverTimestamp(),
        userId: user.uid, categoryId,
      }, { merge: true });
    } catch (error) { console.error("Error saving note: ", error); }
    finally { setIsSaving(false); }
  };
  
  const addBlock = (index: number, type: BlockType) => {
    const newBlock: Block = { id: Date.now().toString(), type, content: '' };
    const newBlocks = [...blocks];
    newBlocks.splice(index, 0, newBlock);
    setBlocks(newBlocks);
  };

  const deleteBlock = (id: string) => {
    setBlocks(prevBlocks => prevBlocks.filter(b => b.id !== id));
  };
  
  const updateBlockContent = (id: string, content: any) => {
    setBlocks(prevBlocks => prevBlocks.map(b => b.id === id ? { ...b, content } : b));
  };
  
  const onDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  if (loading) return <p className="text-center p-10">Memuat catatan...</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 p-2 bg-slate-800 rounded-lg mb-4 sticky top-4 z-10 shadow-lg">
        <button onClick={() => addBlock(0, 'text')} className="flex items-center gap-2 text-slate-300 hover:bg-slate-700 p-2 rounded-md"><Pilcrow size={18}/> Teks</button>
        <button onClick={() => addBlock(0, 'code')} className="flex items-center gap-2 text-slate-300 hover:bg-slate-700 p-2 rounded-md"><Code size={18}/> Kode</button>
        <button onClick={() => addBlock(0, 'math')} className="flex items-center gap-2 text-slate-300 hover:bg-slate-700 p-2 rounded-md"><Sigma size={18}/> Matematika</button>
        <button onClick={() => addBlock(0, 'checklist')} className="flex items-center gap-2 text-slate-300 hover:bg-slate-700 p-2 rounded-md"><CheckSquare size={18}/> Checklist</button>
      </div>

      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4 flex-grow min-w-0">
          <Link href={`/catatan/${categoryId}`} className="text-slate-400 hover:text-white flex-shrink-0"><ArrowLeft size={24} /></Link>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-transparent text-3xl font-bold w-full focus:outline-none truncate" placeholder="Judul Catatan" />
        </div>
        <button onClick={handleSaveChanges} disabled={isSaving} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg flex-shrink-0 disabled:bg-slate-500">{isSaving ? 'Menyimpan...' : 'Simpan'}</button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={blocks} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {blocks.map((block, index) => (
              <SortableBlock key={block.id} id={block.id} block={block} index={index} onUpdate={updateBlockContent} onDelete={deleteBlock} onAddBlock={addBlock} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default withAuth(NoteEditorPage);