import { test, expect } from '@playwright/test'

test.describe('Registro Management Flow', () => {
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

  test('should display registro form when clicking add button', async ({ page }) => {
    await page.getByRole('button', { name: 'Agregar Registro' }).click()
    
    await expect(page.getByRole('heading', { name: 'Agregar Registro' })).toBeVisible()
    await expect(page.getByLabel('Nombre')).toBeVisible()
    await expect(page.getByLabel('RUT')).toBeVisible()
    await expect(page.getByLabel('Edad')).toBeVisible()
    await expect(page.getByLabel('Categoría')).toBeVisible()
    await expect(page.getByLabel('Sala/Box')).toBeVisible()
    await expect(page.getByLabel('Cirujano Responsable')).toBeVisible()
  })

  test('should validate required fields in registro form', async ({ page }) => {
    await page.getByRole('button', { name: 'Agregar Registro' }).click()
    
    // Try to submit empty form
    await page.getByRole('button', { name: 'Guardar' }).click()
    
    await expect(page.getByText('El nombre es requerido')).toBeVisible()
    await expect(page.getByText('El RUT es requerido')).toBeVisible()
    await expect(page.getByText('La edad es requerida')).toBeVisible()
  })

  test('should validate RUT format', async ({ page }) => {
    await page.getByRole('button', { name: 'Agregar Registro' }).click()
    
    await page.getByLabel('Nombre').fill('Test User')
    await page.getByLabel('RUT').fill('invalid-rut')
    await page.getByLabel('Edad').fill('30')
    await page.getByLabel('Categoría').selectOption('OPERADO')
    await page.getByLabel('Sala/Box').fill('Sala 1')
    await page.getByLabel('Cirujano Responsable').fill('Dr. Test')
    
    await page.getByRole('button', { name: 'Guardar' }).click()
    
    await expect(page.getByText('Formato de RUT inválido')).toBeVisible()
  })

  test('should successfully add a new registro', async ({ page }) => {
    // Mock successful registro creation
    await page.route('**/registros', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'new-registro-id' })
      })
    })

    await page.getByRole('button', { name: 'Agregar Registro' }).click()
    
    // Fill form with valid data
    await page.getByLabel('Nombre').fill('Juan Pérez')
    await page.getByLabel('RUT').fill('12345678-9')
    await page.getByLabel('Edad').fill('45')
    await page.getByLabel('Categoría').selectOption('OPERADO')
    await page.getByLabel('Sala/Box').fill('Sala 1')
    await page.getByLabel('Cirujano Responsable').fill('Dr. García')
    
    await page.getByRole('button', { name: 'Guardar' }).click()
    
    // Should close form and show success message
    await expect(page.getByText('Registro agregado exitosamente')).toBeVisible()
  })

  test('should display registros list', async ({ page }) => {
    // Mock registros data
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
          }
        ])
      })
    })

    await page.reload()
    
    await expect(page.getByText('Juan Pérez')).toBeVisible()
    await expect(page.getByText('12345678-9')).toBeVisible()
    await expect(page.getByText('Sala 1')).toBeVisible()
  })

  test('should filter registros by category', async ({ page }) => {
    await page.getByRole('button', { name: 'Filtros' }).click()
    await page.getByLabel('Categoría').selectOption('OPERADO')
    await page.getByRole('button', { name: 'Aplicar Filtros' }).click()
    
    // Should show only OPERADO registros
    await expect(page.getByText('Filtros aplicados')).toBeVisible()
  })

  test('should edit existing registro', async ({ page }) => {
    // Mock registros data
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
          }
        ])
      })
    })

    await page.reload()
    
    // Click edit button
    await page.getByRole('button', { name: 'Editar' }).first().click()
    
    await expect(page.getByRole('heading', { name: 'Editar Registro' })).toBeVisible()
    await expect(page.getByDisplayValue('Juan Pérez')).toBeVisible()
  })

  test('should delete registro with confirmation', async ({ page }) => {
    // Mock registros data
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
          }
        ])
      })
    })

    await page.reload()
    
    // Click delete button
    await page.getByRole('button', { name: 'Eliminar' }).first().click()
    
    // Should show confirmation dialog
    await expect(page.getByText('¿Estás seguro?')).toBeVisible()
    
    // Confirm deletion
    await page.getByRole('button', { name: 'Confirmar' }).click()
    
    await expect(page.getByText('Registro eliminado exitosamente')).toBeVisible()
  })

  test('should change registro category with audit trail', async ({ page }) => {
    // Mock registros data
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
            categoria: 'PENDIENTE',
            salaBox: 'Sala 1',
            cirujanoResponsable: 'Dr. García',
            fechaCreacion: new Date().toISOString()
          }
        ])
      })
    })

    await page.reload()
    
    // Click category change button
    await page.getByRole('button', { name: 'Cambiar Categoría' }).first().click()
    
    // Select new category
    await page.getByLabel('Nueva Categoría').selectOption('OPERADO')
    await page.getByLabel('Motivo del Cambio').fill('Cirugía completada')
    
    await page.getByRole('button', { name: 'Confirmar Cambio' }).click()
    
    await expect(page.getByText('Categoría actualizada exitosamente')).toBeVisible()
  })
})


