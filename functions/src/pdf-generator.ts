import PDFDocument from 'pdfkit';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PDFData, Registro, Categoria } from './types';

export class PDFGenerator {
  private doc: PDFDocument;

  constructor() {
    this.doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: 'Reporte de Turno - AgendaQX',
        Author: 'AgendaQX System',
        Subject: 'Reporte de Actividad Quirúrgica',
        Keywords: 'cirugía, turno, reporte',
        CreationDate: new Date(),
      }
    });
  }

  generateTurnReport(data: PDFData): PDFDocument {
    this.addHeader(data);
    this.addTurnInfo(data);
    this.addParticipants(data);
    this.addEquipment(data);
    this.addRegistrosSummary(data);
    this.addRegistrosDetails(data);
    this.addFooter(data);

    return this.doc;
  }

  private addHeader(data: PDFData): void {
    // Logo placeholder
    this.doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .text('AgendaQX', { align: 'center' })
      .fontSize(16)
      .font('Helvetica')
      .text('Sistema de Gestión Quirúrgica', { align: 'center' })
      .moveDown(0.5);

    // Title
    this.doc
      .fontSize(18)
      .font('Helvetica-Bold')
      .text('REPORTE DE TURNO', { align: 'center' })
      .moveDown(1);

    // Date and time
    this.doc
      .fontSize(12)
      .font('Helvetica')
      .text(`Generado el: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: es })}`, { align: 'right' })
      .moveDown(1);
  }

  private addTurnInfo(data: PDFData): void {
    this.doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('INFORMACIÓN DEL TURNO')
      .moveDown(0.5);

    const turnInfo = [
      `Inicio: ${format(data.turno.inicio, 'dd/MM/yyyy HH:mm', { locale: es })}`,
      data.turno.fin ? `Fin: ${format(data.turno.fin, 'dd/MM/yyyy HH:mm', { locale: es })}` : 'Fin: No especificado',
      `Cerrado por: ${data.cerradoPorNombre}`,
      `Fecha de cierre: ${format(data.cerradoEn, 'dd/MM/yyyy HH:mm', { locale: es })}`
    ];

    turnInfo.forEach(info => {
      this.doc
        .fontSize(11)
        .font('Helvetica')
        .text(info);
    });

    this.doc.moveDown(1);
  }

  private addParticipants(data: PDFData): void {
    if (data.participantes.length === 0) return;

    this.doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('PARTICIPANTES')
      .moveDown(0.5);

    // Table header
    this.doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('Nombre', 50, this.doc.y, { width: 120 })
      .text('Rol', 170, this.doc.y - 12, { width: 100 })
      .text('Horario', 270, this.doc.y - 12, { width: 100 });

    this.doc.moveDown(0.5);

    // Table content
    data.participantes.forEach(participante => {
      this.doc
        .fontSize(10)
        .font('Helvetica')
        .text(participante.nombre, 50, this.doc.y, { width: 120 })
        .text(participante.rol, 170, this.doc.y - 12, { width: 100 })
        .text(participante.horario, 270, this.doc.y - 12, { width: 100 });

      this.doc.moveDown(0.3);
    });

    this.doc.moveDown(1);
  }

  private addEquipment(data: PDFData): void {
    if (!data.equipo || data.equipo.length === 0) return;

    this.doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('EQUIPOS')
      .moveDown(0.5);

    // Table header
    this.doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('Nombre', 50, this.doc.y, { width: 200 })
      .text('Tipo', 250, this.doc.y - 12, { width: 150 });

    this.doc.moveDown(0.5);

    // Table content
    data.equipo.forEach(equipo => {
      this.doc
        .fontSize(10)
        .font('Helvetica')
        .text(equipo.nombre, 50, this.doc.y, { width: 200 })
        .text(equipo.tipo, 250, this.doc.y - 12, { width: 150 });

      this.doc.moveDown(0.3);
    });

    this.doc.moveDown(1);
  }

  private addRegistrosSummary(data: PDFData): void {
    this.doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('RESUMEN DE REGISTROS')
      .moveDown(0.5);

    const categorias = ['OPERADO', 'PENDIENTE', 'NO_QUIRURGICO', 'NOVEDAD'] as Categoria[];
    const summary = categorias.map(categoria => {
      const count = data.registros.filter(r => r.categoria === categoria).length;
      return { categoria, count };
    });

    summary.forEach(item => {
      this.doc
        .fontSize(11)
        .font('Helvetica')
        .text(`${this.getCategoryDisplayName(item.categoria)}: ${item.count} registros`);
    });

    this.doc.moveDown(1);
  }

  private addRegistrosDetails(data: PDFData): void {
    const categorias = ['OPERADO', 'PENDIENTE', 'NO_QUIRURGICO', 'NOVEDAD'] as Categoria[];

    categorias.forEach(categoria => {
      const registros = data.registros.filter(r => r.categoria === categoria);
      if (registros.length === 0) return;

      this.doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .text(this.getCategoryDisplayName(categoria).toUpperCase())
        .moveDown(0.5);

      registros.forEach((registro, index) => {
        this.addRegistroDetails(registro, index + 1);
        this.doc.moveDown(0.5);
      });

      this.doc.moveDown(1);
    });
  }

  private addRegistroDetails(registro: Registro, index: number): void {
    this.doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text(`${index}. ${registro.nombre} (${registro.rut})`)
      .fontSize(10)
      .font('Helvetica')
      .text(`Edad: ${registro.edad} años | Sala: ${registro.salaBox} | Cirujano: ${registro.cirujanoResponsable}`);

    // Category-specific details
    switch (registro.categoria) {
      case 'OPERADO':
        this.doc.text(`Cirugía: ${registro.tipoCirugia} | Anestesia: ${registro.anestesia}`);
        this.doc.text(`Horario: ${registro.horaInicio} - ${registro.horaTermino}`);
        if (registro.complicaciones) {
          this.doc.text(`Complicaciones: ${registro.complicaciones}`);
        }
        break;

      case 'PENDIENTE':
        this.doc.text(`Cirugía propuesta: ${registro.tipoCirugia} | Anestesia: ${registro.anestesia}`);
        this.doc.text(`Prioridad: ${registro.prioridad} | Motivo espera: ${registro.motivoEspera}`);
        if (registro.arrastre) {
          this.doc.text('ARRASGADO AL SIGUIENTE TURNO', { color: 'red' });
        }
        break;

      case 'NO_QUIRURGICO':
        this.doc.text(`Motivo ingreso: ${registro.motivoIngreso} | Especialidad: ${registro.especialidad}`);
        this.doc.text(`Tiempo estadía: ${registro.tiempoEstadia}`);
        break;

      case 'NOVEDAD':
        this.doc.text(`Tipo: ${registro.tipoNovedad} | Impacto: ${registro.impacto}`);
        this.doc.text(`Descripción: ${registro.descripcion}`);
        break;
    }

    if (registro.observaciones) {
      this.doc.text(`Observaciones: ${registro.observaciones}`);
    }
  }

  private addFooter(data: PDFData): void {
    this.doc
      .moveDown(2)
      .fontSize(10)
      .font('Helvetica')
      .text('Este documento fue generado automáticamente por el sistema AgendaQX', { align: 'center' })
      .text(`Página ${this.doc.bufferedPageRange().count}`, { align: 'center' });
  }

  private getCategoryDisplayName(categoria: Categoria): string {
    switch (categoria) {
      case 'OPERADO':
        return 'Operados';
      case 'PENDIENTE':
        return 'Pendientes';
      case 'NO_QUIRURGICO':
        return 'No Quirúrgicos';
      case 'NOVEDAD':
        return 'Novedades';
      default:
        return categoria;
    }
  }
}


