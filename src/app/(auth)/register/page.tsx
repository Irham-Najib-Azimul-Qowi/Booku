'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase/config' // <-- PERBAIKAN DI SINI
import withGuest from '@/components/withGuest'

function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password harus memiliki minimal 6 karakter.')
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // 1. Update nama tampilan di profil Auth
      await updateProfile(user, { displayName: name })

      // 2. Buat dokumen baru di koleksi 'users'
      await setDoc(doc(db, "users", user.uid), {
        displayName: name,
        email: user.email,
        bio: `Pengguna baru di NotesApp!`, // Bio default
        createdAt: new Date(),
      })
      
      router.push('/')
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email ini sudah terdaftar.')
      } else {
        setError('Gagal membuat akun. Silakan coba lagi.')
      }
    }
  }

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-center text-white">Buat Akun Baru</h1>
      <form onSubmit={handleRegister} className="space-y-6">
        <div>
          <label htmlFor="name" className="sr-only">Nama Lengkap</label>
          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Nama Lengkap"
          />
        </div>
        <div>
          <label htmlFor="email" className="sr-only">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Email"
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Password"
          />
        </div>
        {error && (
          <p className="text-sm text-red-400 text-center">{error}</p>
        )}
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg"
        >
          Daftar
        </button>
      </form>
      <p className="text-sm text-center text-slate-400">
        Sudah punya akun?{' '}
        <Link href="/login" className="font-medium text-purple-400 hover:underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  )
}

export default withGuest(RegisterPage)
