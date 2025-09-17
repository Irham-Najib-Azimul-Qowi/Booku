// src/lib/context/AuthContext.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'

// Define the shape of the context data
type AuthContextType = {
  user: User | null;
  loading: boolean;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Create the provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Listen for changes in authentication state (login/logout)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Auth State Changed:', currentUser); 
      setUser(currentUser)
      setLoading(false)
    })

    // Clean up the listener when the component unmounts
    return () => unsubscribe()
  }, [])

  const value = { user, loading }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

// Create a custom hook to easily use the context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}