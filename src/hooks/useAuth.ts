import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulasi check auth dari localStorage
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error parsing saved user:', error);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email: string, password: string) => {
    // Mock login
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: email,
      bio: 'Seorang pengembang yang senang membuat catatan dan mengorganisir tugas.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    return Promise.resolve(mockUser);
  };

  const register = (name: string, email: string, password: string) => {
    // Mock register
    const mockUser = {
      id: '1',
      name: name,
      email: email,
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    return Promise.resolve(mockUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return { user, login, register, logout, loading };
}