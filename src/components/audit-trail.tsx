'use client'

import { useState, useEffect } from 'react'
import { HistorialCambio } from '@/types'
import { historialService } from '@/lib/firestore'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { formatDate } from '@/lib/utils'
import { Clock, ArrowRight, User } from 'lucide-react'

interface AuditTrailProps {
  registroId: string
  isOpen: boolean
  onClose: () => void
}

export function AuditTrail({ registroId, isOpen, onClose }: AuditTrailProps) {
  const [changes, setChanges] = useState<HistorialCambio[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && registroId) {
      loadChanges()
    }
  }, [isOpen, registroId])

  const loadChanges = async () => {
    setLoading(true)
    try {
      const data = await historialService.getChangesByRegistro(registroId)
      setChanges(data)
    } catch (error) {
      console.error('Error loading changes:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryDisplayName = (categoria: string) => {
    switch (categoria) {
      case 'OPERADO':
        return 'Operado'
      case 'PENDIENTE':
        return 'Pendiente'
      case 'NO_QUIRURGICO':
        return 'No Quirúrgico'
      case 'NOVEDAD':
        return 'Novedad'
      default:
        return categoria
    }
  }

  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case 'OPERADO':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'NO_QUIRURGICO':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'NOVEDAD':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Historial de Cambios
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : changes.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Sin cambios registrados
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Este registro no ha tenido cambios de categoría.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {changes.map((change, index) => (
                <div
                  key={change.id || index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(change.deCategoria)}`}>
                          {getCategoryDisplayName(change.deCategoria)}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(change.aCategoria)}`}>
                          {getCategoryDisplayName(change.aCategoria)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(change.realizadoEn, { 
                          day: '2-digit', 
                          month: '2-digit', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">Realizado por:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {change.realizadoPorNombre}
                      </span>
                    </div>

                    {change.nota && (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Nota del cambio:
                        </div>
                        <div className="text-sm text-gray-900 dark:text-white">
                          {change.nota}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
