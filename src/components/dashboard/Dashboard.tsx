import { useState } from 'react';
import { Plus, FileText, Code, Calculator, CheckSquare, Image, MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { Route } from '../../hooks/useRouter';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface DashboardProps {
  onNavigate: (route: Route, params?: any) => void;
}

const categories = [
  {
    id: '1',
    name: 'Catatan Kuliah',
    count: 24,
    icon: FileText,
    color: 'bg-blue-500',
    description: 'Materi pembelajaran dan kuliah'
  },
  {
    id: '2',
    name: 'Proyek Coding',
    count: 12,
    icon: Code,
    color: 'bg-green-500',
    description: 'Dokumentasi dan snippet kode'
  },
  {
    id: '3',
    name: 'Rumus Matematika',
    count: 8,
    icon: Calculator,
    color: 'bg-purple-500',
    description: 'Formula dan perhitungan penting'
  },
  {
    id: '4',
    name: 'Checklist Harian',
    count: 15,
    icon: CheckSquare,
    color: 'bg-orange-500',
    description: 'Tugas dan kegiatan sehari-hari'
  },
  {
    id: '5',
    name: 'Koleksi Gambar',
    count: 32,
    icon: Image,
    color: 'bg-pink-500',
    description: 'Referensi visual dan inspirasi'
  },
  {
    id: '6',
    name: 'Ide Kreatif',
    count: 6,
    icon: FileText,
    color: 'bg-indigo-500',
    description: 'Brainstorming dan konsep baru'
  }
];

export function Dashboard({ onNavigate }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-[#121212] min-h-screen text-white">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#7E47B8] to-[#B647B8] p-8 text-white shadow-2xl">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Selamat Datang Kembali!</h1>
            <p className="text-xl opacity-90 mb-6">
              Kelola catatan dan tugas Anda dengan mudah
            </p>
            <div className="flex gap-4">
              <Button 
                onClick={() => onNavigate('note-editor')}
                className="bg-white text-[#7E47B8] hover:bg-gray-100 rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Buat Catatan Baru
              </Button>
              <Button 
                onClick={() => onNavigate('tasks')}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#7E47B8] rounded-xl"
              >
                Lihat Tugas
              </Button>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-20">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1499080863200-1f37ed9cb653?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3RlYm9vayUyMHdyaXRpbmclMjBzdHVkeXxlbnwxfHx8fDE3NTY5ODA4NDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Notes illustration"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-[#1E1E2E] border-[#3A3A4A] rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#7E47B8] bg-opacity-20 rounded-lg">
                <FileText className="w-5 h-5 text-[#7E47B8]" />
              </div>
              <div>
                <p className="text-sm text-[#A0A0A0]">Total Catatan</p>
                <p className="text-2xl font-bold text-white">97</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1E1E2E] border-[#3A3A4A] rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#4CAF50] bg-opacity-20 rounded-lg">
                <CheckSquare className="w-5 h-5 text-[#4CAF50]" />
              </div>
              <div>
                <p className="text-sm text-[#A0A0A0]">Tugas Selesai</p>
                <p className="text-2xl font-bold text-white">23</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1E1E2E] border-[#3A3A4A] rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#F1C40F] bg-opacity-20 rounded-lg">
                <FileText className="w-5 h-5 text-[#F1C40F]" />
              </div>
              <div>
                <p className="text-sm text-[#A0A0A0]">Kategori</p>
                <p className="text-2xl font-bold text-white">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1E1E2E] border-[#3A3A4A] rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#B647B8] bg-opacity-20 rounded-lg">
                <Plus className="w-5 h-5 text-[#B647B8]" />
              </div>
              <div>
                <p className="text-sm text-[#A0A0A0]">Bulan Ini</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-white">Kategori Catatan</h2>
          <Button 
            onClick={() => onNavigate('category')}
            className="bg-[#7E47B8] hover:bg-[#6A3A9A] rounded-xl"
          >
            Lihat Semua
          </Button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Card 
              key={category.id} 
              className="bg-[#1E1E2E] border-[#3A3A4A] hover:shadow-xl hover:shadow-[#7E47B8]/20 transition-all cursor-pointer group rounded-xl hover:border-[#7E47B8]/50"
              onClick={() => onNavigate('category', { categoryId: category.id })}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${category.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-white group-hover:text-[#7E47B8] transition-colors">
                        {category.name}
                      </CardTitle>
                      <Badge variant="secondary" className="mt-1 bg-[#7E47B8] bg-opacity-20 text-[#7E47B8] border-[#7E47B8] border-opacity-30">
                        {category.count} catatan
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity text-[#A0A0A0] hover:text-white hover:bg-[#2A2A3A] rounded-lg">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#1E1E2E] border-[#3A3A4A]">
                      <DropdownMenuItem className="text-white hover:bg-[#2A2A3A]">Edit Kategori</DropdownMenuItem>
                      <DropdownMenuItem className="text-white hover:bg-[#2A2A3A]">Duplikat</DropdownMenuItem>
                      <DropdownMenuItem className="text-[#E74C3C] hover:bg-[#2A2A3A]">Hapus</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#A0A0A0]">{category.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 p-6 bg-[#1E1E2E] rounded-xl border border-[#3A3A4A]">
        <h3 className="text-lg font-semibold mb-4 text-white">Aksi Cepat</h3>
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={() => onNavigate('note-editor')}
            className="bg-[#7E47B8] hover:bg-[#6A3A9A] rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Catatan Baru
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onNavigate('tasks')}
            className="border-[#3A3A4A] text-[#A0A0A0] hover:bg-[#2A2A3A] hover:text-white rounded-xl"
          >
            <CheckSquare className="w-4 h-4 mr-2" />
            Tambah Tugas
          </Button>
          <Button 
            variant="outline"
            className="border-[#3A3A4A] text-[#A0A0A0] hover:bg-[#2A2A3A] hover:text-white rounded-xl"
          >
            <FileText className="w-4 h-4 mr-2" />
            Import Catatan
          </Button>
        </div>
      </div>
    </div>
  );
}