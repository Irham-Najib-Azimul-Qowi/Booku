// src/components/withAuth.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/context/AuthContext'

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const AuthComponent = (props: P) => {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      // Tunggu hingga status loading selesai
      if (!loading) {
        // Jika tidak ada user (belum login), alihkan ke halaman login
        if (!user) {
          router.push('/login')
        }
      }
    }, [user, loading, router])

    // Jika masih loading, tampilkan halaman kosong atau spinner
    if (loading) {
      return null // Atau <p>Loading...</p>
    }

    // Jika sudah login, tampilkan komponen halaman yang sebenarnya
    return <WrappedComponent {...props} />
  };
  return AuthComponent;
};

export default withAuth