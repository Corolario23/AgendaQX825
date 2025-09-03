import { test, expect } from '@playwright/test'

test.describe('Turno Cierre y Consolidado', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.addInitScript(() => {
      window.localStorage.setItem('user', JSON.stringify({
        uid: 'test-user-id',
        email: 'test@example.com',
        rol: 'admin'
      }))
    })

    await page.goto('/turno')
  })

  test('should display current turn information correctly', async ({ page }) => {
    // Mock current turn data
    await page.route('**/turnos', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'current-turno',
          inicio: new Date().toISOString(),
          participantes: [
            { nombre: 'Dr. Juan Pérez', rol: 'Cirujano', horario: '08:00-16:00' },
            { nombre: 'Enf. María García', rol: 'Enfermero/a', horario: '08:00-16:00' }
          ],
          equipo: [
            { nombre: 'Monitor Paciente A', tipo: 'Monitoreo' }
          ]
        })
      })
    })

    await page.reload()

    await expect(page.getByText('Turno Activo')).toBeVisible()
    await expect(page.getByText('Dr. Juan Pérez')).toBeVisible()
    await expect(page.getByText('Enf. María García')).toBeVisible()
    await expect(page.getByText('Monitor Paciente A')).toBeVisible()
  })

  test('should show registros count by category in turn summary', async ({ page }) => {
    // Mock registros data for current turn
    await page.route('**/registros', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '1',
            nombre: 'Paciente 1',
            categoria: 'OPERADO',
            salaBox: 'Sala 1',
            cirujanoResponsable: 'Dr. García'
          },
          {
            id: '2',
            nombre: 'Paciente 2',
            categoria: 'PENDIENTE',
            salaBox: 'Sala 2',
            cirujanoResponsable: 'Dr. López'
          },
          {
            id: '3',
            nombre: 'Paciente 3',
            categoria: 'OPERADO',
            salaBox: 'Sala 1',
            cirujanoResponsable: 'Dr. García'
          }
        ])
      })
    })

    await page.reload()

    // Verify category counts are displayed
    await expect(page.getByText('Operados: 2')).toBeVisible()
    await expect(page.getByText('Pendientes: 1')).toBeVisible()
    await expect(page.getByText('No Quirúrgicos: 0')).toBeVisible()
    await expect(page.getByText('Novedades: 0')).toBeVisible()
  })

  test('should validate turn closure requirements', async ({ page }) => {
    // Mock empty turn (no registros)
    await page.route('**/registros', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      })
    })

    await page.reload()

    // Try to close turn without registros
    await page.getByRole('button', { name: 'Cerrar Turno' }).click()

    // Should show warning about empty turn
    await expect(page.getByText('No hay registros en este turno')).toBeVisible()
    await expect(page.getByText('¿Deseas cerrar el turno sin registros?')).toBeVisible()
  })

  test('should handle turn closure with registros successfully', async ({ page }) => {
    // Mock registros data
    await page.route('**/registros', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '1',
            nombre: 'Paciente 1',
            categoria: 'OPERADO',
            salaBox: 'Sala 1',
            cirujanoResponsable: 'Dr. García',
            fechaCreacion: new Date().toISOString()
          }
        ])
      })
    })

    // Mock successful turn closure
    await page.route('**/turnos/close', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          reporteUrl: 'https://example.com/reporte-turno.pdf',
          turnoId: 'closed-turno-id'
        })
      })
    })

    await page.reload()

    // Close turn
    await page.getByRole('button', { name: 'Cerrar Turno' }).click()

    // Confirm closure
    await page.getByRole('button', { name: 'Confirmar Cierre' }).click()

    // Should show success message
    await expect(page.getByText('Turno cerrado exitosamente')).toBeVisible()
    await expect(page.getByText('Reporte generado')).toBeVisible()
  })

  test('should generate PDF report with correct data', async ({ page }) => {
    // Mock registros data for PDF generation
    await page.route('**/registros', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '1',
            nombre: 'Juan Pérez',
            rut: '12345678-9',
            edad: 45,
            categoria: 'OPERADO',
            salaBox: 'Sala 1',
            cirujanoResponsable: 'Dr. García',
            fechaCreacion: new Date().toISOString()
          },
          {
            id: '2',
            nombre: 'María González',
            rut: '98765432-1',
            edad: 32,
            categoria: 'PENDIENTE',
            salaBox: 'Sala 2',
            cirujanoResponsable: 'Dr. López',
            fechaCreacion: new Date().toISOString()
          }
        ])
      })
    })

    // Mock PDF generation
    await page.route('**/generate-pdf', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/pdf',
        body: Buffer.from('fake-pdf-content')
      })
    })

    await page.reload()

    // Close turn
    await page.getByRole('button', { name: 'Cerrar Turno' }).click()
    await page.getByRole('button', { name: 'Confirmar Cierre' }).click()

    // Verify PDF download link
    await expect(page.getByRole('link', { name: 'Descargar Reporte PDF' })).toBeVisible()
  })

  test('should handle turn closure errors gracefully', async ({ page }) => {
    // Mock registros data
    await page.route('**/registros', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '1',
            nombre: 'Paciente 1',
            categoria: 'OPERADO',
            salaBox: 'Sala 1',
            cirujanoResponsable: 'Dr. García'
          }
        ])
      })
    })

    // Mock failed turn closure
    await page.route('**/turnos/close', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Error al cerrar el turno',
          details: 'Problema con la base de datos'
        })
      })
    })

    await page.reload()

    // Try to close turn
    await page.getByRole('button', { name: 'Cerrar Turno' }).click()
    await page.getByRole('button', { name: 'Confirmar Cierre' }).click()

    // Should show error message
    await expect(page.getByText('Error al cerrar el turno')).toBeVisible()
    await expect(page.getByText('Problema con la base de datos')).toBeVisible()
  })

  test('should archive registros to libro historico after turn closure', async ({ page }) => {
    // Mock registros data
    const registros = [
      {
        id: '1',
        nombre: 'Paciente 1',
        categoria: 'OPERADO',
        salaBox: 'Sala 1',
        cirujanoResponsable: 'Dr. García'
      },
      {
        id: '2',
        nombre: 'Paciente 2',
        categoria: 'PENDIENTE',
        salaBox: 'Sala 2',
        cirujanoResponsable: 'Dr. López'
      }
    ]

    await page.route('**/registros', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(registros)
      })
    })

    // Mock successful archiving
    await page.route('**/archive-registros', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          archivedCount: registros.length
        })
      })
    })

    await page.reload()

    // Close turn
    await page.getByRole('button', { name: 'Cerrar Turno' }).click()
    await page.getByRole('button', { name: 'Confirmar Cierre' }).click()

    // Should show archiving confirmation
    await expect(page.getByText('Registros archivados exitosamente')).toBeVisible()
    await expect(page.getByText('2 registros movidos al histórico')).toBeVisible()
  })

  test('should handle pending registros transfer to next turn', async ({ page }) => {
    // Mock registros with pending items
    await page.route('**/registros', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '1',
            nombre: 'Paciente Operado',
            categoria: 'OPERADO',
            salaBox: 'Sala 1',
            cirujanoResponsable: 'Dr. García'
          },
          {
            id: '2',
            nombre: 'Paciente Pendiente',
            categoria: 'PENDIENTE',
            salaBox: 'Sala 2',
            cirujanoResponsable: 'Dr. López'
          }
        ])
      })
    })

    await page.reload()

    // Close turn
    await page.getByRole('button', { name: 'Cerrar Turno' }).click()

    // Should show warning about pending registros
    await expect(page.getByText('Hay 1 registro(s) pendiente(s)')).toBeVisible()
    await expect(page.getByText('¿Deseas transferir los pendientes al siguiente turno?')).toBeVisible()

    // Confirm transfer
    await page.getByRole('button', { name: 'Transferir Pendientes' }).click()
    await page.getByRole('button', { name: 'Confirmar Cierre' }).click()

    // Should show transfer confirmation
    await expect(page.getByText('Pendientes transferidos al siguiente turno')).toBeVisible()
  })

  test('should validate turn closure permissions by role', async ({ page }) => {
    // Mock user with limited permissions
    await page.addInitScript(() => {
      window.localStorage.setItem('user', JSON.stringify({
        uid: 'test-user-id',
        email: 'test@example.com',
        rol: 'view' // Only view permissions
      }))
    })

    await page.reload()

    // Should not show close turn button for view role
    await expect(page.getByRole('button', { name: 'Cerrar Turno' })).not.toBeVisible()
    await expect(page.getByText('No tienes permisos para cerrar turnos')).toBeVisible()
  })

  test('should show turn closure confirmation dialog with summary', async ({ page }) => {
    // Mock registros data
    await page.route('**/registros', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '1',
            nombre: 'Paciente 1',
            categoria: 'OPERADO',
            salaBox: 'Sala 1',
            cirujanoResponsable: 'Dr. García'
          },
          {
            id: '2',
            nombre: 'Paciente 2',
            categoria: 'PENDIENTE',
            salaBox: 'Sala 2',
            cirujanoResponsable: 'Dr. López'
          }
        ])
      })
    })

    await page.reload()

    // Click close turn
    await page.getByRole('button', { name: 'Cerrar Turno' }).click()

    // Should show confirmation dialog with summary
    await expect(page.getByText('Confirmar Cierre de Turno')).toBeVisible()
    await expect(page.getByText('Resumen del Turno:')).toBeVisible()
    await expect(page.getByText('Total de Registros: 2')).toBeVisible()
    await expect(page.getByText('Operados: 1')).toBeVisible()
    await expect(page.getByText('Pendientes: 1')).toBeVisible()
  })

  test('should handle network errors during turn closure', async ({ page }) => {
    // Mock registros data
    await page.route('**/registros', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '1',
            nombre: 'Paciente 1',
            categoria: 'OPERADO',
            salaBox: 'Sala 1',
            cirujanoResponsable: 'Dr. García'
          }
        ])
      })
    })

    // Mock network error
    await page.route('**/turnos/close', async route => {
      await route.abort('failed')
    })

    await page.reload()

    // Try to close turn
    await page.getByRole('button', { name: 'Cerrar Turno' }).click()
    await page.getByRole('button', { name: 'Confirmar Cierre' }).click()

    // Should show network error message
    await expect(page.getByText('Error de conexión')).toBeVisible()
    await expect(page.getByText('Verifica tu conexión a internet')).toBeVisible()
  })
})


