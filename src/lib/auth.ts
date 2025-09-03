import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth'
import { auth } from './firebase'
import { UserRole, Usuario } from '../types'

// User claims interface
export interface UserClaims {
  role: UserRole
  nombre: string
  email: string
}

// Get user role from custom claims
export const getUserRole = async (user: FirebaseUser): Promise<UserRole> => {
  try {
    const token = await user.getIdTokenResult()
    return token.claims?.role || 'view'
  } catch (error) {
    console.error('Error getting user role:', error)
    return 'view'
  }
}

// Get user claims
export const getUserClaims = async (user: FirebaseUser): Promise<UserClaims> => {
  try {
    const token = await user.getIdTokenResult()
    return {
      role: token.claims?.role || 'view',
      nombre: token.claims?.nombre || user.displayName || 'Usuario',
      email: user.email || ''
    }
  } catch (error) {
    console.error('Error getting user claims:', error)
    return {
      role: 'view',
      nombre: user.displayName || 'Usuario',
      email: user.email || ''
    }
  }
}

// Convert Firebase user to our User type
export const firebaseUserToUser = async (firebaseUser: FirebaseUser | null): Promise<Usuario | null> => {
  if (!firebaseUser) return null
  
  const claims = await getUserClaims(firebaseUser)
  
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    nombre: claims.nombre,
    role: claims.role,
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

// Authentication service
export const authService = {
  async signIn(email: string, password: string): Promise<Usuario> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = await firebaseUserToUser(userCredential.user)
      if (!user) throw new Error('Failed to get user data')
      return user
    } catch (error: any) {
      console.error('Sign in error:', error)
      throw new Error(error.message || 'Error al iniciar sesión')
    }
  },

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error('Sign out error:', error)
      throw new Error('Error al cerrar sesión')
    }
  },

  async getCurrentUser(): Promise<Usuario | null> {
    return new Promise((resolve) => {
      const unsubscribe = firebaseOnAuthStateChanged(auth, async (firebaseUser) => {
        unsubscribe()
        if (firebaseUser) {
          const user = await firebaseUserToUser(firebaseUser)
          resolve(user)
        } else {
          resolve(null)
        }
      })
    })
  },

  onAuthStateChange(callback: (user: Usuario | null) => void) {
    return firebaseOnAuthStateChanged(auth, async (firebaseUser) => {
      const user = await firebaseUserToUser(firebaseUser)
      callback(user)
    })
  }
}

// Role-based access control
export const rbac = {
  canEdit: (userRole: UserRole): boolean => {
    return ['full', 'edit'].includes(userRole)
  },

  canDelete: (userRole: UserRole): boolean => {
    return userRole === 'full'
  },

  canManageUsers: (userRole: UserRole): boolean => {
    return userRole === 'full'
  },

  canCloseTurn: (userRole: UserRole): boolean => {
    return ['full', 'edit'].includes(userRole)
  },

  canViewHistory: (userRole: UserRole): boolean => {
    return ['full', 'edit', 'view'].includes(userRole)
  }
}
