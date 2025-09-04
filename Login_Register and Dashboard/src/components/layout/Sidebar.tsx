import { Home, FileText, Kanban, User, Settings } from 'lucide-react';
import { Route } from '../../hooks/useRouter';

interface SidebarProps {
  currentRoute: Route;
  onNavigate: (route: Route) => void;
}

const menuItems = [
  { id: 'dashboard' as Route, label: 'Beranda', icon: Home },
  { id: 'category' as Route, label: 'Catatan', icon: FileText },
  { id: 'tasks' as Route, label: 'Tugas', icon: Kanban },
  { id: 'profile' as Route, label: 'Profil', icon: User },
  { id: 'settings' as Route, label: 'Pengaturan', icon: Settings },
];

export function Sidebar({ currentRoute, onNavigate }: SidebarProps) {
  return (
    <div className="w-64 bg-[#1E1E2E] border-r border-[#3A3A4A] h-screen flex flex-col">
      <div className="p-6 border-b border-[#3A3A4A]">
        <h1 className="text-xl font-semibold text-[#7E47B8]">NotesApp</h1>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${
                    isActive 
                      ? 'bg-[#7E47B8] text-white shadow-lg' 
                      : 'text-[#A0A0A0] hover:bg-[#2A2A3A] hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}