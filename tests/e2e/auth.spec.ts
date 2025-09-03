import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('should display login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Iniciar Sesión' })).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Contraseña')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Iniciar Sesión' })).toBeVisible()
  })

  test('should show validation errors for empty form', async ({ page }) => {
    const loginButton = page.getByRole('button', { name: 'Iniciar Sesión' })
    await loginButton.click()

    await expect(page.getByText('El email es requerido')).toBeVisible()
    await expect(page.getByText('La contraseña es requerida')).toBeVisible()
  })

  test('should show validation error for invalid email', async ({ page }) => {
    await page.getByLabel('Email').fill('invalid-email')
    await page.getByLabel('Contraseña').fill('password123')
    
    const loginButton = page.getByRole('button', { name: 'Iniciar Sesión' })
    await loginButton.click()

    await expect(page.getByText('Email inválido')).toBeVisible()
  })

  test('should redirect to dashboard after successful login', async ({ page }) => {
    // Mock successful login
    await page.route('**/auth/signin', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            uid: 'test-user-id',
            email: 'test@example.com',
            rol: 'admin'
          }
        })
      })
    })

    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Contraseña').fill('password123')
    
    const loginButton = page.getByRole('button', { name: 'Iniciar Sesión' })
    await loginButton.click()

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })

  test('should show error message for invalid credentials', async ({ page }) => {
    // Mock failed login
    await page.route('**/auth/signin', async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Credenciales inválidas'
        })
      })
    })

    await page.getByLabel('Email').fill('wrong@example.com')
    await page.getByLabel('Contraseña').fill('wrongpassword')
    
    const loginButton = page.getByRole('button', { name: 'Iniciar Sesión' })
    await loginButton.click()

    await expect(page.getByText('Credenciales inválidas')).toBeVisible()
  })

  test('should redirect to login when accessing protected route without auth', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Should redirect to login
    await expect(page).toHaveURL('/login')
  })
})


