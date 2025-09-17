import './globals.css'
import { AuthProvider } from '@/lib/context/AuthContext'
import AppLayout from '@/components/AppLayout' // Impor AppLayout

export const metadata = {
  title: 'NotesApp',
  description: 'Aplikasi Catatan dan Tugas Kolaboratif',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-slate-900 text-white">
        <AuthProvider>
          {/* AppLayout sekarang berada di dalam AuthProvider */}
          <AppLayout>
            {children}
          </AppLayout>
        </AuthProvider>
      </body>
    </html>
  )
}
