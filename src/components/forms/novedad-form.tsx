'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { RegistroNovedad } from '@/types'

const novedadSchema = z.object({
  pacienteId: z.string().min(1, 'ID del paciente es requerido'),
  nombre: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  edad: z.number().min(0).max(150, 'Edad debe estar entre 0 y 150'),
  rut: z.string().min(1, 'RUT es requerido'),
  cirujanoResponsable: z.string().min(1, 'Cirujano responsable es requerido'),
  salaBox: z.string().min(1, 'Sala/Box es requerido'),
  observaciones: z.string().optional(),
  tipoNovedad: z.string().min(1, 'Tipo de novedad es requerido'),
  descripcion: z.string().min(10, 'Descripción debe tener al menos 10 caracteres'),
  impacto: z.enum(['BAJO', 'MEDIO', 'ALTO']),
})

type NovedadFormData = z.infer<typeof novedadSchema>

interface NovedadFormProps {
  data: Partial<RegistroNovedad>
  onChange: (data: Partial<RegistroNovedad>) => void
  onSubmit: (data: NovedadFormData) => void
  isLoading: boolean
  onCancel: () => void
}

export function NovedadForm({ data, onChange, onSubmit, isLoading, onCancel }: NovedadFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<NovedadFormData>({
    resolver: zodResolver(novedadSchema),
    defaultValues: {
      pacienteId: data.pacienteId || '',
      nombre: data.nombre || '',
      edad: data.edad || 0,
      rut: data.rut || '',
      cirujanoResponsable: data.cirujanoResponsable || '',
      salaBox: data.salaBox || '',
      observaciones: data.observaciones || '',
      tipoNovedad: (data as any).tipoNovedad || '',
      descripcion: (data as any).descripcion || '',
      impacto: (data as any).impacto || 'MEDIO',
    },
  })

  const watchedValues = watch()

  // Update parent component when form changes
  React.useEffect(() => {
    onChange({
      ...data,
      ...watchedValues,
      categoria: 'NOVEDAD',
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
              Médico Responsable *
            </label>
            <input
              {...register('cirujanoResponsable')}
              type="text"
              id="cirujanoResponsable"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
              placeholder="Nombre del médico responsable"
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

      {/* Detalles de la Novedad */}
      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Detalles de la Novedad
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tipoNovedad" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tipo de Novedad *
            </label>
            <select
              {...register('tipoNovedad')}
              id="tipoNovedad"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
            >
              <option value="">Seleccionar tipo</option>
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
            {errors.tipoNovedad && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tipoNovedad.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="impacto" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nivel de Impacto *
            </label>
            <select
              {...register('impacto')}
              id="impacto"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
            >
              <option value="BAJO">Bajo</option>
              <option value="MEDIO">Medio</option>
              <option value="ALTO">Alto</option>
            </select>
            {errors.impacto && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.impacto.message}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Descripción Detallada *
          </label>
          <textarea
            {...register('descripcion')}
            id="descripcion"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
            placeholder="Describa detalladamente la novedad, incluyendo circunstancias, acciones tomadas y resultados..."
          />
          {errors.descripcion && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.descripcion.message}</p>
          )}
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
