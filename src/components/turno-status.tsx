'use client'

import { useState, useEffect } from 'react'
import { Turno, UserRole } from '@/types'
import { turnoService } from '@/lib/firestore'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { formatDate } from '@/lib/utils'
import { Calendar, Clock, Users, Settings, Plus, Edit, CheckCircle, AlertCircle } from 'lucide-react'
import { TurnoManagement } from './turno-management'
import { CloseShiftDialog } from './close-shift-dialog'

interface TurnoStatusProps {
  userRole: UserRole
}

export function TurnoStatus({ userRole }: TurnoStatusProps) {
  const [currentTurno, setCurrentTurno] = useState<Turno | null>(null)
  const [loading, setLoading] = useState(true)
  const [showTurnoManagement, setShowTurnoManagement] = useState(false)
  const [showCloseShift, setShowCloseShift] = useState(false)

  useEffect(() => {
    loadCurrentTurno()
  }, [])

  const loadCurrentTurno = async () => {
    setLoading(true)
    try {
      const turno = await turnoService.getCurrentTurn()
      setCurrentTurno(turno)
    } catch (error) {
      console.error('Error loading current turno:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTurnoSuccess = () => {
    loadCurrentTurno()
  }

  const handleCloseShiftSuccess = () => {
    loadCurrentTurno()
  }

  const canEditTurno = userRole === 'full'
  const canCloseShift = userRole === 'full' || userRole === 'edit'

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (!currentTurno) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No hay turno activo
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            No se ha iniciado ningún turno para hoy.
          </p>
          {canEditTurno && (
            <Button
              onClick={() => setShowTurnoManagement(true)}
              className="inline-flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Nuevo Turno
            </Button>
          )}
        </div>
      </div>
    )
  }

  const isTurnoActive = !currentTurno.cerrado
  const isTurnoOverdue = currentTurno.fin ? new Date() > new Date(currentTurno.fin) : false

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Turno Actual
            </h2>
            <div className="flex items-center space-x-2">
              {isTurnoActive ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Activo
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Cerrado
                </span>
              )}
              {isTurnoOverdue && isTurnoActive && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  <Clock className="w-3 h-3 mr-1" />
                  Vencido
                </span>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>
                <span className="font-medium">Inicio:</span> {formatDate(currentTurno.inicio, { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>
                <span className="font-medium">Fin:</span> {currentTurno.fin ? formatDate(currentTurno.fin, { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'No especificado'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {canEditTurno && isTurnoActive && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTurnoManagement(true)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          )}
          
          {canCloseShift && isTurnoActive && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCloseShift(true)}
              className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
            >
              Cerrar Turno
            </Button>
          )}
        </div>
      </div>

      {/* Participantes */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Participantes ({currentTurno.participantes?.length || 0})
          </h3>
        </div>
        
        {!currentTurno.participantes || currentTurno.participantes.length === 0 ? (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            <p>No hay participantes registrados</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentTurno.participantes.map((participante, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {participante.nombre.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {participante.nombre}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {participante.rol} • {participante.horario}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Equipos */}
      {currentTurno.equipo && currentTurno.equipo.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Equipos ({currentTurno.equipo.length})
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentTurno.equipo.map((equipo, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Settings className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {equipo.nombre}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {equipo.tipo}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Información de cierre */}
      {currentTurno.cerrado && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Información de Cierre
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <span className="font-medium">Cerrado por:</span> {currentTurno.cerradoPorNombre}
              </div>
              <div>
                <span className="font-medium">Fecha de cierre:</span> {formatDate(currentTurno.cerradoEn!, { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            {currentTurno.reporteUrl && (
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(currentTurno.reporteUrl, '_blank')}
                >
                  Descargar Reporte PDF
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Diálogos */}
      {showTurnoManagement && (
        <TurnoManagement
          isOpen={showTurnoManagement}
          onClose={() => setShowTurnoManagement(false)}
          onSuccess={handleTurnoSuccess}
          turno={currentTurno}
        />
      )}

      {showCloseShift && currentTurno && (
        <CloseShiftDialog
          turno={currentTurno}
          isOpen={showCloseShift}
          onClose={() => setShowCloseShift(false)}
          onSuccess={handleCloseShiftSuccess}
        />
      )}
    </div>
  )
}
