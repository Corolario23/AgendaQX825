import { describe, it, expect, beforeEach, vi } from 'vitest'
import { generateTurnReportPDF } from '../pdf-generator'
import { Turno, Registro } from '@/types'

// Mock PDFKit
const mockPDFDocument = {
  pipe: vi.fn().mockReturnThis(),
  fontSize: vi.fn().mockReturnThis(),
  text: vi.fn().mockReturnThis(),
  moveDown: vi.fn().mockReturnThis(),
  addPage: vi.fn().mockReturnThis(),
  end: vi.fn().mockReturnThis(),
  font: vi.fn().mockReturnThis(),
  fillColor: vi.fn().mockReturnThis(),
  rect: vi.fn().mockReturnThis(),
  fill: vi.fn().mockReturnThis(),
  strokeColor: vi.fn().mockReturnThis(),
  stroke: vi.fn().mockReturnThis(),
  lineWidth: vi.fn().mockReturnThis(),
  lineTo: vi.fn().mockReturnThis(),
  moveTo: vi.fn().mockReturnThis(),
}

vi.mock('pdfkit', () => ({
  default: vi.fn(() => mockPDFDocument)
}))

describe('PDF Generator - Turno Consolidado', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('generateTurnReportPDF', () => {
    it('should generate PDF with turn information', async () => {
      const turno: Turno = {
        id: 'turno-001',
        inicio: new Date('2024-01-15T08:00:00'),
        fin: new Date('2024-01-15T16:00:00'),
        cerrado: true,
        cerradoPor: 'user-001',
        cerradoPorNombre: 'Dr. Juan Pérez',
        cerradoEn: new Date('2024-01-15T16:30:00'),
        participantes: [
          { nombre: 'Dr. Juan Pérez', rol: 'Cirujano', horario: '08:00-16:00' },
          { nombre: 'Enf. María García', rol: 'Enfermero/a', horario: '08:00-16:00' }
        ],
        equipo: [
          { nombre: 'Monitor Paciente A', tipo: 'Monitoreo' }
        ]
      }

      const registros: Registro[] = [
        {
          id: '1',
          nombre: 'Juan Pérez',
          rut: '12345678-9',
          edad: 45,
          categoria: 'OPERADO',
          salaBox: 'Sala 1',
          cirujanoResponsable: 'Dr. García',
          fechaCreacion: new Date('2024-01-15T09:00:00'),
          creadoPor: 'user-001',
          creadoPorNombre: 'Dr. Juan Pérez'
        },
        {
          id: '2',
          nombre: 'María González',
          rut: '98765432-1',
          edad: 32,
          categoria: 'PENDIENTE',
          salaBox: 'Sala 2',
          cirujanoResponsable: 'Dr. López',
          fechaCreacion: new Date('2024-01-15T10:00:00'),
          creadoPor: 'user-001',
          creadoPorNombre: 'Dr. Juan Pérez'
        }
      ]

      const result = await generateTurnReportPDF(turno, registros)

      expect(result).toBeDefined()
      expect(mockPDFDocument.text).toHaveBeenCalledWith('CONSOLIDADO DE TURNO QUIRÚRGICO', expect.any(Object))
      expect(mockPDFDocument.text).toHaveBeenCalledWith('Turno del 15/01/2024', expect.any(Object))
      expect(mockPDFDocument.text).toHaveBeenCalledWith('Cerrado por: Dr. Juan Pérez', expect.any(Object))
    })

    it('should include all registros in PDF by category', async () => {
      const turno: Turno = {
        id: 'turno-001',
        inicio: new Date('2024-01-15T08:00:00'),
        cerrado: true,
        cerradoPor: 'user-001',
        cerradoPorNombre: 'Dr. Juan Pérez',
        cerradoEn: new Date('2024-01-15T16:30:00'),
        participantes: []
      }

      const registros: Registro[] = [
        {
          id: '1',
          nombre: 'Paciente Operado',
          rut: '12345678-9',
          edad: 45,
          categoria: 'OPERADO',
          salaBox: 'Sala 1',
          cirujanoResponsable: 'Dr. García',
          fechaCreacion: new Date(),
          creadoPor: 'user-001',
          creadoPorNombre: 'Dr. Juan Pérez'
        },
        {
          id: '2',
          nombre: 'Paciente Pendiente',
          rut: '98765432-1',
          edad: 32,
          categoria: 'PENDIENTE',
          salaBox: 'Sala 2',
          cirujanoResponsable: 'Dr. López',
          fechaCreacion: new Date(),
          creadoPor: 'user-001',
          creadoPorNombre: 'Dr. Juan Pérez'
        },
        {
          id: '3',
          nombre: 'Paciente No Quirúrgico',
          rut: '11111111-1',
          edad: 28,
          categoria: 'NO_QUIRURGICO',
          salaBox: 'Sala 3',
          cirujanoResponsable: 'Dr. Martínez',
          fechaCreacion: new Date(),
          creadoPor: 'user-001',
          creadoPorNombre: 'Dr. Juan Pérez'
        }
      ]

      await generateTurnReportPDF(turno, registros)

      // Verify category headers are included
      expect(mockPDFDocument.text).toHaveBeenCalledWith('PACIENTES OPERADOS', expect.any(Object))
      expect(mockPDFDocument.text).toHaveBeenCalledWith('PACIENTES PENDIENTES', expect.any(Object))
      expect(mockPDFDocument.text).toHaveBeenCalledWith('PACIENTES NO QUIRÚRGICOS', expect.any(Object))

      // Verify patient data is included
      expect(mockPDFDocument.text).toHaveBeenCalledWith(expect.stringContaining('Paciente Operado'), expect.any(Object))
      expect(mockPDFDocument.text).toHaveBeenCalledWith(expect.stringContaining('Paciente Pendiente'), expect.any(Object))
      expect(mockPDFDocument.text).toHaveBeenCalledWith(expect.stringContaining('Paciente No Quirúrgico'), expect.any(Object))
    })

    it('should include turn summary statistics', async () => {
      const turno: Turno = {
        id: 'turno-001',
        inicio: new Date('2024-01-15T08:00:00'),
        cerrado: true,
        cerradoPor: 'user-001',
        cerradoPorNombre: 'Dr. Juan Pérez',
        cerradoEn: new Date('2024-01-15T16:30:00'),
        participantes: []
      }

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
          creadoPor: 'user-001',
          creadoPorNombre: 'Dr. Juan Pérez'
        },
        {
          id: '2',
          nombre: 'Paciente 2',
          rut: '98765432-1',
          edad: 32,
          categoria: 'OPERADO',
          salaBox: 'Sala 1',
          cirujanoResponsable: 'Dr. García',
          fechaCreacion: new Date(),
          creadoPor: 'user-001',
          creadoPorNombre: 'Dr. Juan Pérez'
        }
      ]

      await generateTurnReportPDF(turno, registros)

      // Verify summary statistics
      expect(mockPDFDocument.text).toHaveBeenCalledWith('RESUMEN DEL TURNO', expect.any(Object))
      expect(mockPDFDocument.text).toHaveBeenCalledWith(expect.stringContaining('Total de Registros: 2'), expect.any(Object))
      expect(mockPDFDocument.text).toHaveBeenCalledWith(expect.stringContaining('Operados: 2'), expect.any(Object))
      expect(mockPDFDocument.text).toHaveBeenCalledWith(expect.stringContaining('Pendientes: 0'), expect.any(Object))
    })

    it('should include participant information', async () => {
      const turno: Turno = {
        id: 'turno-001',
        inicio: new Date('2024-01-15T08:00:00'),
        cerrado: true,
        cerradoPor: 'user-001',
        cerradoPorNombre: 'Dr. Juan Pérez',
        cerradoEn: new Date('2024-01-15T16:30:00'),
        participantes: [
          { nombre: 'Dr. Juan Pérez', rol: 'Cirujano', horario: '08:00-16:00' },
          { nombre: 'Enf. María García', rol: 'Enfermero/a', horario: '08:00-16:00' },
          { nombre: 'Tec. Roberto Chen', rol: 'Técnico', horario: '08:00-12:00' }
        ]
      }

      const registros: Registro[] = []

      await generateTurnReportPDF(turno, registros)

      // Verify participant section
      expect(mockPDFDocument.text).toHaveBeenCalledWith('EQUIPO DE TRABAJO', expect.any(Object))
      expect(mockPDFDocument.text).toHaveBeenCalledWith(expect.stringContaining('Dr. Juan Pérez'), expect.any(Object))
      expect(mockPDFDocument.text).toHaveBeenCalledWith(expect.stringContaining('Enf. María García'), expect.any(Object))
      expect(mockPDFDocument.text).toHaveBeenCalledWith(expect.stringContaining('Tec. Roberto Chen'), expect.any(Object))
    })

    it('should handle empty registros gracefully', async () => {
      const turno: Turno = {
        id: 'turno-001',
        inicio: new Date('2024-01-15T08:00:00'),
        cerrado: true,
        cerradoPor: 'user-001',
        cerradoPorNombre: 'Dr. Juan Pérez',
        cerradoEn: new Date('2024-01-15T16:30:00'),
        participantes: []
      }

      const registros: Registro[] = []

      const result = await generateTurnReportPDF(turno, registros)

      expect(result).toBeDefined()
      expect(mockPDFDocument.text).toHaveBeenCalledWith('No hay registros en este turno', expect.any(Object))
    })

    it('should include signature section', async () => {
      const turno: Turno = {
        id: 'turno-001',
        inicio: new Date('2024-01-15T08:00:00'),
        cerrado: true,
        cerradoPor: 'user-001',
        cerradoPorNombre: 'Dr. Juan Pérez',
        cerradoEn: new Date('2024-01-15T16:30:00'),
        participantes: []
      }

      const registros: Registro[] = []

      await generateTurnReportPDF(turno, registros)

      // Verify signature section
      expect(mockPDFDocument.text).toHaveBeenCalledWith('FIRMA DEL RESPONSABLE', expect.any(Object))
      expect(mockPDFDocument.text).toHaveBeenCalledWith('Dr. Juan Pérez', expect.any(Object))
      expect(mockPDFDocument.text).toHaveBeenCalledWith(expect.stringContaining('15/01/2024'), expect.any(Object))
    })

    it('should handle PDF generation errors', async () => {
      // Mock PDF generation error
      mockPDFDocument.end.mockImplementation(() => {
        throw new Error('PDF generation failed')
      })

      const turno: Turno = {
        id: 'turno-001',
        inicio: new Date('2024-01-15T08:00:00'),
        cerrado: true,
        cerradoPor: 'user-001',
        cerradoPorNombre: 'Dr. Juan Pérez',
        cerradoEn: new Date('2024-01-15T16:30:00'),
        participantes: []
      }

      const registros: Registro[] = []

      await expect(generateTurnReportPDF(turno, registros)).rejects.toThrow('PDF generation failed')
    })

    it('should format dates correctly in PDF', async () => {
      const turno: Turno = {
        id: 'turno-001',
        inicio: new Date('2024-01-15T08:00:00'),
        fin: new Date('2024-01-15T16:00:00'),
        cerrado: true,
        cerradoPor: 'user-001',
        cerradoPorNombre: 'Dr. Juan Pérez',
        cerradoEn: new Date('2024-01-15T16:30:00'),
        participantes: []
      }

      const registros: Registro[] = []

      await generateTurnReportPDF(turno, registros)

      // Verify date formatting
      expect(mockPDFDocument.text).toHaveBeenCalledWith('Turno del 15/01/2024', expect.any(Object))
      expect(mockPDFDocument.text).toHaveBeenCalledWith('Horario: 08:00 - 16:00', expect.any(Object))
      expect(mockPDFDocument.text).toHaveBeenCalledWith('Cerrado el: 15/01/2024 a las 16:30', expect.any(Object))
    })

    it('should include equipment information when available', async () => {
      const turno: Turno = {
        id: 'turno-001',
        inicio: new Date('2024-01-15T08:00:00'),
        cerrado: true,
        cerradoPor: 'user-001',
        cerradoPorNombre: 'Dr. Juan Pérez',
        cerradoEn: new Date('2024-01-15T16:30:00'),
        participantes: [],
        equipo: [
          { nombre: 'Monitor Paciente A', tipo: 'Monitoreo' },
          { nombre: 'Ventilador Mecánico B', tipo: 'Respiratorio' }
        ]
      }

      const registros: Registro[] = []

      await generateTurnReportPDF(turno, registros)

      // Verify equipment section
      expect(mockPDFDocument.text).toHaveBeenCalledWith('EQUIPOS UTILIZADOS', expect.any(Object))
      expect(mockPDFDocument.text).toHaveBeenCalledWith(expect.stringContaining('Monitor Paciente A'), expect.any(Object))
      expect(mockPDFDocument.text).toHaveBeenCalledWith(expect.stringContaining('Ventilador Mecánico B'), expect.any(Object))
    })
  })

  describe('PDF Content Validation', () => {
    it('should validate PDF content structure', async () => {
      const turno: Turno = {
        id: 'turno-001',
        inicio: new Date('2024-01-15T08:00:00'),
        cerrado: true,
        cerradoPor: 'user-001',
        cerradoPorNombre: 'Dr. Juan Pérez',
        cerradoEn: new Date('2024-01-15T16:30:00'),
        participantes: []
      }

      const registros: Registro[] = []

      await generateTurnReportPDF(turno, registros)

      // Verify PDF structure calls
      const textCalls = mockPDFDocument.text.mock.calls.map(call => call[0])

      expect(textCalls).toContain('CONSOLIDADO DE TURNO QUIRÚRGICO')
      expect(textCalls).toContain('RESUMEN DEL TURNO')
      expect(textCalls).toContain('EQUIPO DE TRABAJO')
      expect(textCalls).toContain('FIRMA DEL RESPONSABLE')
    })

    it('should handle special characters in patient names', async () => {
      const turno: Turno = {
        id: 'turno-001',
        inicio: new Date('2024-01-15T08:00:00'),
        cerrado: true,
        cerradoPor: 'user-001',
        cerradoPorNombre: 'Dr. Juan Pérez',
        cerradoEn: new Date('2024-01-15T16:30:00'),
        participantes: []
      }

      const registros: Registro[] = [
        {
          id: '1',
          nombre: 'María José González-López',
          rut: '12345678-9',
          edad: 45,
          categoria: 'OPERADO',
          salaBox: 'Sala 1',
          cirujanoResponsable: 'Dr. García',
          fechaCreacion: new Date(),
          creadoPor: 'user-001',
          creadoPorNombre: 'Dr. Juan Pérez'
        }
      ]

      await generateTurnReportPDF(turno, registros)

      expect(mockPDFDocument.text).toHaveBeenCalledWith(expect.stringContaining('María José González-López'), expect.any(Object))
    })
  })
})

// Mock implementation for testing
async function generateTurnReportPDF(turno: Turno, registros: Registro[]): Promise<Buffer> {
  // This would be the actual implementation
  // For testing purposes, we're just verifying the PDF generation calls
  return Buffer.from('fake-pdf-content')
}


