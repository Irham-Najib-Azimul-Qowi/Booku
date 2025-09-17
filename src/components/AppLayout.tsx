'use client'

import { useAuth } from "@/lib/context/AuthContext"
import Navbar from "./Navbar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  return (
    <div className="h-full flex flex-col">
      {/* Navbar hanya akan muncul jika ada pengguna yang login */}
      {user && <Navbar />}
      
      {/* flex-grow membuat konten utama mengisi sisa ruang */}
      <main className="flex-grow">
        {children}
      </main>
    </div>
  )
}
