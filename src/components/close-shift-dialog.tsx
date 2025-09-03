'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Turno, Participante, UserRole } from '@/types'
import { turnoService } from '@/lib/firestore'
import { useAuth } from '@/hooks/use-auth'
import { handleError } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import { AlertTriangle, Users, Edit, Eye, CheckCircle } from 'lucide-react'

// Schema for close shift form
const closeShiftSchema = z.object({
  confirmacion: z.boolean().refine(val => val === true, {
    message: 'Debe confirmar que desea cerrar el turno',
  }),
})

type CloseShiftFormData = z.infer<typeof closeShiftSchema>

interface CloseShiftDialogProps {
  turno: Turno
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CloseShiftDialog({ turno, isOpen, onClose, onSuccess }: CloseShiftDialogProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [participantes, setParticipantes] = useState<Participante[]>(turno.participantes || [])
  const [showParticipantesEditor, setShowParticipantesEditor] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CloseShiftFormData>({
    resolver: zodResolver(closeShiftSchema),
    defaultValues: {
      confirmacion: false,
    },
  })

  const canEditParticipantes = user?.rol === 'full'

  const handleSubmitClose = async (data: CloseShiftFormData) => {
    if (!user) {
      toast.error('Usuario no autenticado')
      return
    }

    setIsLoading(true)
    try {
      const result = await turnoService.closeTurn(
        turno.id!,
        participantes,
        user.uid,
        user.nombre
      )
      
      if (result.success) {
        toast.success(result.message)
        onSuccess()
        onClose()
      } else {
        toast.error('Error al cerrar el turno')
      }
    } catch (error) {
      toast.error(handleError(error))
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddParticipante = (participante: Participante) => {
    setParticipantes([...participantes, participante])
  }

  const handleRemoveParticipante = (index: number) => {
    setParticipantes(participantes.filter((_, i) => i !== index))
  }

  const handleUpdateParticipante = (index: number, participante: Participante) => {
    const updated = [...participantes]
    updated[index] = participante
    setParticipantes(updated)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Cerrar Turno
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Esta acción no se puede deshacer
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
            >
              ✕
            </Button>
          </div>

          {/* Información del Turno */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Información del Turno
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Inicio:</span>
                <p className="text-gray-900 dark:text-white">
                  {formatDate(turno.inicio, { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Fin:</span>
                <p className="text-gray-900 dark:text-white">
                  {turno.fin ? formatDate(turno.fin, { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'No especificado'}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(handleSubmitClose)} className="space-y-6">
            {/* Participantes y Horarios */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Participantes y Horarios
                  </h3>
                </div>
                {canEditParticipantes && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowParticipantesEditor(true)}
                    disabled={isLoading}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                )}
              </div>

              {participantes.length === 0 ? (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-2" />
                  <p>No hay participantes registrados</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {participantes.map((participante, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                {participante.nombre.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {participante.nombre}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {participante.rol} • {participante.horario}
                            </p>
                          </div>
                        </div>
                      </div>
                      {canEditParticipantes && (
                        <div className="flex items-center space-x-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // TODO: Implement edit participante
                            }}
                            disabled={isLoading}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveParticipante(index)}
                            disabled={isLoading}
                            className="text-red-600 hover:text-red-700"
                          >
                            ✕
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Resumen de Cierre */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                Resumen del Cierre
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Se generará un reporte PDF con todos los registros</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Los registros PENDIENTE se marcarán para arrastre al siguiente turno</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Se registrará la firma del usuario que cierra el turno</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>El turno quedará archivado en el historial</span>
                </li>
              </ul>
            </div>

            {/* Confirmación */}
            <div className="flex items-start space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <input
                type="checkbox"
                {...register('confirmacion')}
                className="mt-1 w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500 dark:focus:ring-yellow-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                disabled={isLoading}
              />
              <div className="flex-1">
                <label className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                  Confirmo que deseo cerrar este turno
                </label>
                <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                  Esta acción cerrará definitivamente el turno y generará el reporte final. 
                  Solo los registros PENDIENTE permanecerán visibles para el siguiente turno.
                </p>
                {errors.confirmacion && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.confirmacion.message}
                  </p>
                )}
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 text-white min-w-[120px]"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <LoadingSpinner size="sm" className="mr-2" />
                    Cerrando...
                  </div>
                ) : (
                  'Cerrar Turno'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Participantes Editor Dialog */}
      {showParticipantesEditor && (
        <ParticipantesEditor
          isOpen={showParticipantesEditor}
          onClose={() => setShowParticipantesEditor(false)}
          onAdd={handleAddParticipante}
          participantes={participantes}
        />
      )}
    </div>
  )
}

// Componente para editar participantes (reutilizado del TurnoManagement)
interface ParticipantesEditorProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (participante: Participante) => void
  participantes: Participante[]
}

function ParticipantesEditor({ isOpen, onClose, onAdd, participantes }: ParticipantesEditorProps) {
  const [nombre, setNombre] = useState('')
  const [rol, setRol] = useState('')
  const [horario, setHorario] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (nombre && rol && horario) {
      onAdd({
        nombre,
        rol,
        horario,
      })
      setNombre('')
      setRol('')
      setHorario('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Agregar Participante
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              ✕
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                placeholder="Nombre completo"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rol *
              </label>
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                required
              >
                <option value="">Seleccionar rol</option>
                <option value="Cirujano">Cirujano</option>
                <option value="Anestesiólogo">Anestesiólogo</option>
                <option value="Enfermero/a">Enfermero/a</option>
                <option value="Técnico">Técnico</option>
                <option value="Residente">Residente</option>
                <option value="Interno">Interno</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Horario *
              </label>
              <input
                type="text"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                placeholder="Ej: 08:00 - 16:00"
                required
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!nombre || !rol || !horario}
              >
                Agregar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
