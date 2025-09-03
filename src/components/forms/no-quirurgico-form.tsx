'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { RegistroNoQuirurgico } from '@/types'

const noQuirurgicoSchema = z.object({
  pacienteId: z.string().min(1, 'ID del paciente es requerido'),
  nombre: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  edad: z.number().min(0).max(150, 'Edad debe estar entre 0 y 150'),
  rut: z.string().min(1, 'RUT es requerido'),
  cirujanoResponsable: z.string().min(1, 'Cirujano responsable es requerido'),
  salaBox: z.string().min(1, 'Sala/Box es requerido'),
  observaciones: z.string().optional(),
  motivoIngreso: z.string().min(1, 'Motivo de ingreso es requerido'),
  especialidad: z.string().min(1, 'Especialidad es requerida'),
  tiempoEstadia: z.string().optional(),
})

type NoQuirurgicoFormData = z.infer<typeof noQuirurgicoSchema>

interface NoQuirurgicoFormProps {
  data: Partial<RegistroNoQuirurgico>
  onChange: (data: Partial<RegistroNoQuirurgico>) => void
  onSubmit: (data: NoQuirurgicoFormData) => void
  isLoading: boolean
  onCancel: () => void
}

export function NoQuirurgicoForm({ data, onChange, onSubmit, isLoading, onCancel }: NoQuirurgicoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<NoQuirurgicoFormData>({
    resolver: zodResolver(noQuirurgicoSchema),
    defaultValues: {
      pacienteId: data.pacienteId || '',
      nombre: data.nombre || '',
      edad: data.edad || 0,
      rut: data.rut || '',
      cirujanoResponsable: data.cirujanoResponsable || '',
      salaBox: data.salaBox || '',
      observaciones: data.observaciones || '',
      motivoIngreso: (data as any).motivoIngreso || '',
      especialidad: (data as any).especialidad || '',
      tiempoEstadia: (data as any).tiempoEstadia || '',
    },
  })

  const watchedValues = watch()

  // Update parent component when form changes
  React.useEffect(() => {
    onChange({
      ...data,
      ...watchedValues,
      categoria: 'NO_QUIRURGICO',
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

      {/* Detalles del Ingreso No Quirúrgico */}
      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Detalles del Ingreso No Quirúrgico
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="motivoIngreso" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Motivo de Ingreso *
            </label>
            <input
              {...register('motivoIngreso')}
              type="text"
              id="motivoIngreso"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
              placeholder="Ej: Control, Observación, Tratamiento"
            />
            {errors.motivoIngreso && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.motivoIngreso.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="especialidad" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Especialidad *
            </label>
            <select
              {...register('especialidad')}
              id="especialidad"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
            >
              <option value="">Seleccionar especialidad</option>
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
            {errors.especialidad && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.especialidad.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="tiempoEstadia" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tiempo de Estadía Estimado
            </label>
            <input
              {...register('tiempoEstadia')}
              type="text"
              id="tiempoEstadia"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
              placeholder="Ej: 2-3 días, 1 semana"
            />
          </div>
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
