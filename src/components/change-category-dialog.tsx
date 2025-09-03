'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Categoria, Registro, HistorialCambio } from '@/types'
import { historialService } from '@/lib/firestore'
import { useAuth } from '@/hooks/use-auth'
import { handleError } from '@/lib/utils'
import toast from 'react-hot-toast'

// Schema for category change form
const changeCategorySchema = z.object({
  nuevaCategoria: z.enum(['OPERADO', 'PENDIENTE', 'NO_QUIRURGICO', 'NOVEDAD']),
  nota: z.string().min(1, 'Debe agregar una nota explicando el cambio'),
})

type ChangeCategoryFormData = z.infer<typeof changeCategorySchema>

interface ChangeCategoryDialogProps {
  registro: Registro
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ChangeCategoryDialog({ registro, isOpen, onClose, onSuccess }: ChangeCategoryDialogProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showValidationFields, setShowValidationFields] = useState(false)
  const [validationData, setValidationData] = useState<any>({})

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<ChangeCategoryFormData>({
    resolver: zodResolver(changeCategorySchema),
    defaultValues: {
      nuevaCategoria: undefined,
      nota: '',
    },
  })

  const watchedCategoria = watch('nuevaCategoria')

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      reset()
      setShowValidationFields(false)
      setValidationData({})
    }
  }, [isOpen, reset])

  // Show validation fields when category is selected
  useEffect(() => {
    if (watchedCategoria && watchedCategoria !== registro.categoria) {
      setShowValidationFields(true)
    } else {
      setShowValidationFields(false)
    }
  }, [watchedCategoria, registro.categoria])

  const handleSubmitChange = async (data: ChangeCategoryFormData) => {
    if (!user) {
      toast.error('Usuario no autenticado')
      return
    }

    setIsLoading(true)
    try {
      // Validate required fields for the new category
      const validationErrors = validateCategoryRequirements(data.nuevaCategoria, validationData)
      if (validationErrors.length > 0) {
        toast.error(`Campos requeridos: ${validationErrors.join(', ')}`)
        return
      }

      // Create change history record
      const cambio: Omit<HistorialCambio, 'id' | 'realizadoEn'> = {
        registroId: registro.id!,
        deCategoria: registro.categoria,
        aCategoria: data.nuevaCategoria,
        realizadoPor: user.uid,
        realizadoPorNombre: user.nombre,
        nota: data.nota,
      }

      await historialService.addChange(cambio)

      // TODO: Update the registro with new category and data
      // await registroService.updateRegistro(registro.id!, {
      //   categoria: data.nuevaCategoria,
      //   ...validationData,
      //   actualizadoEn: new Date(),
      // })

      toast.success('Categoría cambiada correctamente')
      onSuccess()
      onClose()
    } catch (error) {
      toast.error(handleError(error))
    } finally {
      setIsLoading(false)
    }
  }

  const validateCategoryRequirements = (categoria: Categoria, data: any): string[] => {
    const errors: string[] = []

    switch (categoria) {
      case 'OPERADO':
        if (!data.horaInicio) errors.push('Hora de inicio')
        if (!data.horaTermino) errors.push('Hora de término')
        if (!data.tipoCirugia) errors.push('Tipo de cirugía')
        if (!data.anestesia) errors.push('Tipo de anestesia')
        break
      case 'PENDIENTE':
        if (!data.prioridad) errors.push('Prioridad')
        if (!data.tipoCirugia) errors.push('Tipo de cirugía')
        if (!data.anestesia) errors.push('Tipo de anestesia')
        break
      case 'NO_QUIRURGICO':
        if (!data.motivoIngreso) errors.push('Motivo de ingreso')
        if (!data.especialidad) errors.push('Especialidad')
        break
      case 'NOVEDAD':
        if (!data.tipoNovedad) errors.push('Tipo de novedad')
        if (!data.descripcion || data.descripcion.length < 10) errors.push('Descripción (mín 10 caracteres)')
        if (!data.impacto) errors.push('Nivel de impacto')
        break
    }

    return errors
  }

  const renderValidationFields = () => {
    if (!showValidationFields || !watchedCategoria) return null

    switch (watchedCategoria) {
      case 'OPERADO':
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Campos requeridos para OPERADO</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Hora de Inicio *
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  onChange={(e) => setValidationData({ ...validationData, horaInicio: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Hora de Término *
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  onChange={(e) => setValidationData({ ...validationData, horaTermino: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de Cirugía *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  placeholder="Ej: Apendicectomía"
                  onChange={(e) => setValidationData({ ...validationData, tipoCirugia: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de Anestesia *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  onChange={(e) => setValidationData({ ...validationData, anestesia: e.target.value })}
                >
                  <option value="">Seleccionar</option>
                  <option value="General">General</option>
                  <option value="Regional">Regional</option>
                  <option value="Local">Local</option>
                  <option value="Sedación">Sedación</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 'PENDIENTE':
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Campos requeridos para PENDIENTE</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Prioridad *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  onChange={(e) => setValidationData({ ...validationData, prioridad: e.target.value })}
                >
                  <option value="">Seleccionar</option>
                  <option value="URGENTE">Urgente</option>
                  <option value="PROGRAMABLE">Programable</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de Cirugía *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  placeholder="Ej: Herniorrafia"
                  onChange={(e) => setValidationData({ ...validationData, tipoCirugia: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de Anestesia *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  onChange={(e) => setValidationData({ ...validationData, anestesia: e.target.value })}
                >
                  <option value="">Seleccionar</option>
                  <option value="General">General</option>
                  <option value="Regional">Regional</option>
                  <option value="Local">Local</option>
                  <option value="Sedación">Sedación</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 'NO_QUIRURGICO':
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Campos requeridos para NO QUIRÚRGICO</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Motivo de Ingreso *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  placeholder="Ej: Control, Observación"
                  onChange={(e) => setValidationData({ ...validationData, motivoIngreso: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Especialidad *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  onChange={(e) => setValidationData({ ...validationData, especialidad: e.target.value })}
                >
                  <option value="">Seleccionar</option>
                  <option value="Medicina Interna">Medicina Interna</option>
                  <option value="Cardiología">Cardiología</option>
                  <option value="Neurología">Neurología</option>
                  <option value="Neumología">Neumología</option>
                  <option value="Gastroenterología">Gastroenterología</option>
                  <option value="Endocrinología">Endocrinología</option>
                  <option value="Nefrología">Nefrología</option>
                  <option value="Hematología">Hematología</option>
                  <option value="Oncología">Oncología</option>
                  <option value="Infectología">Infectología</option>
                  <option value="Reumatología">Reumatología</option>
                  <option value="Otra">Otra</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 'NOVEDAD':
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Campos requeridos para NOVEDAD</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de Novedad *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  onChange={(e) => setValidationData({ ...validationData, tipoNovedad: e.target.value })}
                >
                  <option value="">Seleccionar</option>
                  <option value="Complicación">Complicación</option>
                  <option value="Evento Adverso">Evento Adverso</option>
                  <option value="Incidente">Incidente</option>
                  <option value="Accidente">Accidente</option>
                  <option value="Cambio de Estado">Cambio de Estado</option>
                  <option value="Reingreso">Reingreso</option>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Alta Inesperada">Alta Inesperada</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descripción Detallada *
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  placeholder="Describa detalladamente la novedad..."
                  onChange={(e) => setValidationData({ ...validationData, descripcion: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nivel de Impacto *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  onChange={(e) => setValidationData({ ...validationData, impacto: e.target.value })}
                >
                  <option value="">Seleccionar</option>
                  <option value="BAJO">Bajo</option>
                  <option value="MEDIO">Medio</option>
                  <option value="ALTO">Alto</option>
                </select>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Cambiar Categoría
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

          <div className="mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Registro Actual
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Paciente:</span>
                  <p className="font-medium">{registro.nombre}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Categoría Actual:</span>
                  <p className="font-medium">{registro.categoria}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">RUT:</span>
                  <p className="font-medium">{registro.rut}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Edad:</span>
                  <p className="font-medium">{registro.edad} años</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(handleSubmitChange)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nueva Categoría *
              </label>
              <select
                {...register('nuevaCategoria')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                disabled={isLoading}
              >
                <option value="">Seleccionar nueva categoría</option>
                {(['OPERADO', 'PENDIENTE', 'NO_QUIRURGICO', 'NOVEDAD'] as Categoria[])
                  .filter(cat => cat !== registro.categoria)
                  .map(categoria => (
                    <option key={categoria} value={categoria}>
                      {categoria}
                    </option>
                  ))}
              </select>
              {errors.nuevaCategoria && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.nuevaCategoria.message}
                </p>
              )}
            </div>

            {renderValidationFields()}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nota del Cambio *
              </label>
              <textarea
                {...register('nota')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                placeholder="Explique el motivo del cambio de categoría..."
                disabled={isLoading}
              />
              {errors.nota && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.nota.message}
                </p>
              )}
            </div>

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
                className="min-w-[120px]"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <LoadingSpinner size="sm" className="mr-2" />
                    Guardando...
                  </div>
                ) : (
                  'Cambiar Categoría'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
