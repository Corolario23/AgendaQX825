'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Turno, Participante, Equipo } from '@/types'
import { turnoService } from '@/lib/firestore'
import { useAuth } from '@/hooks/use-auth'
import { handleError } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import { Calendar, Clock, Users, Settings, Plus, Edit, Trash2 } from 'lucide-react'

// Schema for turno form
const turnoSchema = z.object({
  inicio: z.string().min(1, 'Fecha de inicio es requerida'),
  fin: z.string().min(1, 'Fecha de fin es requerida'),
})

type TurnoFormData = z.infer<typeof turnoSchema>

interface TurnoManagementProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  turno?: Turno
}

export function TurnoManagement({ isOpen, onClose, onSuccess, turno }: TurnoManagementProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [participantes, setParticipantes] = useState<Participante[]>([])
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [showParticipantesEditor, setShowParticipantesEditor] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<TurnoFormData>({
    resolver: zodResolver(turnoSchema),
    defaultValues: {
      inicio: turno?.inicio ? new Date(turno.inicio).toISOString().slice(0, 16) : '',
      fin: turno?.fin ? new Date(turno.fin).toISOString().slice(0, 16) : '',
    },
  })

  const watchedInicio = watch('inicio')
  const watchedFin = watch('fin')

  useEffect(() => {
    if (isOpen) {
      if (turno) {
        setParticipantes(turno.participantes || [])
        setEquipos(turno.equipo || [])
      } else {
        setParticipantes([])
        setEquipos([])
      }
    }
  }, [isOpen, turno])

  const handleSubmitTurno = async (data: TurnoFormData) => {
    if (!user) {
      toast.error('Usuario no autenticado')
      return
    }

    setIsLoading(true)
    try {
      const turnoData = {
        inicio: new Date(data.inicio),
        fin: new Date(data.fin),
        participantes,
        equipo: equipos,
        cerrado: false,
        creadoPor: user.uid,
        creadoEn: new Date(),
        actualizadoEn: new Date(),
      }

      if (turno) {
        await turnoService.updateTurn(turno.id!, turnoData)
        toast.success('Turno actualizado correctamente')
      } else {
        await turnoService.createTurn(turnoData)
        toast.success('Turno creado correctamente')
      }

      onSuccess()
      onClose()
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

  const handleAddEquipo = (equipo: Equipo) => {
    setEquipos([...equipos, equipo])
  }

  const handleRemoveEquipo = (index: number) => {
    setEquipos(equipos.filter((_, i) => i !== index))
  }

  const validateDates = () => {
    if (watchedInicio && watchedFin) {
      const inicio = new Date(watchedInicio)
      const fin = new Date(watchedFin)
      return inicio < fin
    }
    return true
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {turno ? 'Editar Turno' : 'Nuevo Turno'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
            >
              ✕
            </Button>
          </div>

          <form onSubmit={handleSubmit(handleSubmitTurno)} className="space-y-6">
            {/* Fechas del Turno */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fecha y Hora de Inicio *
                </label>
                <input
                  type="datetime-local"
                  {...register('inicio')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  disabled={isLoading}
                />
                {errors.inicio && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.inicio.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fecha y Hora de Fin *
                </label>
                <input
                  type="datetime-local"
                  {...register('fin')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  disabled={isLoading}
                />
                {errors.fin && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.fin.message}
                  </p>
                )}
              </div>
            </div>

            {!validateDates() && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-600 dark:text-red-400">
                  La fecha de fin debe ser posterior a la fecha de inicio.
                </p>
              </div>
            )}

            {/* Participantes */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Participantes
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowParticipantesEditor(true)}
                  disabled={isLoading}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Participante
                </Button>
              </div>

              {participantes.length === 0 ? (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-2" />
                  <p>No hay participantes agregados</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {participantes.map((participante, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
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
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Equipos */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Equipos
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // TODO: Implement add equipo
                  }}
                  disabled={isLoading}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Equipo
                </Button>
              </div>

              {equipos.length === 0 ? (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  <Settings className="w-12 h-12 mx-auto mb-2" />
                  <p>No hay equipos agregados</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {equipos.map((equipo, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {equipo.nombre}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {equipo.tipo}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveEquipo(index)}
                        disabled={isLoading}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
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
                disabled={isLoading || !validateDates()}
                className="min-w-[120px]"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <LoadingSpinner size="sm" className="mr-2" />
                    Guardando...
                  </div>
                ) : turno ? (
                  'Actualizar Turno'
                ) : (
                  'Crear Turno'
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

// Componente para editar participantes
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
