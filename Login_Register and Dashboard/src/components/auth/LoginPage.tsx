import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Route } from '../../hooks/useRouter';

interface LoginPageProps {
  onNavigate: (route: Route) => void;
  onLogin: (email: string, password: string) => Promise<any>;
}

export function LoginPage({ onNavigate, onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onLogin(email, password);
      onNavigate('dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#121212] to-[#1E1E2E] p-4">
      <Card className="w-full max-w-md bg-[#1E1E2E] border-[#3A3A4A] shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white">Selamat Datang</CardTitle>
          <CardDescription className="text-[#A0A0A0]">
            Masuk ke akun Anda untuk mengakses catatan dan tugas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email atau Username</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#2A2A3A] border-[#3A3A4A] text-white placeholder-[#A0A0A0] focus:border-[#7E47B8] rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#2A2A3A] border-[#3A3A4A] text-white placeholder-[#A0A0A0] focus:border-[#7E47B8] rounded-xl"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-[#7E47B8] hover:bg-[#6A3A9A] rounded-xl"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>
          <div className="mt-6 text-center space-y-2">
            <button
              onClick={() => onNavigate('forgot-password')}
              className="text-sm text-[#7E47B8] hover:underline"
            >
              Lupa Password?
            </button>
            <p className="text-sm text-[#A0A0A0]">
              Belum punya akun?{' '}
              <button
                onClick={() => onNavigate('register')}
                className="text-[#7E47B8] hover:underline"
              >
                Daftar di sini
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}