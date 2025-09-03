'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { AuthGuard } from '@/components/auth-guard'
import { HistoricoList } from '@/components/historico-list'
import { HistoricoFilters } from '@/components/historico-filters'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Turno } from '@/types'
import { turnoService } from '@/lib/firestore'
import { ArrowLeft, Calendar, Download, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FiltrosHistorico {
  fechaInicio?: Date
  fechaFin?: Date
  cerradoPor?: string
  busqueda?: string
}

function HistoricoPageContent() {
  const { user } = useAuth()
  const router = useRouter()
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [loading, setLoading] = useState(true)
  const [filtros, setFiltros] = useState<FiltrosHistorico>({})
  const [estadisticas, setEstadisticas] = useState({
    totalTurnos: 0,
    turnosUltimoMes: 0,
    promedioRegistrosPorTurno: 0,
    totalRegistrosArchivados: 0
  })

  useEffect(() => {
    loadHistorico()
  }, [filtros])

  const loadHistorico = async () => {
    setLoading(true)
    try {
      const data = await turnoService.getClosedTurns(50)
      setTurnos(data)
      
      // Calcular estadísticas
      const now = new Date()
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
      
      const turnosUltimoMes = data.filter(turno => 
        turno.cerradoEn && new Date(turno.cerradoEn) >= lastMonth
      ).length

      setEstadisticas({
        totalTurnos: data.length,
        turnosUltimoMes,
        promedioRegistrosPorTurno: 0, // TODO: Calcular desde libroHistorico
        totalRegistrosArchivados: 0 // TODO: Calcular desde libroHistorico
      })
    } catch (error) {
      console.error('Error loading historico:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFiltrosChange = (newFiltros: FiltrosHistorico) => {
    setFiltros(newFiltros)
  }

  const handleExportarTodos = async () => {
    // TODO: Implementar exportación masiva
    console.log('Exportar todos los reportes')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
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
                  Histórico de Turnos
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Consulta turnos cerrados y descarga reportes
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportarTodos}
                disabled={turnos.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar Todos
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Turnos
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {estadisticas.totalTurnos}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Último Mes
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {estadisticas.turnosUltimoMes}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 dark:text-purple-400 font-semibold">📊</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Promedio Registros
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {estadisticas.promedioRegistrosPorTurno}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 dark:text-orange-400 font-semibold">📁</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Archivados
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {estadisticas.totalRegistrosArchivados}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filtros */}
            <HistoricoFilters
              onFiltrosChange={handleFiltrosChange}
              filtros={filtros}
            />

            {/* Lista de Turnos */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <HistoricoList 
                turnos={turnos}
                userRole={user?.rol || 'view'}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function HistoricoPage() {
  return (
    <AuthGuard requiredRole="view">
      <HistoricoPageContent />
    </AuthGuard>
  )
}


