'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, Search, X, Filter } from 'lucide-react'

interface FiltrosHistorico {
  fechaInicio?: Date
  fechaFin?: Date
  cerradoPor?: string
  busqueda?: string
}

interface HistoricoFiltersProps {
  onFiltrosChange: (filtros: FiltrosHistorico) => void
  filtros: FiltrosHistorico
}

export function HistoricoFilters({ onFiltrosChange, filtros }: HistoricoFiltersProps) {
  const [localFiltros, setLocalFiltros] = useState<FiltrosHistorico>(filtros)
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    setLocalFiltros(filtros)
  }, [filtros])

  const handleInputChange = (field: keyof FiltrosHistorico, value: any) => {
    const newFiltros = { ...localFiltros, [field]: value }
    setLocalFiltros(newFiltros)
  }

  const handleApplyFilters = () => {
    onFiltrosChange(localFiltros)
  }

  const handleClearFilters = () => {
    const emptyFiltros = {}
    setLocalFiltros(emptyFiltros)
    onFiltrosChange(emptyFiltros)
  }

  const hasActiveFilters = Object.keys(localFiltros).some(key => 
    localFiltros[key as keyof FiltrosHistorico] !== undefined && 
    localFiltros[key as keyof FiltrosHistorico] !== ''
  )

  const formatDateForInput = (date?: Date) => {
    if (!date) return ''
    return date.toISOString().slice(0, 16)
  }

  const parseInputDate = (value: string) => {
    return value ? new Date(value) : undefined
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Filtros de Búsqueda
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Filter className="w-4 h-4 mr-2" />
            {showAdvanced ? 'Ocultar' : 'Avanzados'}
          </Button>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
            >
              <X className="w-4 h-4 mr-2" />
              Limpiar
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Búsqueda básica */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Búsqueda general
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por participante, ID..."
                value={localFiltros.busqueda || ''}
                onChange={(e) => handleInputChange('busqueda', e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fecha de inicio
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="datetime-local"
                value={formatDateForInput(localFiltros.fechaInicio)}
                onChange={(e) => handleInputChange('fechaInicio', parseInputDate(e.target.value))}
                className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fecha de fin
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="datetime-local"
                value={formatDateForInput(localFiltros.fechaFin)}
                onChange={(e) => handleInputChange('fechaFin', parseInputDate(e.target.value))}
                className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Filtros avanzados */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cerrado por
              </label>
              <input
                type="text"
                placeholder="Nombre del usuario"
                value={localFiltros.cerradoPor || ''}
                onChange={(e) => handleInputChange('cerradoPor', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="flex items-end">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Filtros rápidos
                </label>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const hoy = new Date()
                      const hace7Dias = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000)
                      handleInputChange('fechaInicio', hace7Dias)
                      handleInputChange('fechaFin', hoy)
                    }}
                  >
                    Últimos 7 días
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const hoy = new Date()
                      const hace30Dias = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000)
                      handleInputChange('fechaInicio', hace30Dias)
                      handleInputChange('fechaFin', hoy)
                    }}
                  >
                    Últimos 30 días
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-end space-x-4 pt-4">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            disabled={!hasActiveFilters}
          >
            Limpiar Filtros
          </Button>
          <Button onClick={handleApplyFilters}>
            Aplicar Filtros
          </Button>
        </div>
      </div>

      {/* Indicador de filtros activos */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Filter className="w-4 h-4 mr-2" />
            <span>Filtros activos:</span>
            <div className="flex flex-wrap ml-2 gap-2">
              {localFiltros.busqueda && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                  Búsqueda: {localFiltros.busqueda}
                </span>
              )}
              {localFiltros.fechaInicio && (
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs">
                  Desde: {localFiltros.fechaInicio.toLocaleDateString()}
                </span>
              )}
              {localFiltros.fechaFin && (
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs">
                  Hasta: {localFiltros.fechaFin.toLocaleDateString()}
                </span>
              )}
              {localFiltros.cerradoPor && (
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs">
                  Cerrado por: {localFiltros.cerradoPor}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


