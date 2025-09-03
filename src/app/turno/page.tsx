'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { AuthGuard } from '@/components/auth-guard'
import { TurnoStatus } from '@/components/turno-status'
import { TurnoManagement } from '@/components/turno-management'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

function TurnoPageContent() {
  const { user } = useAuth()
  const [showTurnoManagement, setShowTurnoManagement] = useState(false)

  const handleTurnoSuccess = () => {
    setShowTurnoManagement(false)
    // The TurnoStatus component will refresh automatically
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Gestión de Turnos
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Administra los turnos de cirugía y sus participantes
              </p>
            </div>
            {user?.rol === 'full' && (
              <Button
                onClick={() => setShowTurnoManagement(true)}
                className="inline-flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Turno
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Estado del Turno Actual */}
            <TurnoStatus userRole={user?.rol || 'view'} />

            {/* Información Adicional */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Información sobre Turnos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Creación de Turnos
                  </h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Solo usuarios con rol "full" pueden crear turnos</li>
                    <li>• Se debe especificar fecha y hora de inicio y fin</li>
                    <li>• Se pueden agregar participantes y equipos</li>
                    <li>• Un turno activo no puede solaparse con otro</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cierre de Turnos
                  </h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Usuarios "full" y "edit" pueden cerrar turnos</li>
                    <li>• Se genera un reporte PDF automáticamente</li>
                    <li>• Los registros PENDIENTE se marcan para arrastre</li>
                    <li>• El turno queda archivado en el historial</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Permisos por Rol */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Permisos por Rol
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Rol: Full
                  </h3>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <li>✓ Crear turnos</li>
                    <li>✓ Editar turnos activos</li>
                    <li>✓ Gestionar participantes</li>
                    <li>✓ Cerrar turnos</li>
                    <li>✓ Ver historial completo</li>
                  </ul>
                </div>
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Rol: Edit
                  </h3>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <li>✗ Crear turnos</li>
                    <li>✗ Editar turnos</li>
                    <li>✗ Gestionar participantes</li>
                    <li>✓ Cerrar turnos</li>
                    <li>✓ Ver historial completo</li>
                  </ul>
                </div>
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Rol: View
                  </h3>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <li>✗ Crear turnos</li>
                    <li>✗ Editar turnos</li>
                    <li>✗ Gestionar participantes</li>
                    <li>✗ Cerrar turnos</li>
                    <li>✓ Ver turno actual</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Turno Management Dialog */}
      {showTurnoManagement && (
        <TurnoManagement
          isOpen={showTurnoManagement}
          onClose={() => setShowTurnoManagement(false)}
          onSuccess={handleTurnoSuccess}
        />
      )}
    </div>
  )
}

export default function TurnoPage() {
  return (
    <AuthGuard requiredRole="view">
      <TurnoPageContent />
    </AuthGuard>
  )
}
