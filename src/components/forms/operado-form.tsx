'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { RegistroOperado } from '@/types'

const operadoSchema = z.object({
  pacienteId: z.string().min(1, 'ID del paciente es requerido'),
  nombre: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  edad: z.number().min(0).max(150, 'Edad debe estar entre 0 y 150'),
  rut: z.string().min(1, 'RUT es requerido'),
  cirujanoResponsable: z.string().min(1, 'Cirujano responsable es requerido'),
  salaBox: z.string().min(1, 'Sala/Box es requerido'),
  observaciones: z.string().optional(),
  horaInicio: z.string().min(1, 'Hora de inicio es requerida'),
  horaTermino: z.string().min(1, 'Hora de término es requerida'),
  tipoCirugia: z.string().min(1, 'Tipo de cirugía es requerido'),
  anestesia: z.string().min(1, 'Tipo de anestesia es requerido'),
  complicaciones: z.string().optional(),
})

type OperadoFormData = z.infer<typeof operadoSchema>

interface OperadoFormProps {
  data: Partial<RegistroOperado>
  onChange: (data: Partial<RegistroOperado>) => void
  onSubmit: (data: OperadoFormData) => void
  isLoading: boolean
  onCancel: () => void
}

export function OperadoForm({ data, onChange, onSubmit, isLoading, onCancel }: OperadoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<OperadoFormData>({
    resolver: zodResolver(operadoSchema),
    defaultValues: {
      pacienteId: data.pacienteId || '',
      nombre: data.nombre || '',
      edad: data.edad || 0,
      rut: data.rut || '',
      cirujanoResponsable: data.cirujanoResponsable || '',
      salaBox: data.salaBox || '',
      observaciones: data.observaciones || '',
      horaInicio: (data as any).horaInicio || '',
      horaTermino: (data as any).horaTermino || '',
      tipoCirugia: (data as any).tipoCirugia || '',
      anestesia: (data as any).anestesia || '',
      complicaciones: (data as any).complicaciones || '',
    },
  })

  const watchedValues = watch()

  // Update parent component when form changes
  React.useEffect(() => {
    onChange({
      ...data,
      ...watchedValues,
      categoria: 'OPERADO',
    })
  }, [watchedValues, onChange, data])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Información del Paciente */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Información del Paciente
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pacienteId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ID del Paciente *
            </label>
            <input
              {...register('pacienteId')}
              type="text"
              id="pacienteId"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
              placeholder="Ej: P001"
            />
            {errors.pacienteId && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.pacienteId.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre Completo *
            </label>
            <input
              {...register('nombre')}
              type="text"
              id="nombre"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
              placeholder="Nombre y apellidos"
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nombre.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="edad" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Edad *
            </label>
            <input
              {...register('edad', { valueAsNumber: true })}
              type="number"
              id="edad"
              min="0"
              max="150"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
              placeholder="Edad en años"
            />
            {errors.edad && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.edad.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="rut" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              RUT *
            </label>
            <input
              {...register('rut')}
              type="text"
              id="rut"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
              placeholder="Ej: 12345678-9"
            />
            {errors.rut && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.rut.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="cirujanoResponsable" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cirujano Responsable *
            </label>
            <input
              {...register('cirujanoResponsable')}
              type="text"
              id="cirujanoResponsable"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
              placeholder="Nombre del cirujano"
            />
            {errors.cirujanoResponsable && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.cirujanoResponsable.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="salaBox" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sala/Box *
            </label>
            <input
              {...register('salaBox')}
              type="text"
              id="salaBox"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
              placeholder="Ej: Sala 1, Box 3"
            />
            {errors.salaBox && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.salaBox.message}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Observaciones Generales
          </label>
          <textarea
            {...register('observaciones')}
            id="observaciones"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
            placeholder="Observaciones adicionales..."
          />
        </div>
      </div>

      {/* Detalles de la Cirugía */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Detalles de la Cirugía
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="horaInicio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Hora de Inicio *
            </label>
            <input
              {...register('horaInicio')}
              type="time"
              id="horaInicio"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
            />
            {errors.horaInicio && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.horaInicio.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="horaTermino" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Hora de Término *
            </label>
            <input
              {...register('horaTermino')}
              type="time"
              id="horaTermino"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
            />
            {errors.horaTermino && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.horaTermino.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="tipoCirugia" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tipo de Cirugía *
            </label>
            <input
              {...register('tipoCirugia')}
              type="text"
              id="tipoCirugia"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
              placeholder="Ej: Apendicectomía, Herniorrafia"
            />
            {errors.tipoCirugia && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tipoCirugia.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="anestesia" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tipo de Anestesia *
            </label>
            <select
              {...register('anestesia')}
              id="anestesia"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
            >
              <option value="">Seleccionar tipo</option>
              <option value="General">General</option>
              <option value="Regional">Regional</option>
              <option value="Local">Local</option>
              <option value="Sedación">Sedación</option>
            </select>
            {errors.anestesia && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.anestesia.message}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="complicaciones" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Complicaciones
          </label>
          <textarea
            {...register('complicaciones')}
            id="complicaciones"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
            placeholder="Describa cualquier complicación durante la cirugía..."
          />
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
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
            'Guardar Registro'
          )}
        </Button>
      </div>
    </form>
  )
}
