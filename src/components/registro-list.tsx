'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Registro, Categoria, UserRole } from '@/types'
import { Button } from '@/components/ui/button'
import { getCategoryColor, getPriorityColor, formatDate, truncate } from '@/lib/utils'
import { Edit, Eye, Clock, User, MapPin, RefreshCw, History } from 'lucide-react'
import { ChangeCategoryDialog } from './change-category-dialog'
import { AuditTrail } from './audit-trail'

interface RegistroListProps {
  registros: Registro[]
  categoria: Categoria
  turnoId: string
  userRole: UserRole
}

export function RegistroList({ registros, categoria, turnoId, userRole }: RegistroListProps) {
  const router = useRouter()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [changeCategoryDialog, setChangeCategoryDialog] = useState<{ isOpen: boolean; registro: Registro | null }>({
    isOpen: false,
    registro: null,
  })
  const [auditTrailDialog, setAuditTrailDialog] = useState<{ isOpen: boolean; registroId: string | null }>({
    isOpen: false,
    registroId: null,
  })
  const canEdit = userRole === 'full' || userRole === 'edit'

  const handleViewRegistro = (registroId: string) => {
    router.push(`/registro/${registroId}`)
  }

  const handleEditRegistro = (registroId: string) => {
    router.push(`/registro/${registroId}/editar`)
  }

  const handleChangeCategory = (registro: Registro) => {
    setChangeCategoryDialog({ isOpen: true, registro })
  }

  const handleViewAuditTrail = (registroId: string) => {
    setAuditTrailDialog({ isOpen: true, registroId })
  }

  const handleCategoryChangeSuccess = () => {
    // Refresh the list or update the specific registro
    // This will be handled by the parent component
  }

  const toggleExpanded = (registroId: string) => {
    setExpandedId(expandedId === registroId ? null : registroId)
  }

  const getRegistroIcon = (categoria: Categoria) => {
    switch (categoria) {
      case 'OPERADO':
        return '🟢'
      case 'PENDIENTE':
        return '🟡'
      case 'NO_QUIRURGICO':
        return '🔵'
      case 'NOVEDAD':
        return '🟣'
      default:
        return '⚪'
    }
  }

  const getRegistroDetails = (registro: Registro) => {
    switch (registro.categoria) {
      case 'OPERADO':
        return {
          title: 'Cirugía Realizada',
          value: (registro as any).cirugiaRealizada,
          subtitle: 'Diagnóstico',
          subtitleValue: (registro as any).diagnosticoPrincipal,
        }
      case 'PENDIENTE':
        return {
          title: 'Cirugía Propuesta',
          value: (registro as any).cirugiaPropuesta,
          subtitle: 'Prioridad',
          subtitleValue: (registro as any).prioridad,
          priority: (registro as any).prioridad,
        }
      case 'NO_QUIRURGICO':
        return {
          title: 'Tratamiento',
          value: (registro as any).tratamiento,
          subtitle: 'Diagnóstico',
          subtitleValue: (registro as any).diagnosticoPrincipal,
        }
      case 'NOVEDAD':
        return {
          title: 'Título',
          value: (registro as any).titulo,
          subtitle: 'Detalle',
          subtitleValue: (registro as any).detalle,
        }
      default:
        return { title: '', value: '', subtitle: '', subtitleValue: '' }
    }
  }

  if (registros.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">
          {getRegistroIcon(categoria)}
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No hay registros
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          No se encontraron registros en la categoría {categoria.toLowerCase()}.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
      {registros.map((registro) => {
        const details = getRegistroDetails(registro)
        const isExpanded = expandedId === registro.id
        
        return (
          <div
            key={registro.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xl">{getRegistroIcon(registro.categoria)}</span>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {registro.nombre}
                    </h3>
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                      ${getCategoryColor(registro.categoria)}
                    `}>
                      {registro.categoria}
                    </span>
                    {details.priority && (
                      <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${getPriorityColor(details.priority)}
                      `}>
                        {details.priority}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>RUT: {registro.rut}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{registro.edad} años</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{truncate(registro.cirujanoResponsable, 20)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>Sala {registro.salaBox}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(registro.id!)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  
                  {canEdit && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditRegistro(registro.id!)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleChangeCategory(registro)}
                        title="Cambiar categoría"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewAuditTrail(registro.id!)}
                    title="Ver historial de cambios"
                  >
                    <History className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 p-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {details.title}
                    </h4>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {details.value}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {details.subtitle}
                    </h4>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {details.subtitleValue}
                    </p>
                  </div>
                  
                  {registro.observaciones && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Observaciones
                      </h4>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {registro.observaciones}
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <div>
                      <span className="font-medium">Creado:</span> {formatDate(registro.creadoEn)}
                    </div>
                    <div>
                      <span className="font-medium">Actualizado:</span> {formatDate(registro.actualizadoEn)}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewRegistro(registro.id!)}
                      className="w-full"
                    >
                      Ver Detalles Completos
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>

    {/* Change Category Dialog */}
    {changeCategoryDialog.registro && (
      <ChangeCategoryDialog
        registro={changeCategoryDialog.registro}
        isOpen={changeCategoryDialog.isOpen}
        onClose={() => setChangeCategoryDialog({ isOpen: false, registro: null })}
        onSuccess={handleCategoryChangeSuccess}
      />
    )}

    {/* Audit Trail Dialog */}
    {auditTrailDialog.registroId && (
      <AuditTrail
        registroId={auditTrailDialog.registroId}
        isOpen={auditTrailDialog.isOpen}
        onClose={() => setAuditTrailDialog({ isOpen: false, registroId: null })}
      />
    )}
  </>
  )
}
