'use client'
import { useState } from 'react'
import Link from 'next/link'
import { auth } from '@/lib/firebase/config'
import { sendPasswordResetEmail } from 'firebase/auth'
import withGuest from '@/components/withGuest'

function LupaPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')

    try {
      await sendPasswordResetEmail(auth, email)
      setMessage('Email untuk reset kata sandi telah dikirim! Silakan periksa kotak masuk Anda.')
    } catch (err: any) {
      setError('Gagal mengirim email. Pastikan email yang Anda masukkan benar dan terdaftar.')
      console.error(err)
    }
  }

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-center text-white">Lupa Kata Sandi</h1>
      <p className="text-sm text-center text-slate-400">
        Masukkan email Anda, dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.
      </p>
      
      {message && <p className="text-sm text-green-400 bg-green-500/10 p-3 rounded-md text-center">{message}</p>}
      {error && <p className="text-sm text-red-400 bg-red-500/10 p-3 rounded-md text-center">{error}</p>}

      <form onSubmit={handleResetPassword} className="space-y-6">
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
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg"
        >
          Kirim Tautan Reset
        </button>
      </form>
      <p className="text-sm text-center text-slate-400">
        Ingat kata sandi Anda?{' '}
        <Link href="/login" className="font-medium text-purple-400 hover:underline">
          Kembali ke Login
        </Link>
      </p>
    </div>
  )
}

export default withGuest(LupaPasswordPage)