import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Route } from '../../hooks/useRouter';
import { ArrowLeft, Mail } from 'lucide-react';

interface ForgotPasswordPageProps {
  onNavigate: (route: Route) => void;
}

export function ForgotPasswordPage({ onNavigate }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulasi pengiriman email
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#121212] to-[#1E1E2E] p-4">
        <Card className="w-full max-w-md text-center bg-[#1E1E2E] border-[#3A3A4A] shadow-2xl">
          <CardHeader>
            <div className="mx-auto mb-4 w-12 h-12 bg-[#4CAF50] bg-opacity-20 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-[#4CAF50]" />
            </div>
            <CardTitle className="text-2xl text-white">Email Terkirim</CardTitle>
            <CardDescription className="text-[#A0A0A0]">
              Kami telah mengirim instruksi reset password ke email Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#A0A0A0] mb-6">
              Periksa inbox email {email} dan ikuti instruksi untuk mereset password Anda.
            </p>
            <Button 
              onClick={() => onNavigate('login')}
              className="w-full bg-[#7E47B8] hover:bg-[#6A3A9A] rounded-xl"
            >
              Kembali ke Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#121212] to-[#1E1E2E] p-4">
      <Card className="w-full max-w-md bg-[#1E1E2E] border-[#3A3A4A] shadow-2xl">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => onNavigate('login')}
              className="p-1 hover:bg-[#2A2A3A] rounded text-[#A0A0A0] hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <CardTitle className="text-2xl text-white">Reset Password</CardTitle>
          </div>
          <CardDescription className="text-[#A0A0A0]">
            Masukkan email Anda untuk mendapat instruksi reset password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <Button 
              type="submit" 
              className="w-full bg-[#7E47B8] hover:bg-[#6A3A9A] rounded-xl"
              disabled={loading}
            >
              {loading ? 'Mengirim...' : 'Kirim Instruksi Reset'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}