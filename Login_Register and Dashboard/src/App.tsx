import { useAuth } from './hooks/useAuth';
import { useRouter } from './hooks/useRouter';
import { useEffect, useCallback } from 'react';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './components/dashboard/Dashboard';
import { CategoryPage } from './components/notes/CategoryPage';
import { NoteEditor } from './components/notes/NoteEditor';
import { KanbanBoard } from './components/tasks/KanbanBoard';
import { ProfilePage } from './components/profile/ProfilePage';
import { SettingsPage } from './components/settings/SettingsPage';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const { user, login, register, logout, loading } = useAuth();
  const { currentRoute, routeParams, navigate } = useRouter();

  // Keyboard shortcuts
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ctrl+N untuk membuat catatan baru
    if (event.ctrlKey && event.key === 'n') {
      event.preventDefault();
      if (user) {
        navigate('note-editor');
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Handle routing based on auth state
  useEffect(() => {
    if (!loading) {
      const authPages = ['login', 'register', 'forgot-password'];
      
      // Redirect to dashboard if logged in and on auth pages
      if (user && authPages.includes(currentRoute)) {
        navigate('dashboard');
      }
      // Redirect to login if not logged in and on protected pages
      else if (!user && !authPages.includes(currentRoute)) {
        navigate('login');
      }
    }
  }, [user, currentRoute, loading]);

  // Show loading state
  if (loading) {
    return (
      <div className="size-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7E47B8]"></div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentRoute) {
      case 'login':
        return <LoginPage onNavigate={navigate} onLogin={login} />;
      case 'register':
        return <RegisterPage onNavigate={navigate} onRegister={register} />;
      case 'forgot-password':
        return <ForgotPasswordPage onNavigate={navigate} />;
      case 'dashboard':
        return <Dashboard onNavigate={navigate} />;
      case 'category':
        return <CategoryPage categoryId={routeParams.categoryId} onNavigate={navigate} />;
      case 'note-editor':
        return <NoteEditor noteId={routeParams.noteId} onNavigate={navigate} />;
      case 'tasks':
        return <KanbanBoard />;
      case 'profile':
        return <ProfilePage user={user} />;
      case 'settings':
        return <SettingsPage user={user} />;
      default:
        return <Dashboard onNavigate={navigate} />;
    }
  };

  // Auth pages (no layout)
  if (['login', 'register', 'forgot-password'].includes(currentRoute)) {
    return (
      <>
        {renderPage()}
        <Toaster />
      </>
    );
  }

  // Protected pages (with layout)
  return (
    <>
      <AppLayout
        currentRoute={currentRoute}
        onNavigate={navigate}
        user={user}
        onLogout={logout}
      >
        {renderPage()}
      </AppLayout>
      <Toaster />
    </>
  );
}