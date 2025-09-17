'use client'
import { useState, useEffect } from 'react'
import withAuth from "@/components/withAuth"
import { useAuth } from "@/lib/context/AuthContext"
import { db } from '@/lib/firebase/config'
// Tambahkan 'setDoc' untuk membuat dokumen baru
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { User, Edit } from 'lucide-react'
import Link from 'next/link'

// Tipe untuk data profil (tetap sama)
type UserProfile = {
  displayName: string;
  email: string;
  bio: string;
};

function ProfilPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // --- LOGIKA useEffect YANG DIPERBARUI ---
  useEffect(() => {
    const fetchOrCreateProfile = async () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          // Jika profil sudah ada, tampilkan
          setProfile(docSnap.data() as UserProfile);
        } else {
          // Jika profil TIDAK ADA, buat yang baru
          console.log("Profil tidak ditemukan, membuat profil default...");
          const newProfileData: UserProfile = {
            displayName: user.displayName || "Pengguna Baru",
            email: user.email || "Tidak ada email",
            bio: "Selamat datang di NotesApp!",
          };
          // Simpan profil default ini ke Firestore
          await setDoc(userDocRef, newProfileData);
          // Set state agar UI diperbarui
          setProfile(newProfileData);
        }
      }
    };

    fetchOrCreateProfile();
  }, [user]);

  // Tampilan "Memuat..." akan tetap ada selagi proses di atas berjalan
  if (!profile) {
    return <p className="text-center p-10">Memuat profil...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <User size={48} />
          </div>
          <div className="flex-grow w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-3xl font-bold text-center sm:text-left">{profile.displayName}</h1>
                <p className="text-slate-400 text-center sm:text-left">{profile.email}</p>
              </div>
              <Link href="/pengaturan" className="flex items-center gap-2 text-sm bg-slate-700 hover:bg-slate-600 py-2 px-4 rounded-lg w-full sm:w-auto justify-center">
                <Edit size={14} />
                Edit Profil
              </Link>
            </div>
            <p className="text-slate-300 mt-4 text-center sm:text-left">{profile.bio}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Aktivitas Terbaru</h2>
        <div className="bg-slate-800 p-6 rounded-lg">
          <p className="text-slate-400">Belum ada aktivitas terbaru.</p>
        </div>
      </div>
    </div>
  )
}

export default withAuth(ProfilPage);
