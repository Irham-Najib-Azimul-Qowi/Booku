// src/components/withGuest.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/context/AuthContext'

const withGuest = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const GuestComponent = (props: P) => {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      // Tunggu hingga status loading selesai
      if (!loading) {
        // Jika ADA user (sudah login), alihkan ke halaman utama
        if (user) {
          router.push('/')
        }
      }
    }, [user, loading, router])

    // Jika masih loading atau sudah login, jangan tampilkan apa-apa
    // karena akan segera dialihkan.
    if (loading || user) {
      return null // Atau <p>Loading...</p>
    }

    // Jika tidak ada user (tamu), tampilkan komponen halaman yang sebenarnya
    return <WrappedComponent {...props} />
  };
  return GuestComponent;
};

export default withGuest