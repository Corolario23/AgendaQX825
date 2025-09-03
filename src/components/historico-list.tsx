'use client'

import { useState } from 'react'
import { Turno, UserRole } from '@/types'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { Calendar, Clock, Users, Download, Eye, FileText, CheckCircle } from 'lucide-react'
import { TurnoDetailDialog } from './turno-detail-dialog'

interface HistoricoListProps {
  turnos: Turno[]
  userRole: UserRole
}

export function HistoricoList({ turnos, userRole }: HistoricoListProps) {
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)

  const handleViewDetails = (turno: Turno) => {
    setSelectedTurno(turno)
    setShowDetailDialog(true)
  }

  const handleDownloadReport = (turno: Turno) => {
    if (turno.reporteUrl) {
      window.open(turno.reporteUrl, '_blank')
    }
  }

  const getTurnoStatus = (turno: Turno) => {
    if (turno.cerrado) {
      return {
        text: 'Cerrado',
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        icon: CheckCircle
      }
    }
    return {
      text: 'Activo',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      icon: Clock
    }
  }

  if (turnos.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No se encontraron turnos
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            No hay turnos cerrados que coincidan con los filtros aplicados.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Turnos Cerrados ({turnos.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {turnos.map((turno) => {
            const status = getTurnoStatus(turno)
            const StatusIcon = status.icon

            return (
              <div key={turno.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex-shrink-0">
                        <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Turno del {formatDate(turno.inicio, { 
                              day: '2-digit', 
                              month: '2-digit', 
                              year: 'numeric' 
                            })}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.text}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          ID: {turno.id}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">Horario:</span>
                        <span className="text-gray-900 dark:text-white">
                          {formatDate(turno.inicio, { hour: '2-digit', minute: '2-digit' })} - {' '}
                          {turno.fin ? formatDate(turno.fin, { hour: '2-digit', minute: '2-digit' }) : 'No especificado'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">Participantes:</span>
                        <span className="text-gray-900 dark:text-white">
                          {turno.participantes?.length || 0}
                        </span>
                      </div>

                      {turno.cerradoPorNombre && (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">Cerrado por:</span>
                          <span className="text-gray-900 dark:text-white">
                            {turno.cerradoPorNombre}
                          </span>
                        </div>
                      )}
                    </div>

                    {turno.cerradoEn && (
                      <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Fecha de cierre:</span> {' '}
                        {formatDate(turno.cerradoEn, { 
                          day: '2-digit', 
                          month: '2-digit', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    )}

                    {/* Participantes preview */}
                    {turno.participantes && turno.participantes.length > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Equipo de trabajo:
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {turno.participantes.slice(0, 3).map((participante, index) => (
                            <div
                              key={index}
                              className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs"
                            >
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                              {participante.nombre} ({participante.rol})
                            </div>
                          ))}
                          {turno.participantes.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 text-gray-500 dark:text-gray-400 text-xs">
                              +{turno.participantes.length - 3} más
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(turno)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalles
                    </Button>

                    {turno.reporteUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadReport(turno)}
                        className="text-green-600 border-green-300 hover:bg-green-50 dark:text-green-400 dark:border-green-600 dark:hover:bg-green-900/20"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Detail Dialog */}
      {selectedTurno && (
        <TurnoDetailDialog
          turno={selectedTurno}
          isOpen={showDetailDialog}
          onClose={() => {
            setShowDetailDialog(false)
            setSelectedTurno(null)
          }}
        />
      )}
    </>
  )
}


