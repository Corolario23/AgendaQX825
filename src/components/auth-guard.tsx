'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Usuario } from '@/types'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: 'full' | 'edit' | 'view'
  fallback?: React.ReactNode
}

export function AuthGuard({ children, requiredRole, fallback }: AuthGuardProps) {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
        return
      }

      if (requiredRole) {
        const roleHierarchy = {
          'view': 1,
          'edit': 2,
          'full': 3,
        }

        const userRoleLevel = roleHierarchy[user.rol] || 0
        const requiredRoleLevel = roleHierarchy[requiredRole] || 0

        if (userRoleLevel >= requiredRoleLevel) {
          setIsAuthorized(true)
        } else {
          // User doesn't have required role
          if (fallback) {
            setIsAuthorized(true) // Show fallback instead of redirecting
          } else {
            router.push('/dashboard')
          }
        }
      } else {
        setIsAuthorized(true)
      }
    }
  }, [user, loading, requiredRole, router, fallback])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  if (!isAuthorized) {
    if (fallback) {
      return <>{fallback}</>
    }
    return null // Will redirect to dashboard
  }

  return <>{children}</>
}

// Higher-order component for role-based protection
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: 'full' | 'edit' | 'view'
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <AuthGuard requiredRole={requiredRole}>
        <Component {...props} />
      </AuthGuard>
    )
  }
}
