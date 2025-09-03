'use client'

import { useState, useEffect } from 'react'
import { Turno, Registro } from '@/types'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { formatDate, getCategoryColor } from '@/lib/utils'
import { 
  Calendar, 
  Clock, 
  Users, 
  Settings, 
  Download, 
  FileText,
  CheckCircle,
  X,
  Archive
} from 'lucide-react'
import { registroService } from '@/lib/firestore'

interface TurnoDetailDialogProps {
  turno: Turno
  isOpen: boolean
  onClose: () => void
}

export function TurnoDetailDialog({ turno, isOpen, onClose }: TurnoDetailDialogProps) {
  const [registrosArchivados, setRegistrosArchivados] = useState<Registro[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'info' | 'participantes' | 'registros'>('info')

  useEffect(() => {
    if (isOpen && turno.id) {
      loadRegistrosArchivados()
    }
  }, [isOpen, turno.id])

  const loadRegistrosArchivados = async () => {
    setLoading(true)
    try {
      // TODO: Implementar carga desde libroHistorico
      // const registros = await libroHistoricoService.getRegistrosByTurno(turno.id!)
      // setRegistrosArchivados(registros)
      
      // Mock data for now
      setRegistrosArchivados([])
    } catch (error) {
      console.error('Error loading archived registros:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadReport = () => {
    if (turno.reporteUrl) {
      window.open(turno.reporteUrl, '_blank')
    }
  }

  const getRegistrosSummary = () => {
    const summary = {
      OPERADO: 0,
      PENDIENTE: 0,
      NO_QUIRURGICO: 0,
      NOVEDAD: 0
    }

    registrosArchivados.forEach(registro => {
      summary[registro.categoria]++
    })

    return summary
  }

  if (!isOpen) return null

  const summary = getRegistrosSummary()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Detalles del Turno
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatDate(turno.inicio, { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {turno.reporteUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadReport}
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar PDF
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('info')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'info'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Información General
            </button>
            <button
              onClick={() => setActiveTab('participantes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'participantes'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Participantes
            </button>
            <button
              onClick={() => setActiveTab('registros')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'registros'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Registros Archivados
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Información del Turno
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Fecha</p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {formatDate(turno.inicio, { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Horario</p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {formatDate(turno.inicio, { hour: '2-digit', minute: '2-digit' })} - {' '}
                          {turno.fin ? formatDate(turno.fin, { hour: '2-digit', minute: '2-digit' }) : 'No especificado'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado</p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {turno.cerrado ? 'Cerrado' : 'Activo'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Información de Cierre
                  </h3>
                  
                  {turno.cerrado ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Cerrado por</p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {turno.cerradoPorNombre || 'No especificado'}
                        </p>
                      </div>

                      {turno.cerradoEn && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de cierre</p>
                          <p className="text-sm text-gray-900 dark:text-white">
                            {formatDate(turno.cerradoEn, { 
                              day: '2-digit', 
                              month: '2-digit', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      )}

                      {turno.reporteUrl && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Reporte</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownloadReport}
                            className="mt-1"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Descargar PDF
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Este turno aún no ha sido cerrado.
                    </p>
                  )}
                </div>
              </div>

              {/* Resumen de registros */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Resumen de Actividad
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Operados</p>
                    <p className="text-2xl font-semibold text-green-900 dark:text-green-100">
                      {summary.OPERADO}
                    </p>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                    <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Pendientes</p>
                    <p className="text-2xl font-semibold text-yellow-900 dark:text-yellow-100">
                      {summary.PENDIENTE}
                    </p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">No Quirúrgicos</p>
                    <p className="text-2xl font-semibold text-blue-900 dark:text-blue-100">
                      {summary.NO_QUIRURGICO}
                    </p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                    <p className="text-sm font-medium text-red-700 dark:text-red-300">Novedades</p>
                    <p className="text-2xl font-semibold text-red-900 dark:text-red-100">
                      {summary.NOVEDAD}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'participantes' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Equipo de Trabajo
              </h3>
              
              {turno.participantes && turno.participantes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {turno.participantes.map((participante, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 font-semibold">
                            {participante.nombre.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {participante.nombre}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {participante.rol}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">
                            Horario: {participante.horario}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No hay participantes registrados para este turno.
                  </p>
                </div>
              )}

              {/* Equipos */}
              {turno.equipo && turno.equipo.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Equipos Utilizados
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {turno.equipo.map((equipo, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                      >
                        <div className="flex items-center space-x-3">
                          <Settings className="w-8 h-8 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {equipo.nombre}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {equipo.tipo}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'registros' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Registros Archivados
                </h3>
                {loading && <LoadingSpinner size="sm" />}
              </div>
              
              {registrosArchivados.length > 0 ? (
                <div className="space-y-4">
                  {registrosArchivados.map((registro, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(registro.categoria)}`}>
                              {registro.categoria}
                            </span>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {registro.nombre}
                            </h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <p>RUT: {registro.rut}</p>
                            <p>Edad: {registro.edad} años</p>
                            <p>Sala: {registro.salaBox}</p>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Cirujano: {registro.cirujanoResponsable}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Archive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {loading ? 'Cargando registros archivados...' : 'No hay registros archivados disponibles.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <Button onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  )
}


