'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { rbac } from '@/lib/auth'
import { User, LogOut, Info } from 'lucide-react'

export function UserInfo() {
  const { user, signOut } = useAuth()
  const [showDetails, setShowDetails] = useState(false)

  if (!user) return null

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {user.nombre}
          </span>
          <span className={`
            inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
            ${user.rol === 'full' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
              user.rol === 'edit' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}
          `}>
            {rbac.getRoleDisplayName(user.rol)}
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          className="p-1"
        >
          <Info className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="p-1 text-red-600 hover:text-red-700"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>

      {/* User Details Dropdown */}
      {showDetails && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Información del Usuario
              </h3>
            </div>
            
            <div className="space-y-2">
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Nombre:</span>
                <p className="text-sm text-gray-900 dark:text-white">{user.nombre}</p>
              </div>
              
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Email:</span>
                <p className="text-sm text-gray-900 dark:text-white">{user.email}</p>
              </div>
              
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Rol:</span>
                <div className="flex items-center space-x-2">
                  <span className={`
                    inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                    ${user.rol === 'full' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                      user.rol === 'edit' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}
                  `}>
                    {rbac.getRoleDisplayName(user.rol)}
                  </span>
                </div>
              </div>
              
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Permisos:</span>
                <p className="text-sm text-gray-900 dark:text-white">
                  {rbac.getRoleDescription(user.rol)}
                </p>
              </div>
            </div>
            
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="w-full text-red-600 hover:text-red-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
