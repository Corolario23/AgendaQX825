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
  horaInicio: string;
  horaTermino: string;
  tipoCirugia: string;
  anestesia: string;
  complicaciones?: string;
}

export interface RegistroPendiente extends RegistroBase {
  categoria: 'PENDIENTE';
  prioridad: Prioridad;
  tipoCirugia: string;
  anestesia: string;
  motivoEspera: string;
  arrastre?: boolean;
}

export interface RegistroNoQuirurgico extends RegistroBase {
  categoria: 'NO_QUIRURGICO';
  motivoIngreso: string;
  especialidad: string;
  tiempoEstadia: string;
}

export interface RegistroNovedad extends RegistroBase {
  categoria: 'NOVEDAD';
  tipoNovedad: string;
  descripcion: string;
  impacto: 'BAJO' | 'MEDIO' | 'ALTO';
}

// Union type for all record types
export type Registro = RegistroOperado | RegistroPendiente | RegistroNoQuirurgico | RegistroNovedad;

// Participant interface
export interface Participante {
  nombre: string;
  rol: string;
  horario: string;
}

// Equipment interface
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

// Historical book item interface
export interface LibroHistoricoItem {
  id?: string;
  turnoId: string;
  registro: Registro;
  cerradoEn: Date;
  cerradoPor: string;
  cerradoPorNombre: string;
}

// PDF data interface
export interface PDFData {
  turno: Turno;
  registros: Registro[];
  participantes: Participante[];
  equipo?: Equipo[];
  cerradoPor: string;
  cerradoPorNombre: string;
  cerradoEn: Date;
}

// Close turn request interface
export interface CloseTurnRequest {
  turnoId: string;
  participantes: Participante[];
  cerradoPor: string;
  cerradoPorNombre: string;
}


