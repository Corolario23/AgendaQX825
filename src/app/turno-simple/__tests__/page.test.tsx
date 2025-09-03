import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SimpleTurnoPage from '../page'

describe('SimpleTurnoPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders main sections', () => {
    render(<SimpleTurnoPage />)
    expect(screen.getByText('Gestión de Turnos')).toBeInTheDocument()
    expect(screen.getByText('Registros del Turno')).toBeInTheDocument()
    expect(screen.getByText('+ Agregar Registro')).toBeInTheDocument()
  })

  it('shows all category sections', () => {
    render(<SimpleTurnoPage />)
    expect(screen.getByText('Pendientes por Operar - Programación Pabellón')).toBeInTheDocument()
    expect(screen.getAllByText('Operados')[0]).toBeInTheDocument()
    expect(screen.getByText('Ingresos No Quirúrgicos')).toBeInTheDocument()
    expect(screen.getAllByText('Novedades')[0]).toBeInTheDocument()
  })

  it('opens form when clicking add button', () => {
    render(<SimpleTurnoPage />)
    fireEvent.click(screen.getByText('+ Agregar Registro'))
    expect(screen.getByText('Nuevo Registro')).toBeInTheDocument()
  })

  it('shows action buttons for records', () => {
    render(<SimpleTurnoPage />)
    const editButtons = screen.getAllByRole('button', { name: '✏️ Editar' })
    const deleteButtons = screen.getAllByRole('button', { name: '🗑️ Eliminar' })
    const moveButtons = screen.getAllByRole('button', { name: '🔄 Mover' })
    
    expect(editButtons.length).toBeGreaterThan(0)
    expect(deleteButtons.length).toBeGreaterThan(0)
    expect(moveButtons.length).toBeGreaterThan(0)
  })

  it('deletes a record when confirmed', () => {
    vi.stubGlobal('confirm', vi.fn(() => true))
    render(<SimpleTurnoPage />)
    
    const deleteButtons = screen.getAllByRole('button', { name: '🗑️ Eliminar' })
    const initialCount = deleteButtons.length
    
    fireEvent.click(deleteButtons[0])
    
    const afterDeleteButtons = screen.getAllByRole('button', { name: '🗑️ Eliminar' })
    expect(afterDeleteButtons.length).toBeLessThan(initialCount)
  })

  it('shows statistics', () => {
    render(<SimpleTurnoPage />)
    expect(screen.getByText('Total registros')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument() // Total count
  })
})


