import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RegistroForm } from '../registro-form'
import { Registro } from '@/types'

// Mock del hook useAuth
vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({
    user: {
      uid: 'test-user-id',
      email: 'test@example.com',
      rol: 'admin'
    }
  })
}))

// Mock del servicio de registros
vi.mock('@/lib/firestore', () => ({
  registroService: {
    addRegistro: vi.fn(),
    updateRegistro: vi.fn()
  }
}))

describe('RegistroForm', () => {
  const mockOnSubmit = jest.fn()
  const mockOnCancel = jest.fn()

  const defaultProps = {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
    initialData: null,
    isEditing: false
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders form fields correctly', () => {
    render(<RegistroForm {...defaultProps} />)

    // Verificar que los campos principales estén presentes
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/rut/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/edad/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/categoría/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/sala/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/cirujano responsable/i)).toBeInTheDocument()
  })

  it('shows "Agregar Registro" title when not editing', () => {
    render(<RegistroForm {...defaultProps} />)
    expect(screen.getByText('Agregar Registro')).toBeInTheDocument()
  })

  it('shows "Editar Registro" title when editing', () => {
    render(<RegistroForm {...defaultProps} isEditing={true} />)
    expect(screen.getByText('Editar Registro')).toBeInTheDocument()
  })

  it('populates form with initial data when editing', () => {
    const initialData: Registro = {
      id: 'test-id',
      nombre: 'Juan Pérez',
      rut: '12345678-9',
      edad: 45,
      categoria: 'OPERADO',
      salaBox: 'Sala 1',
      cirujanoResponsable: 'Dr. García',
      fechaCreacion: new Date(),
      creadoPor: 'test-user-id',
      creadoPorNombre: 'Test User'
    }

    render(<RegistroForm {...defaultProps} initialData={initialData} isEditing={true} />)

    expect(screen.getByDisplayValue('Juan Pérez')).toBeInTheDocument()
    expect(screen.getByDisplayValue('12345678-9')).toBeInTheDocument()
    expect(screen.getByDisplayValue('45')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Sala 1')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Dr. García')).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<RegistroForm {...defaultProps} />)

    // Intentar enviar el formulario sin datos
    const submitButton = screen.getByRole('button', { name: /guardar/i })
    await user.click(submitButton)

    // Verificar que aparezcan mensajes de error
    await waitFor(() => {
      expect(screen.getByText(/el nombre es requerido/i)).toBeInTheDocument()
      expect(screen.getByText(/el rut es requerido/i)).toBeInTheDocument()
      expect(screen.getByText(/la edad es requerida/i)).toBeInTheDocument()
    })
  })

  it('validates RUT format', async () => {
    const user = userEvent.setup()
    render(<RegistroForm {...defaultProps} />)

    const rutInput = screen.getByLabelText(/rut/i)
    await user.type(rutInput, 'invalid-rut')

    const submitButton = screen.getByRole('button', { name: /guardar/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/formato de rut inválido/i)).toBeInTheDocument()
    })
  })

  it('validates age range', async () => {
    const user = userEvent.setup()
    render(<RegistroForm {...defaultProps} />)

    const ageInput = screen.getByLabelText(/edad/i)
    await user.type(ageInput, '200') // Edad inválida

    const submitButton = screen.getByRole('button', { name: /guardar/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/la edad debe estar entre 0 y 150/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    render(<RegistroForm {...defaultProps} />)

    // Llenar el formulario con datos válidos
    await user.type(screen.getByLabelText(/nombre/i), 'María González')
    await user.type(screen.getByLabelText(/rut/i), '12345678-9')
    await user.type(screen.getByLabelText(/edad/i), '35')
    await user.selectOptions(screen.getByLabelText(/categoría/i), 'OPERADO')
    await user.type(screen.getByLabelText(/sala/i), 'Sala 2')
    await user.type(screen.getByLabelText(/cirujano responsable/i), 'Dr. López')

    const submitButton = screen.getByRole('button', { name: /guardar/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        nombre: 'María González',
        rut: '12345678-9',
        edad: 35,
        categoria: 'OPERADO',
        salaBox: 'Sala 2',
        cirujanoResponsable: 'Dr. López'
      })
    })
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(<RegistroForm {...defaultProps} />)

    const cancelButton = screen.getByRole('button', { name: /cancelar/i })
    await user.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('shows loading state during submission', async () => {
    const user = userEvent.setup()
    render(<RegistroForm {...defaultProps} />)

    // Llenar formulario
    await user.type(screen.getByLabelText(/nombre/i), 'Test User')
    await user.type(screen.getByLabelText(/rut/i), '12345678-9')
    await user.type(screen.getByLabelText(/edad/i), '30')
    await user.selectOptions(screen.getByLabelText(/categoría/i), 'OPERADO')
    await user.type(screen.getByLabelText(/sala/i), 'Sala 1')
    await user.type(screen.getByLabelText(/cirujano responsable/i), 'Dr. Test')

    const submitButton = screen.getByRole('button', { name: /guardar/i })
    await user.click(submitButton)

    // Verificar que el botón muestre estado de carga
    expect(submitButton).toBeDisabled()
  })
})
