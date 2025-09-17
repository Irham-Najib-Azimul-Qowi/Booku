'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bell, Search, LogOut, User } from 'lucide-react'
import { useAuth } from '@/lib/context/AuthContext'
import { auth, db } from '@/lib/firebase/config'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore'

// Tipe untuk notifikasi
type Notification = {
  id: string;
  senderName: string;
  message: string;
  read: boolean;
};

export default function Navbar() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  // Mengambil notifikasi untuk pengguna saat ini
  useEffect(() => {
    if (user?.email) {
      const q = query(collection(db, "notifications"), where("recipientEmail", "==", user.email));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Notification[];
        setNotifications(notifs);
      });
      return () => unsubscribe(); // Cleanup listener
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/login')
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() === '') return;
    router.push(`/cari?q=${encodeURIComponent(searchTerm.trim())}`);
    setSearchTerm('');
  };
  
  // Fungsi untuk menandai notifikasi sebagai sudah dibaca
  const handleMarkAsRead = async (notificationId: string) => {
      const notifRef = doc(db, "notifications", notificationId);
      await updateDoc(notifRef, { read: true });
  }

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-slate-950 px-4 py-3 border-b border-slate-700/50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold">Booku</Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            <Link href="/catatan" className="hover:text-white font-bold">Catatan</Link>
            <Link href="/tugas" className="hover:text-white font-bold">Tugas</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative">
            <input 
              type="text" 
              placeholder="Cari..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-800 border border-slate-600 rounded-lg py-1.5 pl-3 pr-8 w-40 md:w-64 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" 
            />
            <button 
              type="submit" 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white" 
              title="Cari"
            >
              <Search size={16} />
            </button>
          </form>
          
          <div className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)} title="Notifikasi" className="relative text-slate-400 hover:text-white">
              <Bell size={20} />
              {notifications.some(n => !n.read) && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-950"></span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-20">
                <div className="p-3 font-semibold text-white">Notifikasi</div>
                <ul className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? notifications.map(notif => (
                    <li key={notif.id} onClick={() => handleMarkAsRead(notif.id)} className={`border-t border-slate-700 p-3 text-sm hover:bg-slate-700 cursor-pointer ${!notif.read ? 'bg-blue-500/10' : ''}`}>
                      <span className="font-bold">{notif.senderName}</span> {notif.message}
                    </li>
                  )) : <li className="p-3 text-sm text-slate-400">Tidak ada notifikasi baru.</li>}
                </ul>
              </div>
            )}
          </div>
          
          <Link href="/profil" title="Profil" className="flex items-center justify-center w-8 h-8 bg-purple-600 rounded-full"><User size={16} /></Link>
          <button onClick={handleLogout} title="Logout" className="text-slate-400 hover:text-white"><LogOut size={20} /></button>
        </div>
      </div>
    </nav>
  )
}