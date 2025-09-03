'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FiltrosBusqueda, Categoria, Prioridad } from '@/types'
import { registroService } from '@/lib/firestore'
import { debounce } from '@/lib/utils'

interface SearchFiltersProps {
  turnoId: string
  onRegistrosChange: (registros: any[]) => void
}

export function SearchFilters({ turnoId, onRegistrosChange }: SearchFiltersProps) {
  const [searchText, setSearchText] = useState('')
  const [filters, setFilters] = useState<FiltrosBusqueda>({})
  const [showFilters, setShowFilters] = useState(false)

  // Debounced search function
  const debouncedSearch = debounce(async (searchTerm: string, currentFilters: FiltrosBusqueda) => {
    try {
      const searchFilters: FiltrosBusqueda = {
        ...currentFilters,
        texto: searchTerm || undefined,
      }
      
      const registros = await registroService.searchRegistros(turnoId, searchFilters)
      onRegistrosChange(registros)
    } catch (error) {
      console.error('Error searching registros:', error)
    }
  }, 300)

  useEffect(() => {
    debouncedSearch(searchText, filters)
  }, [searchText, filters])

  const handleFilterChange = (key: keyof FiltrosBusqueda, value: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }))
  }

  const clearFilters = () => {
    setFilters({})
    setSearchText('')
  }

  const hasActiveFilters = searchText || Object.values(filters).some(Boolean)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex flex-col space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por nombre, RUT o cirujano..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
          {searchText && (
            <button
              onClick={() => setSearchText('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              Limpiar filtros
            </Button>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoría
              </label>
              <select
                value={filters.categoria || ''}
                onChange={(e) => handleFilterChange('categoria', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Todas las categorías</option>
                <option value="OPERADO">Operados</option>
                <option value="PENDIENTE">Pendientes</option>
                <option value="NO_QUIRURGICO">No Quirúrgicos</option>
                <option value="NOVEDAD">Novedades</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prioridad
              </label>
              <select
                value={filters.prioridad || ''}
                onChange={(e) => handleFilterChange('prioridad', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Todas las prioridades</option>
                <option value="URGENTE">Urgente</option>
                <option value="PROGRAMABLE">Programable</option>
              </select>
            </div>

            {/* Surgeon Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cirujano
              </label>
              <input
                type="text"
                placeholder="Nombre del cirujano..."
                value={filters.cirujano || ''}
                onChange={(e) => handleFilterChange('cirujano', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2">
            {searchText && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Búsqueda: "{searchText}"
              </span>
            )}
            {filters.categoria && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Categoría: {filters.categoria}
              </span>
            )}
            {filters.prioridad && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                Prioridad: {filters.prioridad}
              </span>
            )}
            {filters.cirujano && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Cirujano: {filters.cirujano}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
