'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'
import withGuest from '@/components/withGuest'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/')
    } catch (err) {
      setError('Email atau password yang Anda masukkan salah.')
    }
  }

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-center text-white">Selamat Datang</h1>
      <form onSubmit={handleLogin} className="space-y-6">
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
          Masuk
        </button>
      </form>
      <div className="text-sm text-center text-slate-400 space-y-2">
        <p>
          Belum punya akun?{' '}
          <Link href="/register" className="font-medium text-purple-400 hover:underline">
            Daftar di sini
          </Link>
        </p>
        {/* -- TAUTAN BARU DITAMBAHKAN DI SINI -- */}
        <p>
          <Link href="/lupa-password" className="font-medium text-purple-400 hover:underline">
            Lupa Password?
          </Link>
        </p>
      </div>
    </div>
  )
}

export default withGuest(LoginPage)