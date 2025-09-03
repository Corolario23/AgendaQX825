'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

// Datos de prueba
const mockRegistros = [
  {
    id: '1',
    categoria: 'Operados',
    nombre: 'Juan Pérez',
    edad: 45,
    rut: '12345678-9',
    diagnostico: 'Apendicitis aguda',
    cirujano: 'Dr. Carlos Silva',
    habitacion: '301',
    hora: '09:30',
    cirugiaRealizada: 'Apendicectomía laparoscópica',
    diagnosticoPostoperatorio: 'Paciente estable, sin complicaciones',
    comentarios: 'Cirugía completada exitosamente',
    fecha: new Date().toLocaleDateString(),
    estado: 'Completado'
  },
  {
    id: '2',
    categoria: 'Pendientes por Operar',
    nombre: 'María García',
    edad: 32,
    rut: '98765432-1',
    diagnostico: 'Embarazo de alto riesgo',
    cirujano: 'Dra. Ana Martínez',
    habitacion: '205',
    hora: '14:00',
    cirugiaPropuesta: 'Cesárea programada',
    comentarios: 'Paciente preparada para cirugía',
    fecha: new Date().toLocaleDateString(),
    estado: 'Programado'
  },
  {
    id: '3',
    categoria: 'Ingresos No Quirúrgicos',
    nombre: 'Carlos López',
    edad: 28,
    rut: '11223344-5',
    diagnostico: 'Fractura costal múltiple',
    cirujano: 'Dr. Roberto Díaz',
    habitacion: '102',
    hora: '11:15',
    tratamiento: 'Analgesia y observación',
    comentarios: 'Paciente estable, sin indicación quirúrgica',
    fecha: new Date().toLocaleDateString(),
    estado: 'En observación'
  },
  {
    id: '4',
    categoria: 'Novedades',
    cirujano: 'Dr. Pedro González',
    hora: '16:30',
    titulo: 'Cambio de horario',
    texto: 'Cirugía de colecistectomía reprogramada para mañana a las 10:00 AM',
    comentarios: 'Paciente informado del cambio',
    fecha: new Date().toLocaleDateString(),
    estado: 'Reprogramado'
  }
]

// Función para determinar el estado según la categoría
const getEstadoByCategoria = (categoria: string) => {
  switch (categoria) {
    case 'Operados':
      return 'Completado'
    case 'Pendientes por Operar':
      return 'Programado'
    case 'Ingresos No Quirúrgicos':
      return 'En observación'
    case 'Novedades':
      return 'Reprogramado'
    default:
      return 'Activo'
  }
}

  // Función para obtener el color de la categoría
  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'Operados':
        return 'bg-green-100 text-green-800'
      case 'Pendientes por Operar':
        return 'bg-blue-100 text-blue-800'
      case 'Ingresos No Quirúrgicos':
        return 'bg-yellow-100 text-yellow-800'
      case 'Novedades':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Componente de acciones directas
  const ActionButtons = ({ 
    registro,
    handleEdit,
    handleMove,
    handleDelete
  }: { 
    registro: any,
    handleEdit: (registro: any) => void,
    handleMove: (registro: any, nuevaCategoria: string) => void,
    handleDelete: (id: string) => void
  }) => {
    const categoriasDisponibles = [
      'Pendientes por Operar',
      'Operados',
      'Ingresos No Quirúrgicos',
      'Novedades'
    ].filter(cat => cat !== registro.categoria)

    return (
      <div className="flex flex-wrap gap-1">
        {/* Botón Editar */}
        <button
          onClick={() => handleEdit(registro)}
          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          title="Editar registro"
        >
          ✏️ Editar
        </button>
        
        {/* Botón Mover - Solo mostrar si NO es Novedades */}
        {registro.categoria !== 'Novedades' && (
          <div className="relative group">
            <button
              className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
              title="Mover a otra categoría"
            >
              🔄 Mover
            </button>
            
            {/* Menú desplegable de categorías */}
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="py-1">
                <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                  Mover a:
                </div>
                {categoriasDisponibles.map((categoria) => (
                  <button
                    key={categoria}
                    onClick={() => handleMove(registro, categoria)}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {categoria === 'Pendientes por Operar' && '🟦 Pendientes por Operar'}
                    {categoria === 'Operados' && '🟢 Operados'}
                    {categoria === 'Ingresos No Quirúrgicos' && '🟡 Ingresos No Quirúrgicos'}
                    {categoria === 'Novedades' && '🔴 Novedades'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Botón Eliminar */}
        <button
          onClick={() => handleDelete(registro.id)}
          className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
          title="Eliminar registro"
        >
          🗑️ Eliminar
        </button>
      </div>
    )
  }

export default function SimpleTurnoPage() {
  const [registros, setRegistros] = useState(mockRegistros)
  const [showForm, setShowForm] = useState(false)
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Pendientes por Operar')
  const [editingRegistro, setEditingRegistro] = useState<any>(null)
  const [formData, setFormData] = useState({
    // Datos comunes
    nombre: '',
    edad: '',
    rut: '',
    diagnostico: '',
    cirujano: '',
    habitacion: '',
    hora: '',
    comentarios: '',
    
    // Campos específicos por categoría
    cirugiaPropuesta: '',
    cirugiaRealizada: '',
    diagnosticoPostoperatorio: '',
    tratamiento: '',
    titulo: '',
    texto: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newRegistro = {
      id: Date.now().toString(),
      categoria: categoriaSeleccionada,
      ...formData,
      fecha: new Date().toLocaleDateString(),
      estado: getEstadoByCategoria(categoriaSeleccionada),
      hora: formData.hora || new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
    }
    setRegistros([...registros, newRegistro])
    setFormData({
      // Datos comunes
      nombre: '',
      edad: '',
      rut: '',
      diagnostico: '',
      cirujano: '',
      habitacion: '',
      hora: '',
      comentarios: '',
      
      // Campos específicos por categoría
      cirugiaPropuesta: '',
      cirugiaRealizada: '',
      diagnosticoPostoperatorio: '',
      tratamiento: '',
      titulo: '',
      texto: ''
    })
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este registro?')) {
      setRegistros(registros.filter(r => r.id !== id))
    }
  }

  const handleEdit = (registro: any) => {
    setEditingRegistro(registro)
    setFormData({
      nombre: registro.nombre || '',
      edad: registro.edad || '',
      rut: registro.rut || '',
      diagnostico: registro.diagnostico || '',
      cirujano: registro.cirujano || '',
      habitacion: registro.habitacion || '',
      hora: registro.hora || '',
      comentarios: registro.comentarios || '',
      cirugiaPropuesta: registro.cirugiaPropuesta || '',
      cirugiaRealizada: registro.cirugiaRealizada || '',
      diagnosticoPostoperatorio: registro.diagnosticoPostoperatorio || '',
      tratamiento: registro.tratamiento || '',
      titulo: registro.titulo || '',
      texto: registro.texto || ''
    })
    setCategoriaSeleccionada(registro.categoria)
    setShowForm(true)
  }

  const handleMove = (registro: any, nuevaCategoria: string) => {
    // Lógica especial: si se mueve de "Pendientes por Operar" a "Operados"
    if (registro.categoria === 'Pendientes por Operar' && nuevaCategoria === 'Operados') {
      // Abrir formulario de edición automáticamente
      setEditingRegistro(registro)
      setFormData({
        nombre: registro.nombre || '',
        edad: registro.edad || '',
        rut: registro.rut || '',
        diagnostico: registro.diagnostico || '',
        cirujano: registro.cirujano || '',
        habitacion: registro.habitacion || '',
        hora: registro.hora || '',
        comentarios: registro.comentarios || '',
        cirugiaPropuesta: registro.cirugiaPropuesta || '',
        cirugiaRealizada: '', // Campo vacío para llenar
        diagnosticoPostoperatorio: '', // Campo vacío para llenar
        tratamiento: registro.tratamiento || '',
        titulo: registro.titulo || '',
        texto: registro.texto || ''
      })
      setCategoriaSeleccionada('Operados')
      setShowForm(true)
      return
    }

    // Movimiento normal
    const registrosActualizados = registros.map(r => {
      if (r.id === registro.id) {
        return {
          ...r,
          categoria: nuevaCategoria,
          estado: getEstadoByCategoria(nuevaCategoria)
        }
      }
      return r
    })
    setRegistros(registrosActualizados)
  }

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingRegistro) {
      // Actualizar registro existente
      const registrosActualizados = registros.map(r => {
        if (r.id === editingRegistro.id) {
          return {
            ...r,
            ...formData,
            categoria: categoriaSeleccionada,
            estado: getEstadoByCategoria(categoriaSeleccionada),
            hora: formData.hora || r.hora
          }
        }
        return r
      })
      setRegistros(registrosActualizados)
      setEditingRegistro(null)
    } else {
      // Agregar nuevo registro
      const newRegistro = {
        id: Date.now().toString(),
        categoria: categoriaSeleccionada,
        ...formData,
        fecha: new Date().toLocaleDateString(),
        estado: getEstadoByCategoria(categoriaSeleccionada),
        hora: formData.hora || new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
      }
      setRegistros([...registros, newRegistro])
    }

    // Limpiar formulario
    setFormData({
      nombre: '',
      edad: '',
      rut: '',
      diagnostico: '',
      cirujano: '',
      habitacion: '',
      hora: '',
      comentarios: '',
      cirugiaPropuesta: '',
      cirugiaRealizada: '',
      diagnosticoPostoperatorio: '',
      tratamiento: '',
      titulo: '',
      texto: ''
    })
    setShowForm(false)
  }

  // Función para renderizar campos específicos según la categoría
  const renderCamposEspecificos = () => {
    switch (categoriaSeleccionada) {
      case 'Pendientes por Operar':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cirugía Propuesta</label>
            <input
              type="text"
              value={formData.cirugiaPropuesta}
              onChange={(e) => setFormData({...formData, cirugiaPropuesta: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Apendicectomía laparoscópica"
              required
            />
          </div>
        )
      
      case 'Operados':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cirugía Realizada</label>
              <input
                type="text"
                value={formData.cirugiaRealizada}
                onChange={(e) => setFormData({...formData, cirugiaRealizada: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Apendicectomía laparoscópica"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico Postoperatorio</label>
              <textarea
                value={formData.diagnosticoPostoperatorio}
                onChange={(e) => setFormData({...formData, diagnosticoPostoperatorio: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Estado del paciente después de la cirugía"
                required
              />
            </div>
          </>
        )
      
      case 'Ingresos No Quirúrgicos':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tratamiento</label>
            <textarea
              value={formData.tratamiento}
              onChange={(e) => setFormData({...formData, tratamiento: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Plan de tratamiento médico"
              required
            />
          </div>
        )
      
      case 'Novedades':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título (Opcional)</label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Cambio de horario"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Texto</label>
              <textarea
                value={formData.texto}
                onChange={(e) => setFormData({...formData, texto: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Descripción de la novedad"
                required
              />
            </div>
          </>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard-simple"
                className="text-blue-600 hover:text-blue-800"
              >
                ← Volver al Dashboard
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Turnos</h1>
                <p className="text-sm text-gray-600">Turno Actual: 08:00 AM - 16:00 PM</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Usuario: Test User</span>
              <Link 
                href="/login-simple"
                className="text-sm text-red-600 hover:text-red-800"
              >
                Cerrar Sesión
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Turno Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Turno</h3>
              <p className="mt-2 text-3xl font-bold text-blue-600">Activo</p>
              <p className="text-sm text-gray-600">Desde: 08:00 AM</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Registros</h3>
              <p className="mt-2 text-3xl font-bold text-green-600">{registros.length}</p>
              <p className="text-sm text-gray-600">Total registros</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Operados</h3>
              <p className="mt-2 text-3xl font-bold text-green-600">{registros.filter(r => r.categoria === 'Operados').length}</p>
              <p className="text-sm text-gray-600">Completados</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Pendientes</h3>
              <p className="mt-2 text-3xl font-bold text-blue-600">{registros.filter(r => r.categoria === 'Pendientes por Operar').length}</p>
              <p className="text-sm text-gray-600">Por operar</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">No Quirúrgicos</h3>
              <p className="mt-2 text-3xl font-bold text-yellow-600">{registros.filter(r => r.categoria === 'Ingresos No Quirúrgicos').length}</p>
              <p className="text-sm text-gray-600">En observación</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Novedades</h3>
              <p className="mt-2 text-3xl font-bold text-red-600">{registros.filter(r => r.categoria === 'Novedades').length}</p>
              <p className="text-sm text-gray-600">Cambios/Reprogramaciones</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Registros del Turno</h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            + Agregar Registro
          </button>
        </div>

                {/* Registro Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingRegistro ? 'Editar Registro' : 'Nuevo Registro'}
            </h3>
            <form onSubmit={handleSubmitEdit} className="space-y-4">
              {/* Selector de Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select
                  value={categoriaSeleccionada}
                  onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Pendientes por Operar">Pendientes por Operar</option>
                  <option value="Operados">Operados</option>
                  <option value="Ingresos No Quirúrgicos">Ingresos No Quirúrgicos</option>
                  <option value="Novedades">Novedades</option>
                </select>
              </div>

              {/* Campos Comunes (excepto para Novedades) */}
              {categoriaSeleccionada !== 'Novedades' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">RUT</label>
                    <input
                      type="text"
                      value={formData.rut}
                      onChange={(e) => setFormData({...formData, rut: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="12345678-9"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Edad</label>
                    <input
                      type="number"
                      value={formData.edad}
                      onChange={(e) => setFormData({...formData, edad: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      max="120"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Campos Comunes para todas las categorías */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categoriaSeleccionada !== 'Novedades' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico</label>
                      <input
                        type="text"
                        value={formData.diagnostico}
                        onChange={(e) => setFormData({...formData, diagnostico: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Habitación</label>
                      <input
                        type="text"
                        value={formData.habitacion}
                        onChange={(e) => setFormData({...formData, habitacion: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cirujano/a</label>
                  <input
                    type="text"
                    value={formData.cirujano}
                    onChange={(e) => setFormData({...formData, cirujano: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                  <input
                    type="time"
                    value={formData.hora}
                    onChange={(e) => setFormData({...formData, hora: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Campos Específicos por Categoría */}
              <div className="space-y-4">
                {renderCamposEspecificos()}
              </div>

              {/* Comentarios */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comentarios</label>
                <textarea
                  value={formData.comentarios}
                  onChange={(e) => setFormData({...formData, comentarios: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Comentarios adicionales"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingRegistro(null)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingRegistro ? 'Actualizar Registro' : 'Guardar Registro'}
                </button>
              </div>
            </form>
          </div>
        )}

                {/* Registros List */}
        <div className="space-y-6">
          {/* Pendientes por Operar - PRIORITARIOS */}
          {registros.filter(r => r.categoria === 'Pendientes por Operar').length > 0 && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
                <h3 className="text-lg font-medium text-blue-900 flex items-center">
                  <span className="w-3 h-3 bg-blue-600 rounded-full mr-3"></span>
                  Pendientes por Operar - Programación Pabellón
                </h3>
                <p className="text-sm text-blue-700 mt-1">Registros prioritarios para programación de urgencias</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Paciente</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Cirujano/a</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Hora</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Información</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {registros
                      .filter(r => r.categoria === 'Pendientes por Operar')
                      .map((registro) => (
                        <tr key={registro.id} className="hover:bg-blue-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {registro.nombre}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {registro.cirujano}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {registro.hora}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <div>
                              <div><strong>Diagnóstico:</strong> {registro.diagnostico}</div>
                              <div><strong>Cirugía:</strong> {registro.cirugiaPropuesta}</div>
                              <div><strong>Habitación:</strong> {registro.habitacion}</div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <ActionButtons 
                              registro={registro} 
                              handleEdit={handleEdit}
                              handleMove={handleMove}
                              handleDelete={handleDelete}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Operados */}
          {registros.filter(r => r.categoria === 'Operados').length > 0 && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
                <h3 className="text-lg font-medium text-green-900 flex items-center">
                  <span className="w-3 h-3 bg-green-600 rounded-full mr-3"></span>
                  Operados
                </h3>
                <p className="text-sm text-green-700 mt-1">Cirugías completadas en este turno</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-green-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Paciente</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Cirujano/a</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Hora</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Información</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {registros
                      .filter(r => r.categoria === 'Operados')
                      .map((registro) => (
                        <tr key={registro.id} className="hover:bg-green-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {registro.nombre}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {registro.cirujano}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {registro.hora}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <div>
                              <div><strong>Diagnóstico:</strong> {registro.diagnostico}</div>
                              <div><strong>Cirugía:</strong> {registro.cirugiaRealizada}</div>
                              <div><strong>Post-op:</strong> {registro.diagnosticoPostoperatorio}</div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <ActionButtons 
                              registro={registro} 
                              handleEdit={handleEdit}
                              handleMove={handleMove}
                              handleDelete={handleDelete}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Ingresos No Quirúrgicos */}
          {registros.filter(r => r.categoria === 'Ingresos No Quirúrgicos').length > 0 && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-yellow-50">
                <h3 className="text-lg font-medium text-yellow-900 flex items-center">
                  <span className="w-3 h-3 bg-yellow-600 rounded-full mr-3"></span>
                  Ingresos No Quirúrgicos
                </h3>
                <p className="text-sm text-yellow-700 mt-1">Pacientes en observación sin indicación quirúrgica</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-yellow-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-yellow-700 uppercase tracking-wider">Paciente</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-yellow-700 uppercase tracking-wider">Cirujano/a</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-yellow-700 uppercase tracking-wider">Hora</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-yellow-700 uppercase tracking-wider">Información</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-yellow-700 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {registros
                      .filter(r => r.categoria === 'Ingresos No Quirúrgicos')
                      .map((registro) => (
                        <tr key={registro.id} className="hover:bg-yellow-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {registro.nombre}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {registro.cirujano}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {registro.hora}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <div>
                              <div><strong>Diagnóstico:</strong> {registro.diagnostico}</div>
                              <div><strong>Tratamiento:</strong> {registro.tratamiento}</div>
                              <div><strong>Habitación:</strong> {registro.habitacion}</div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <ActionButtons 
                              registro={registro} 
                              handleEdit={handleEdit}
                              handleMove={handleMove}
                              handleDelete={handleDelete}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Novedades */}
          {registros.filter(r => r.categoria === 'Novedades').length > 0 && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
                <h3 className="text-lg font-medium text-red-900 flex items-center">
                  <span className="w-3 h-3 bg-red-600 rounded-full mr-3"></span>
                  Novedades
                </h3>
                <p className="text-sm text-red-700 mt-1">Eventos y cambios importantes del turno</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-red-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Cirujano/a</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Hora</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Información</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {registros
                      .filter(r => r.categoria === 'Novedades')
                      .map((registro) => (
                        <tr key={registro.id} className="hover:bg-red-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {registro.cirujano}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {registro.hora}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <div>
                              <div><strong>{registro.titulo || 'Novedad'}</strong></div>
                              <div>{registro.texto}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <ActionButtons 
                              registro={registro} 
                              handleEdit={handleEdit}
                              handleMove={handleMove}
                              handleDelete={handleDelete}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Mensaje si no hay registros */}
          {registros.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500 text-lg">No hay registros en este turno</p>
              <p className="text-gray-400 text-sm mt-2">Comienza agregando un registro usando el botón de arriba</p>
            </div>
          )}
        </div>

        {/* Cerrar Turno Button */}
        <div className="mt-8 flex justify-center">
          <button className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700">
            Cerrar Turno y Generar Reporte
          </button>
        </div>
      </main>
    </div>
  )
}
