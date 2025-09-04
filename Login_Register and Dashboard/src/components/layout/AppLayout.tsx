import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Route } from '../../hooks/useRouter';

interface AppLayoutProps {
  children: ReactNode;
  currentRoute: Route;
  onNavigate: (route: Route) => void;
  user: any;
  onLogout: () => void;
}

export function AppLayout({ children, currentRoute, onNavigate, user, onLogout }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-[#121212] dark">
      <Sidebar currentRoute={currentRoute} onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col">
        <Navbar user={user} onNavigate={onNavigate} onLogout={onLogout} />
        <main className="flex-1 overflow-auto bg-[#121212]">
          {children}
        </main>
      </div>
    </div>
  );
}