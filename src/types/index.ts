// User roles
export type UserRole = 'full' | 'edit' | 'view';

// Categories for surgical records
export type Categoria = 'OPERADO' | 'PENDIENTE' | 'NO_QUIRURGICO' | 'NOVEDAD';

// Priority levels for pending surgeries
export type Prioridad = 'URGENTE' | 'PROGRAMABLE';

// Base interface for all records
export interface RegistroBase {
  id?: string;
  turnoId: string;
  categoria: Categoria;
  pacienteId: string;
  nombre: string;
  edad: number;
  rut: string;
  cirujanoResponsable: string;
  salaBox: string;
  observaciones?: string;
  creadoPor: string;
  creadoEn: Date;
  actualizadoEn: Date;
}

// Extended interfaces for each category
export interface RegistroOperado extends RegistroBase {
  categoria: 'OPERADO';
  diagnosticoPrincipal: string;
  cirugiaRealizada: string;
}

export interface RegistroPendiente extends RegistroBase {
  categoria: 'PENDIENTE';
  diagnosticoPreoperatorio: string;
  cirugiaPropuesta: string;
  prioridad: Prioridad;
  arrastre: boolean;
}

export interface RegistroNoQuirurgico extends RegistroBase {
  categoria: 'NO_QUIRURGICO';
  diagnosticoPrincipal: string;
  tratamiento: string;
}

export interface RegistroNovedad extends RegistroBase {
  categoria: 'NOVEDAD';
  titulo: string;
  detalle: string;
}

// Union type for all record types
export type Registro = RegistroOperado | RegistroPendiente | RegistroNoQuirurgico | RegistroNovedad;

// Turn participant interface
export interface ParticipanteTurno {
  uid: string;
  nombre: string;
  rolClinico: string;
  inicio?: Date;
  fin?: Date;
}

// Team member interface
export interface MiembroEquipo {
  uid: string;
  nombre: string;
  rol: string;
}

// Simplified participant interface for forms
export interface Participante {
  nombre: string;
  rol: string;
  horario: string;
}

// Simplified equipment interface for forms
export interface Equipo {
  nombre: string;
  tipo: string;
}

// Turn interface
export interface Turno {
  id?: string;
  inicio: Date;
  fin?: Date;
  cerrado: boolean;
  cerradoPor?: string;
  cerradoPorNombre?: string;
  cerradoEn?: Date;
  participantes: Participante[];
  equipo?: Equipo[];
  reporteUrl?: string;
}

// Change history interface
export interface HistorialCambio {
  id?: string;
  registroId: string;
  deCategoria: Categoria;
  aCategoria: Categoria;
  realizadoPor: string;
  realizadoPorNombre: string;
  realizadoEn: Date;
  nota?: string;
}

// User interface
export interface Usuario {
  uid: string;
  email: string;
  nombre: string;
  rol: UserRole;
  activo: boolean;
}

// Form data interfaces
export interface FormDataOperado {
  pacienteId: string;
  nombre: string;
  edad: number;
  rut: string;
  cirujanoResponsable: string;
  salaBox: string;
  diagnosticoPrincipal: string;
  cirugiaRealizada: string;
  observaciones?: string;
}

export interface FormDataPendiente {
  pacienteId: string;
  nombre: string;
  edad: number;
  rut: string;
  cirujanoResponsable: string;
  salaBox: string;
  diagnosticoPreoperatorio: string;
  cirugiaPropuesta: string;
  prioridad: Prioridad;
  observaciones?: string;
}

export interface FormDataNoQuirurgico {
  pacienteId: string;
  nombre: string;
  edad: number;
  rut: string;
  cirujanoResponsable: string;
  salaBox: string;
  diagnosticoPrincipal: string;
  tratamiento: string;
  observaciones?: string;
}

export interface FormDataNovedad {
  titulo: string;
  detalle: string;
  observaciones?: string;
}

// Close shift dialog data
export interface CloseShiftData {
  participantes: ParticipanteTurno[];
  confirmacion: boolean;
}

// Search and filter interfaces
export interface FiltrosBusqueda {
  categoria?: Categoria;
  prioridad?: Prioridad;
  cirujano?: string;
  texto?: string;
}

// API response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Real-time listener options
export interface ListenerOptions {
  includeMetadataChanges?: boolean;
}

// PDF generation data
export interface PDFData {
  turno: Turno;
  registros: Registro[];
  participantes: ParticipanteTurno[];
  cerradoPor: string;
  cerradoPorNombre: string;
  cerradoEn: Date;
}
