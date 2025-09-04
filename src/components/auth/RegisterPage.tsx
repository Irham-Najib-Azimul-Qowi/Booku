import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Route } from '../../hooks/useRouter';

interface RegisterPageProps {
  onNavigate: (route: Route) => void;
  onRegister: (name: string, email: string, password: string) => Promise<any>;
}

export function RegisterPage({ onNavigate, onRegister }: RegisterPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      return;
    }
    
    if (password.length < 6) {
      setError('Password harus minimal 6 karakter');
      return;
    }

    setLoading(true);
    try {
      await onRegister(name, email, password);
      onNavigate('dashboard');
    } catch (error) {
      setError('Pendaftaran gagal. Coba lagi.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#121212] to-[#1E1E2E] p-4">
      <Card className="w-full max-w-md bg-[#1E1E2E] border-[#3A3A4A] shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white">Buat Akun Baru</CardTitle>
          <CardDescription className="text-[#A0A0A0]">
            Daftar untuk mulai membuat catatan dan mengatur tugas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Nama Lengkap</Label>
              <Input
                id="name"
                type="text"
                placeholder="Masukkan nama lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#2A2A3A] border-[#3A3A4A] text-white placeholder-[#A0A0A0] focus:border-[#7E47B8] rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
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
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#2A2A3A] border-[#3A3A4A] text-white placeholder-[#A0A0A0] focus:border-[#7E47B8] rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">Konfirmasi Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Masukkan password lagi"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-[#2A2A3A] border-[#3A3A4A] text-white placeholder-[#A0A0A0] focus:border-[#7E47B8] rounded-xl"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-[#E74C3C]">{error}</p>
            )}
            <Button 
              type="submit" 
              className="w-full bg-[#7E47B8] hover:bg-[#6A3A9A] rounded-xl"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Daftar'}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-[#A0A0A0]">
              Sudah punya akun?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="text-[#7E47B8] hover:underline"
              >
                Masuk di sini
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}