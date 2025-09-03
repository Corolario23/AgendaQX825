'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { AuthGuard } from '@/components/auth-guard'
import { useQuery } from '@tanstack/react-query'
import { turnoService, realtimeService } from '@/lib/firestore'
import { Categoria, Registro, Turno } from '@/types'
import { CategoryTabs } from '@/components/category-tabs'
import { RegistroList } from '@/components/registro-list'
import { SearchFilters } from '@/components/search-filters'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Button } from '@/components/ui/button'
import { Plus, Settings } from 'lucide-react'
import { UserInfo } from '@/components/user-info'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

function DashboardContent() {
  const router = useRouter()
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState<Categoria>('OPERADO')
  const [currentTurn, setCurrentTurn] = useState<Turno | null>(null)
  const [registros, setRegistros] = useState<Registro[]>([])

  // Get current turn
  const { data: turn, isLoading: turnLoading } = useQuery({
    queryKey: ['currentTurn'],
    queryFn: turnoService.getCurrentTurn,
    staleTime: 30000, // 30 seconds
  })

  // Real-time listeners
  useEffect(() => {
    if (!turn?.id) return

    setCurrentTurn(turn)

    // Listen to registros changes
    const unsubscribe = realtimeService.onRegistrosChange(
      turn.id,
      selectedCategory,
      (newRegistros) => {
        setRegistros(newRegistros)
      }
    )

    return () => unsubscribe()
  }, [turn?.id, selectedCategory])

  const handleCreateRegistro = () => {
    router.push(`/registro/nuevo?categoria=${selectedCategory}`)
  }

  const handleGoToTurn = () => {
    router.push('/turno')
  }

  const handleGoToHistory = () => {
    router.push('/historico')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                AgendaQX
              </h1>
              {currentTurn && (
                <div className="ml-4 text-sm text-gray-600 dark:text-gray-400">
                  Turno: {formatDate(currentTurn.inicio, { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <UserInfo />
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleGoToTurn}
              >
                <Settings className="w-4 h-4 mr-2" />
                Turno
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleGoToHistory}
              >
                Histórico
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {turnLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : !currentTurn ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              No hay turno activo
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              No se encontró un turno de cirugía activo.
            </p>
            <Button onClick={() => router.push('/turno')}>
              Crear Turno
            </Button>
          </div>
        ) : (
          <>
            {/* Search and Filters */}
            <div className="mb-6">
              <SearchFilters
                turnoId={currentTurn.id!}
                onRegistrosChange={setRegistros}
              />
            </div>

            {/* Category Tabs */}
            <div className="mb-6">
              <CategoryTabs
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                registros={registros}
              />
            </div>

            {/* Create Button */}
            <div className="mb-6">
              <Button onClick={handleCreateRegistro}>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Registro
              </Button>
            </div>

            {/* Registros List */}
            <RegistroList
              registros={registros}
              categoria={selectedCategory}
              turnoId={currentTurn.id!}
              userRole={user?.rol || 'view'}
            />
          </>
        )}
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
