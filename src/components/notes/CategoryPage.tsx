import { useState } from 'react';
import { Plus, FileText, MoreHorizontal, Search, Edit3, Trash2, Share2, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { Route } from '../../hooks/useRouter';

interface CategoryPageProps {
  categoryId?: string;
  onNavigate: (route: Route, params?: any) => void;
}

const mockNotes = [
  {
    id: '1',
    title: 'Konsep Dasar React Hooks',
    summary: 'Penjelasan useState, useEffect, dan custom hooks untuk state management',
    lastModified: '2 jam yang lalu',
    tags: ['React', 'JavaScript', 'Frontend']
  },
  {
    id: '2',
    title: 'Setup Environment Development',
    summary: 'Langkah-langkah instalasi Node.js, npm, dan konfigurasi VSCode',
    lastModified: '1 hari yang lalu',
    tags: ['Setup', 'Development', 'Tools']
  },
  {
    id: '3',
    title: 'Database Design Best Practices',
    summary: 'Prinsip normalisasi, indexing, dan optimasi query untuk performa',
    lastModified: '3 hari yang lalu',
    tags: ['Database', 'SQL', 'Backend']
  },
  {
    id: '4',
    title: 'API Authentication dengan JWT',
    summary: 'Implementasi token-based authentication menggunakan JSON Web Tokens',
    lastModified: '1 minggu yang lalu',
    tags: ['API', 'Security', 'JWT']
  },
  {
    id: '5',
    title: 'CSS Grid vs Flexbox',
    summary: 'Perbandingan dan use case untuk layout modern dengan CSS',
    lastModified: '2 minggu yang lalu',
    tags: ['CSS', 'Layout', 'Frontend']
  }
];

export function CategoryPage({ categoryId, onNavigate }: CategoryPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categoryName = 'Proyek Coding'; // Mock category name

  const filteredNotes = mockNotes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleNoteAction = (action: string, noteId: string) => {
    switch (action) {
      case 'edit':
        onNavigate('note-editor', { noteId });
        break;
      case 'delete':
        // Implementasi delete
        console.log('Delete note:', noteId);
        break;
      case 'share':
        // Implementasi share
        console.log('Share note:', noteId);
        break;
    }
  };

  return (
    <div className="p-6 bg-[#121212] min-h-screen text-white">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onNavigate('dashboard')}
            className="text-gray-400 hover:text-white hover:bg-[#2A2A3A]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">{categoryName}</h1>
            <p className="text-gray-400">
              {filteredNotes.length} catatan tersimpan
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Cari dalam kategori ini..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#1E1E2E] border-[#333344] text-white placeholder:text-gray-500"
              />
            </div>
          </div>
          <Button 
            onClick={() => onNavigate('note-editor')}
            className="bg-[#7E47B8] hover:bg-[#6A3A9A] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Catatan Baru
          </Button>
        </div>
      </div>

      {/* Notes Grid */}
      <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {filteredNotes.map((note) => (
          <Card 
            key={note.id} 
            className="hover:shadow-xl hover:shadow-[#7E47B8]/20 transition-all cursor-pointer group bg-[#1E1E2E] border-[#333344] hover:border-[#7E47B8]/50"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle 
                    className="text-lg text-white group-hover:text-[#7E47B8] transition-colors cursor-pointer"
                    onClick={() => onNavigate('note-editor', { noteId: note.id })}
                  >
                    {note.title}
                  </CardTitle>
                  <p className="text-sm text-gray-400 mt-1">{note.lastModified}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white hover:bg-[#2A2A3A]">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#1E1E2E] border-[#333344]">
                    <DropdownMenuItem 
                      onClick={() => handleNoteAction('edit', note.id)}
                      className="text-gray-300 hover:text-white hover:bg-[#2A2A3A]"
                    >
                      <Edit3 className="mr-2 h-4 w-4" />
                      Edit Judul
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleNoteAction('share', note.id)}
                      className="text-gray-300 hover:text-white hover:bg-[#2A2A3A]"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Bagikan
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleNoteAction('delete', note.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 mb-3">{note.summary}</p>
              <div className="flex flex-wrap gap-1">
                {note.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="text-xs bg-[#7E47B8]/20 text-[#7E47B8] border-[#7E47B8]/30"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            {searchQuery ? 'Tidak ada catatan yang ditemukan' : 'Belum ada catatan'}
          </h3>
          <p className="text-gray-400 mb-4">
            {searchQuery 
              ? `Tidak ada catatan yang cocok dengan "${searchQuery}"`
              : 'Mulai buat catatan pertama Anda di kategori ini'
            }
          </p>
          {!searchQuery && (
            <Button 
              onClick={() => onNavigate('note-editor')}
              className="bg-[#7E47B8] hover:bg-[#6A3A9A] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Buat Catatan Pertama
            </Button>
          )}
        </div>
      )}
    </div>
  );
}