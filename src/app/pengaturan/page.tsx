'use client'
import { useState, useEffect } from 'react'
import withAuth from "@/components/withAuth"
import { useAuth } from "@/lib/context/AuthContext"
import { db, auth } from '@/lib/firebase/config'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { updateProfile, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

type UserProfile = {
  displayName: string;
  bio: string;
};

function PengaturanPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ displayName: '', bio: '' });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  // Mengambil data profil saat ini
  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      getDoc(userDocRef).then(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data() as UserProfile;
          setProfile({ displayName: data.displayName, bio: data.bio });
        }
      });
    }
  }, [user]);

  // Menangani pembaruan profil (nama & bio)
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      // Update di Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        displayName: profile.displayName,
        bio: profile.bio,
      });

      // Update di Firebase Auth
      await updateProfile(user, { displayName: profile.displayName });
      
      setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal memperbarui profil.' });
      console.error(error);
    }
  };

  // Menangani perubahan kata sandi
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.email) return;
    if (passwords.new !== passwords.confirm) {
      setMessage({ type: 'error', text: 'Konfirmasi kata sandi baru tidak cocok.' });
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, passwords.current);
      // Autentikasi ulang pengguna
      await reauthenticateWithCredential(user, credential);
      // Jika berhasil, perbarui kata sandi
      await updatePassword(user, passwords.new);
      
      setMessage({ type: 'success', text: 'Kata sandi berhasil diubah!' });
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal mengubah kata sandi. Pastikan kata sandi saat ini benar.' });
      console.error(error);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/profil" className="text-slate-400 hover:text-white">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold">Pengaturan</h1>
      </div>

      {message.text && (
        <div className={`p-4 rounded-md mb-6 text-sm ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
          {message.text}
        </div>
      )}

      {/* Form Informasi Akun */}
      <form onSubmit={handleUpdateProfile} className="bg-slate-800 p-8 rounded-lg space-y-6">
        <h2 className="text-xl font-semibold">Informasi Akun</h2>
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-slate-400 mb-1">Nama Lengkap</label>
          <input type="text" name="displayName" id="displayName" value={profile.displayName} onChange={handleProfileChange} className="w-full bg-slate-700 rounded-md p-2" />
        </div>
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-slate-400 mb-1">Bio</label>
          <textarea name="bio" id="bio" value={profile.bio} onChange={handleProfileChange} className="w-full bg-slate-700 rounded-md p-2" rows={3}></textarea>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg">Simpan Perubahan Profil</button>
        </div>
      </form>

      {/* Form Ubah Kata Sandi */}
      <form onSubmit={handleChangePassword} className="bg-slate-800 p-8 rounded-lg mt-8 space-y-6">
        <h2 className="text-xl font-semibold">Ubah Kata Sandi</h2>
        <div>
          <label htmlFor="current" className="block text-sm font-medium text-slate-400 mb-1">Kata Sandi Saat Ini</label>
          <input type="password" name="current" id="current" value={passwords.current} onChange={handlePasswordChange} className="w-full bg-slate-700 rounded-md p-2" required />
        </div>
        <div>
          <label htmlFor="new" className="block text-sm font-medium text-slate-400 mb-1">Kata Sandi Baru</label>
          <input type="password" name="new" id="new" value={passwords.new} onChange={handlePasswordChange} className="w-full bg-slate-700 rounded-md p-2" required />
        </div>
        <div>
          <label htmlFor="confirm" className="block text-sm font-medium text-slate-400 mb-1">Konfirmasi Kata Sandi Baru</label>
          <input type="password" name="confirm" id="confirm" value={passwords.confirm} onChange={handlePasswordChange} className="w-full bg-slate-700 rounded-md p-2" required />
        </div>
        <div className="flex justify-end">
          <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg">Ubah Kata Sandi</button>
        </div>
      </form>
    </div>
  )
}

export default withAuth(PengaturanPage);