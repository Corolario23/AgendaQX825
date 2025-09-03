'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { AuthGuard } from '@/components/auth-guard'
import { RegistroForm } from '@/components/forms/registro-form'
import { Categoria, Registro } from '@/types'
import { registroService } from '@/lib/firestore'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

interface RegistroPageProps {
  params: {
    action: string
  }
}

function RegistroPageContent({ params }: RegistroPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [registro, setRegistro] = useState<Registro | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  const action = params.action
  const isEdit = action !== 'nuevo'
  const registroId = isEdit ? action : null
  const categoria = searchParams.get('categoria') as Categoria

  // Check permissions
  useEffect(() => {
    if (user && (user.rol === 'view')) {
      toast.error('No tienes permisos para crear o editar registros')
      router.push('/dashboard')
    }
  }, [user, router])

  // Load registro data if editing
  useEffect(() => {
    if (isEdit && registroId) {
      const loadRegistro = async () => {
        try {
          setInitialLoading(true)
          const data = await registroService.getRegistroById(registroId)
          if (data) {
            setRegistro(data)
          } else {
            toast.error('Registro no encontrado')
            router.push('/dashboard')
          }
        } catch (error) {
          toast.error('Error al cargar el registro')
          router.push('/dashboard')
        } finally {
          setInitialLoading(false)
        }
      }
      loadRegistro()
    } else {
      setInitialLoading(false)
    }
  }, [isEdit, registroId, router])

  const handleSuccess = () => {
    toast.success(isEdit ? 'Registro actualizado correctamente' : 'Registro creado correctamente')
    router.push('/dashboard')
  }

  const handleCancel = () => {
    router.push('/dashboard')
  }

  // Show loading while checking permissions or loading data
  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            {isEdit ? 'Cargando registro...' : 'Preparando formulario...'}
          </p>
        </div>
      </div>
    )
  }

  // Validate categoria for new registros
  if (!isEdit && !categoria) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Categoría no especificada
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Debe especificar una categoría para crear un nuevo registro.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            Volver al Dashboard
          </Button>
        </div>
      </div>
    )
  }

  // Get current turn ID (mock for now)
  const currentTurnId = 'mock-turno-id'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {isEdit ? 'Editar Registro' : 'Nuevo Registro'}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isEdit 
                  ? `Editando registro ${registroId}`
                  : `Creando registro de tipo ${categoria}`
                }
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-6">
        <RegistroForm
          categoria={isEdit ? registro!.categoria : categoria}
          turnoId={currentTurnId}
          registro={registro || undefined}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </main>
    </div>
  )
}

export default function RegistroPage(props: RegistroPageProps) {
  return (
    <AuthGuard requiredRole="edit">
      <RegistroPageContent {...props} />
    </AuthGuard>
  )
}
