'use client'

import { useState, useEffect } from 'react'
import { authService } from '@/lib/auth'
import { Usuario } from '@/types'

export function useAuth() {
  const [user, setUser] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const user = await authService.signIn(email, password)
      setUser(user)
      return { success: true, user }
    } catch (error) {
      return { success: false, error }
    }
  }

  const signOut = async () => {
    try {
      await authService.signOut()
      setUser(null)
      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }

  return {
    user,
    loading,
    signIn,
    signOut,
  }
}
