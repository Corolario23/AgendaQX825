'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Categoria, Registro, RegistroOperado, RegistroPendiente, RegistroNoQuirurgico, RegistroNovedad } from '@/types'
import { OperadoForm } from './operado-form'
import { PendienteForm } from './pendiente-form'
import { NoQuirurgicoForm } from './no-quirurgico-form'
import { NovedadForm } from './novedad-form'
import { handleError } from '@/lib/utils'
import toast from 'react-hot-toast'

// Base schema for all registros
const baseSchema = z.object({
  pacienteId: z.string().min(1, 'ID del paciente es requerido'),
  nombre: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  edad: z.number().min(0).max(150, 'Edad debe estar entre 0 y 150'),
  rut: z.string().min(1, 'RUT es requerido'),
  cirujanoResponsable: z.string().min(1, 'Cirujano responsable es requerido'),
  salaBox: z.string().min(1, 'Sala/Box es requerido'),
  observaciones: z.string().optional(),
})

// Schema for OPERADO category
const operadoSchema = baseSchema.extend({
  categoria: z.literal('OPERADO'),
  horaInicio: z.string().min(1, 'Hora de inicio es requerida'),
  horaTermino: z.string().min(1, 'Hora de término es requerida'),
  tipoCirugia: z.string().min(1, 'Tipo de cirugía es requerido'),
  anestesia: z.string().min(1, 'Tipo de anestesia es requerido'),
  complicaciones: z.string().optional(),
})

// Schema for PENDIENTE category
const pendienteSchema = baseSchema.extend({
  categoria: z.literal('PENDIENTE'),
  prioridad: z.enum(['URGENTE', 'PROGRAMABLE']),
  tipoCirugia: z.string().min(1, 'Tipo de cirugía es requerido'),
  anestesia: z.string().min(1, 'Tipo de anestesia es requerido'),
  motivoEspera: z.string().optional(),
})

// Schema for NO_QUIRURGICO category
const noQuirurgicoSchema = baseSchema.extend({
  categoria: z.literal('NO_QUIRURGICO'),
  motivoIngreso: z.string().min(1, 'Motivo de ingreso es requerido'),
  especialidad: z.string().min(1, 'Especialidad es requerida'),
  tiempoEstadia: z.string().optional(),
})

// Schema for NOVEDAD category
const novedadSchema = baseSchema.extend({
  categoria: z.literal('NOVEDAD'),
  tipoNovedad: z.string().min(1, 'Tipo de novedad es requerido'),
  descripcion: z.string().min(10, 'Descripción debe tener al menos 10 caracteres'),
  impacto: z.enum(['BAJO', 'MEDIO', 'ALTO']),
})

// Union schema for all categories
const registroSchema = z.discriminatedUnion('categoria', [
  operadoSchema,
  pendienteSchema,
  noQuirurgicoSchema,
  novedadSchema,
])

type RegistroFormData = z.infer<typeof registroSchema>

interface RegistroFormProps {
  categoria: Categoria
  turnoId: string
  registro?: Registro
  onSuccess?: () => void
  onCancel?: () => void
}

export function RegistroForm({ categoria, turnoId, registro, onSuccess, onCancel }: RegistroFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<any>({
    categoria,
    pacienteId: '',
    nombre: '',
    edad: 0,
    rut: '',
    cirujanoResponsable: '',
    salaBox: '',
    observaciones: '',
  })

  // Set default values based on category
  useEffect(() => {
    const defaults: any = {
      categoria,
      pacienteId: registro?.pacienteId || '',
      nombre: registro?.nombre || '',
      edad: registro?.edad || 0,
      rut: registro?.rut || '',
      cirujanoResponsable: registro?.cirujanoResponsable || '',
      salaBox: registro?.salaBox || '',
      observaciones: registro?.observaciones || '',
    }

    // Add category-specific defaults
    switch (categoria) {
      case 'OPERADO':
        defaults.horaInicio = (registro as any)?.horaInicio || ''
        defaults.horaTermino = (registro as any)?.horaTermino || ''
        defaults.tipoCirugia = (registro as any)?.tipoCirugia || ''
        defaults.anestesia = (registro as any)?.anestesia || ''
        defaults.complicaciones = (registro as any)?.complicaciones || ''
        break
      case 'PENDIENTE':
        defaults.prioridad = (registro as any)?.prioridad || 'PROGRAMABLE'
        defaults.tipoCirugia = (registro as any)?.tipoCirugia || ''
        defaults.anestesia = (registro as any)?.anestesia || ''
        defaults.motivoEspera = (registro as any)?.motivoEspera || ''
        break
      case 'NO_QUIRURGICO':
        defaults.motivoIngreso = (registro as any)?.motivoIngreso || ''
        defaults.especialidad = (registro as any)?.especialidad || ''
        defaults.tiempoEstadia = (registro as any)?.tiempoEstadia || ''
        break
      case 'NOVEDAD':
        defaults.tipoNovedad = (registro as any)?.tipoNovedad || ''
        defaults.descripcion = (registro as any)?.descripcion || ''
        defaults.impacto = (registro as any)?.impacto || 'MEDIO'
        break
    }

    setFormData(defaults)
  }, [categoria, registro])

  const handleSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      // TODO: Implement actual Firestore operations
      console.log('Saving registro:', data)
      
      // Mock success
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success(registro ? 'Registro actualizado correctamente' : 'Registro creado correctamente')
      onSuccess?.()
    } catch (error) {
      toast.error(handleError(error))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    onCancel?.()
  }

  const renderCategoryForm = () => {
    switch (categoria) {
      case 'OPERADO':
        return (
          <OperadoForm
            data={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            onCancel={handleCancel}
          />
        )
      case 'PENDIENTE':
        return (
          <PendienteForm
            data={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            onCancel={handleCancel}
          />
        )
      case 'NO_QUIRURGICO':
        return (
          <NoQuirurgicoForm
            data={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            onCancel={handleCancel}
          />
        )
      case 'NOVEDAD':
        return (
          <NovedadForm
            data={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            onCancel={handleCancel}
          />
        )
      default:
        return <div>Categoría no válida</div>
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {registro ? 'Editar' : 'Nuevo'} Registro - {categoria}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Complete la información del paciente y los detalles específicos de la categoría
          </p>
        </div>
        
        <div className="p-6">
          {renderCategoryForm()}
        </div>
      </div>
    </div>
  )
}
