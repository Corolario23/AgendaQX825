# AgendaQX Cloud Functions

Este directorio contiene las Cloud Functions de Firebase para el sistema AgendaQX.

## Funciones Disponibles

### `cerrarTurno`
Cierra un turno de cirugía y genera un reporte PDF.

**Parámetros:**
- `turnoId`: ID del turno a cerrar
- `participantes`: Lista de participantes finales
- `cerradoPor`: UID del usuario que cierra el turno
- `cerradoPorNombre`: Nombre del usuario que cierra el turno

**Proceso:**
1. Valida que el turno existe y no esté cerrado
2. Obtiene todos los registros del turno
3. Marca registros PENDIENTE con `arrastre: true`
4. Archiva otros registros en `libroHistorico`
5. Genera reporte PDF con `pdfkit`
6. Sube PDF a Firebase Storage
7. Actualiza turno con URL del reporte

### `getCurrentTurno`
Obtiene el turno activo del día actual.

## Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Compilar TypeScript
npm run build

# Ejecutar en modo desarrollo
npm run serve

# Desplegar a producción
npm run deploy
```

## Dependencias

- **firebase-admin**: SDK de Firebase Admin
- **firebase-functions**: SDK de Cloud Functions
- **pdfkit**: Generación de PDFs
- **date-fns**: Manipulación de fechas
- **date-fns-tz**: Soporte de zonas horarias

## Configuración

Las funciones están configuradas para:
- **Región**: `us-central1`
- **Timeout**: 9 minutos
- **Memoria**: 2GB
- **Node.js**: Versión 20

## Estructura de Archivos

```
functions/
├── src/
│   ├── index.ts          # Funciones principales
│   ├── types.ts          # Tipos TypeScript
│   └── pdf-generator.ts  # Generador de PDFs
├── package.json          # Dependencias
├── tsconfig.json         # Configuración TypeScript
└── README.md            # Esta documentación
```

## Generación de PDFs

El sistema genera reportes PDF que incluyen:
- Información del turno
- Lista de participantes
- Equipos utilizados
- Resumen de registros por categoría
- Detalles completos de cada registro
- Información de cierre y firma

## Seguridad

- Todas las funciones requieren autenticación
- Validación de roles de usuario
- Transacciones de Firestore para consistencia
- Reglas de seguridad en Storage para PDFs


