import { describe, it, expect, beforeEach, vi } from 'vitest'
import { turnoService } from '../firestore'
import { Turno, Registro } from '@/types'

// Mock Firebase
const mockFirestore = {
  collection: vi.fn(() => ({
    doc: vi.fn(() => ({
      get: vi.fn(),
      set: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      onSnapshot: vi.fn(),
    })),
    add: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
    onSnapshot: vi.fn(),
  })),
}

// Mock Cloud Functions
const mockCloudFunctions = {
  httpsCallable: vi.fn(() => vi.fn()),
}

// Mock global Firebase
;(global as any).firebase = {
  firestore: () => mockFirestore,
  functions: () => mockCloudFunctions,
}

describe('TurnoService - Cierre de Turnos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('closeTurn', () => {
    it('should close turn successfully with valid data', async () => {
      const mockCallable = vi.fn().mockResolvedValue({
        data: {
          success: true,
          reporteUrl: 'https://example.com/reporte.pdf',
          turnoId: 'closed-turno-id'
        }
      })

      mockCloudFunctions.httpsCallable.mockReturnValue(mockCallable)

      const participantes = [
        { nombre: 'Dr. Juan Pérez', rol: 'Cirujano', horario: '08:00-16:00' }
      ]

      const result = await turnoService.closeTurn(
        'test-turno-id',
        participantes,
        'user-id',
        'Dr. Juan Pérez'
      )

      expect(mockCloudFunctions.httpsCallable).toHaveBeenCalledWith('closeTurn')
      expect(mockCallable).toHaveBeenCalledWith({
        turnoId: 'test-turno-id',
        participantes,
        cerradoPor: 'user-id',
        cerradoPorNombre: 'Dr. Juan Pérez'
      })
      expect(result).toEqual({
        success: true,
        reporteUrl: 'https://example.com/reporte.pdf',
        turnoId: 'closed-turno-id'
      })
    })

    it('should handle turn closure errors', async () => {
      const mockCallable = vi.fn().mockRejectedValue(new Error('Database error'))
      mockCloudFunctions.httpsCallable.mockReturnValue(mockCallable)

      const participantes = [
        { nombre: 'Dr. Juan Pérez', rol: 'Cirujano', horario: '08:00-16:00' }
      ]

      await expect(
        turnoService.closeTurn('test-turno-id', participantes, 'user-id', 'Dr. Juan Pérez')
      ).rejects.toThrow('Database error')
    })

    it('should validate required parameters', async () => {
      const mockCallable = vi.fn()
      mockCloudFunctions.httpsCallable.mockReturnValue(mockCallable)

      // Test with missing turnoId
      await expect(
        turnoService.closeTurn('', [], 'user-id', 'Dr. Juan Pérez')
      ).rejects.toThrow('Turno ID is required')

      // Test with missing participantes
      await expect(
        turnoService.closeTurn('test-turno-id', [], 'user-id', 'Dr. Juan Pérez')
      ).rejects.toThrow('At least one participant is required')

      // Test with missing user info
      await expect(
        turnoService.closeTurn('test-turno-id', [{ nombre: 'Dr. Test', rol: 'Cirujano' }], '', '')
      ).rejects.toThrow('User information is required')
    })
  })

  describe('getCurrentTurn', () => {
    it('should return current turn with real-time updates', () => {
      const mockOnSnapshot = vi.fn()
      const mockCallback = vi.fn()

      mockFirestore.collection.mockReturnValue({
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        onSnapshot: mockOnSnapshot,
      })

      const unsubscribe = turnoService.getCurrentTurn(mockCallback)

      expect(mockFirestore.collection).toHaveBeenCalledWith('turnos')
      expect(mockOnSnapshot).toHaveBeenCalled()
      expect(typeof unsubscribe).toBe('function')
    })

    it('should handle empty current turn', () => {
      const mockOnSnapshot = vi.fn((callback) => {
        callback({ empty: true, docs: [] })
        return vi.fn()
      })

      mockFirestore.collection.mockReturnValue({
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        onSnapshot: mockOnSnapshot,
      })

      const mockCallback = vi.fn()
      turnoService.getCurrentTurn(mockCallback)

      expect(mockCallback).toHaveBeenCalledWith(null)
    })
  })

  describe('getClosedTurns', () => {
    it('should return closed turns with limit', async () => {
      const result = await turnoService.getClosedTurns(10)

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeLessThanOrEqual(10)
    })

    it('should return default limit when not specified', async () => {
      const result = await turnoService.getClosedTurns()

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeLessThanOrEqual(50) // Default limit
    })
  })

  describe('validateTurnClosure', () => {
    it('should validate turn can be closed', () => {
      const turno: Turno = {
        id: 'test-turno',
        inicio: new Date(),
        cerrado: false,
        participantes: [
          { nombre: 'Dr. Test', rol: 'Cirujano', horario: '08:00-16:00' }
        ]
      }

      const registros: Registro[] = [
        {
          id: '1',
          nombre: 'Paciente 1',
          rut: '12345678-9',
          edad: 45,
          categoria: 'OPERADO',
          salaBox: 'Sala 1',
          cirujanoResponsable: 'Dr. Test',
          fechaCreacion: new Date(),
          creadoPor: 'user-id',
          creadoPorNombre: 'Dr. Test'
        }
      ]

      const validation = turnoService.validateTurnClosure(turno, registros)

      expect(validation.canClose).toBe(true)
      expect(validation.errors).toHaveLength(0)
    })

    it('should prevent closure of already closed turn', () => {
      const turno: Turno = {
        id: 'test-turno',
        inicio: new Date(),
        cerrado: true, // Already closed
        participantes: []
      }

      const registros: Registro[] = []

      const validation = turnoService.validateTurnClosure(turno, registros)

      expect(validation.canClose).toBe(false)
      expect(validation.errors).toContain('El turno ya está cerrado')
    })

    it('should warn about empty turn but allow closure', () => {
      const turno: Turno = {
        id: 'test-turno',
        inicio: new Date(),
        cerrado: false,
        participantes: []
      }

      const registros: Registro[] = [] // Empty registros

      const validation = turnoService.validateTurnClosure(turno, registros)

      expect(validation.canClose).toBe(true)
      expect(validation.warnings).toContain('No hay registros en este turno')
    })
  })

  describe('generateTurnSummary', () => {
    it('should generate correct summary from registros', () => {
      const registros: Registro[] = [
        {
          id: '1',
          nombre: 'Paciente 1',
          rut: '12345678-9',
          edad: 45,
          categoria: 'OPERADO',
          salaBox: 'Sala 1',
          cirujanoResponsable: 'Dr. García',
          fechaCreacion: new Date(),
          creadoPor: 'user-id',
          creadoPorNombre: 'Dr. Test'
        },
        {
          id: '2',
          nombre: 'Paciente 2',
          rut: '98765432-1',
          edad: 32,
          categoria: 'PENDIENTE',
          salaBox: 'Sala 2',
          cirujanoResponsable: 'Dr. López',
          fechaCreacion: new Date(),
          creadoPor: 'user-id',
          creadoPorNombre: 'Dr. Test'
        },
        {
          id: '3',
          nombre: 'Paciente 3',
          rut: '11111111-1',
          edad: 28,
          categoria: 'OPERADO',
          salaBox: 'Sala 1',
          cirujanoResponsable: 'Dr. García',
          fechaCreacion: new Date(),
          creadoPor: 'user-id',
          creadoPorNombre: 'Dr. Test'
        }
      ]

      const summary = turnoService.generateTurnSummary(registros)

      expect(summary.totalRegistros).toBe(3)
      expect(summary.operados).toBe(2)
      expect(summary.pendientes).toBe(1)
      expect(summary.noQuirurgicos).toBe(0)
      expect(summary.novedades).toBe(0)
      expect(summary.porCirujano).toEqual({
        'Dr. García': 2,
        'Dr. López': 1
      })
    })

    it('should handle empty registros', () => {
      const registros: Registro[] = []

      const summary = turnoService.generateTurnSummary(registros)

      expect(summary.totalRegistros).toBe(0)
      expect(summary.operados).toBe(0)
      expect(summary.pendientes).toBe(0)
      expect(summary.noQuirurgicos).toBe(0)
      expect(summary.novedades).toBe(0)
      expect(summary.porCirujano).toEqual({})
    })
  })

  describe('archiveRegistros', () => {
    it('should archive registros successfully', async () => {
      const mockCallable = vi.fn().mockResolvedValue({
        data: {
          success: true,
          archivedCount: 3
        }
      })

      mockCloudFunctions.httpsCallable.mockReturnValue(mockCallable)

      const registros: Registro[] = [
        {
          id: '1',
          nombre: 'Paciente 1',
          rut: '12345678-9',
          edad: 45,
          categoria: 'OPERADO',
          salaBox: 'Sala 1',
          cirujanoResponsable: 'Dr. García',
          fechaCreacion: new Date(),
          creadoPor: 'user-id',
          creadoPorNombre: 'Dr. Test'
        }
      ]

      const result = await turnoService.archiveRegistros('test-turno-id', registros)

      expect(mockCloudFunctions.httpsCallable).toHaveBeenCalledWith('archiveRegistros')
      expect(mockCallable).toHaveBeenCalledWith({
        turnoId: 'test-turno-id',
        registros: registros.map(r => r.id)
      })
      expect(result).toEqual({
        success: true,
        archivedCount: 3
      })
    })

    it('should handle archiving errors', async () => {
      const mockCallable = vi.fn().mockRejectedValue(new Error('Archive failed'))
      mockCloudFunctions.httpsCallable.mockReturnValue(mockCallable)

      const registros: Registro[] = []

      await expect(
        turnoService.archiveRegistros('test-turno-id', registros)
      ).rejects.toThrow('Archive failed')
    })
  })

  describe('transferPendingRegistros', () => {
    it('should transfer pending registros to next turn', async () => {
      const mockCallable = vi.fn().mockResolvedValue({
        data: {
          success: true,
          transferredCount: 2
        }
      })

      mockCloudFunctions.httpsCallable.mockReturnValue(mockCallable)

      const pendingRegistros: Registro[] = [
        {
          id: '1',
          nombre: 'Paciente Pendiente 1',
          rut: '12345678-9',
          edad: 45,
          categoria: 'PENDIENTE',
          salaBox: 'Sala 1',
          cirujanoResponsable: 'Dr. García',
          fechaCreacion: new Date(),
          creadoPor: 'user-id',
          creadoPorNombre: 'Dr. Test'
        }
      ]

      const result = await turnoService.transferPendingRegistros('current-turno-id', pendingRegistros)

      expect(mockCloudFunctions.httpsCallable).toHaveBeenCalledWith('transferPendingRegistros')
      expect(mockCallable).toHaveBeenCalledWith({
        fromTurnoId: 'current-turno-id',
        registros: pendingRegistros.map(r => r.id)
      })
      expect(result).toEqual({
        success: true,
        transferredCount: 2
      })
    })
  })
})

// Helper functions for testing (these would be part of the actual service)
declare module '../firestore' {
  interface TurnoService {
    validateTurnClosure(turno: Turno, registros: Registro[]): {
      canClose: boolean
      errors: string[]
      warnings: string[]
    }
    generateTurnSummary(registros: Registro[]): {
      totalRegistros: number
      operados: number
      pendientes: number
      noQuirurgicos: number
      novedades: number
      porCirujano: Record<string, number>
    }
    archiveRegistros(turnoId: string, registros: Registro[]): Promise<any>
    transferPendingRegistros(fromTurnoId: string, registros: Registro[]): Promise<any>
  }
}


