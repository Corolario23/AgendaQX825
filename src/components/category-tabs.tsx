'use client'

import { Categoria, Registro } from '@/types'
import { getCategoryColor } from '@/lib/utils'

interface CategoryTabsProps {
  selectedCategory: Categoria
  onCategoryChange: (category: Categoria) => void
  registros: Registro[]
}

const categories: { value: Categoria; label: string; icon: string }[] = [
  { value: 'OPERADO', label: 'Operados', icon: '🟢' },
  { value: 'PENDIENTE', label: 'Pendientes', icon: '🟡' },
  { value: 'NO_QUIRURGICO', label: 'No Quirúrgicos', icon: '🔵' },
  { value: 'NOVEDAD', label: 'Novedades', icon: '🟣' },
]

export function CategoryTabs({ selectedCategory, onCategoryChange, registros }: CategoryTabsProps) {
  const getCategoryCount = (category: Categoria) => {
    return registros.filter(registro => registro.categoria === category).length
  }

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex space-x-8">
        {categories.map((category) => {
          const count = getCategoryCount(category.value)
          const isSelected = selectedCategory === category.value
          
          return (
            <button
              key={category.value}
              onClick={() => onCategoryChange(category.value)}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
                ${isSelected
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.label}</span>
              <span className={`
                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${isSelected
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }
              `}>
                {count}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
