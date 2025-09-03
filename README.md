# 🏥 AgendaQX - Sistema de Gestión Quirúrgica

Sistema completo de gestión de agenda quirúrgica desarrollado con Next.js 14, TypeScript, Tailwind CSS y Firebase.

## 🚀 Características Principales

### 📋 Gestión de Registros
- **CRUD Completo**: Crear, leer, actualizar y eliminar registros de pacientes
- **Validación Avanzada**: Validación de RUT, edad y campos requeridos
- **Cambio de Categorías**: Sistema de audit trail para cambios de estado
- **Filtros Dinámicos**: Búsqueda y filtrado por múltiples criterios

### 🕐 Gestión de Turnos
- **Turnos Activos**: Control de turnos en tiempo real
- **Participantes**: Gestión de equipo médico por turno
- **Cierre de Turnos**: Proceso automatizado con Cloud Functions
- **Archivo Automático**: Movimiento de registros al libro histórico

### 📊 Histórico y Reportes
- **Histórico Completo**: Consulta de turnos cerrados
- **Filtros Avanzados**: Búsqueda por fecha, usuario y texto libre
- **Estadísticas**: Métricas y resúmenes visuales
- **Reportes PDF**: Generación automática de reportes

### 🔐 Autenticación y Seguridad
- **Sistema de Roles**: Admin, cirujano, enfermero/a, técnico
- **Autenticación Firebase**: Seguridad robusta
- **Protección de Rutas**: Control de acceso por roles
- **Audit Trail**: Registro de todas las acciones

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 14**: Framework React con App Router
- **TypeScript**: Tipado estático para mayor seguridad
- **Tailwind CSS**: Framework CSS utility-first
- **Radix UI**: Componentes accesibles y personalizables
- **React Hook Form**: Gestión de formularios
- **Zod**: Validación de esquemas

### Backend
- **Firebase Firestore**: Base de datos NoSQL en tiempo real
- **Firebase Auth**: Autenticación y autorización
- **Cloud Functions**: Funciones serverless
- **Firebase Storage**: Almacenamiento de archivos

### Testing
- **Vitest**: Tests unitarios rápidos
- **Playwright**: Tests E2E completos
- **Testing Library**: Testing de componentes React

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta de Firebase

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/agendaqx.git
cd agendaqx
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar Firebase**
```bash
# Crear archivo .env.local
cp .env.example .env.local

# Configurar variables de entorno
FIREBASE_API_KEY=tu-api-key
FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
FIREBASE_APP_ID=tu-app-id
```

4. **Configurar Firebase CLI**
```bash
npm install -g firebase-tools
firebase login
firebase init
```

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

## 🧪 Testing

### Tests Unitarios
```bash
# Ejecutar todos los tests
npm test

# Ejecutar con UI
npm run test:ui

# Ejecutar con coverage
npm run test:coverage
```

### Tests E2E
```bash
# Ejecutar tests E2E
npm run e2e

# Ejecutar con UI
npm run e2e:ui
```

## 🚀 Despliegue

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
# Build del proyecto
npm run build

# Iniciar servidor de producción
npm start
```

### Firebase
```bash
# Desplegar todo
npm run firebase:deploy

# Desplegar solo funciones
npm run firebase:deploy:functions

# Desplegar solo Firestore
npm run firebase:deploy:firestore
```

## 📁 Estructura del Proyecto

```
agendaqx/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── dashboard/         # Dashboard principal
│   │   ├── historico/         # Página de histórico
│   │   ├── login/             # Página de login
│   │   ├── turno/             # Página de turno activo
│   │   └── registro/          # Página de registros
│   ├── components/            # Componentes reutilizables
│   │   ├── ui/               # Componentes base
│   │   ├── auth-guard.tsx    # Protección de rutas
│   │   ├── registro-form.tsx # Formulario de registros
│   │   └── ...
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Utilidades y servicios
│   │   ├── firestore.ts      # Servicios de Firebase
│   │   └── utils.ts          # Funciones utilitarias
│   ├── types/                # Definiciones de tipos
│   └── styles/               # Estilos globales
├── functions/                # Cloud Functions
├── tests/                    # Tests E2E
│   └── e2e/
├── public/                   # Archivos estáticos
└── docs/                     # Documentación
```

## 🔧 Configuración

### Variables de Entorno

```env
# Firebase
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Roles de Usuario

- **admin**: Acceso completo al sistema
- **cirujano**: Gestión de registros y turnos
- **enfermero**: Gestión de registros
- **tecnico**: Visualización de registros
- **view**: Solo lectura

## 📊 Funcionalidades por PR

### PR #1: Scaffolding y Estructura Base
- ✅ Configuración inicial de Next.js 14
- ✅ Integración con Firebase
- ✅ Sistema de autenticación
- ✅ Estructura de componentes base

### PR #2: CRUD de Registros
- ✅ Formularios de creación y edición
- ✅ Validación con Zod
- ✅ Lista de registros con filtros
- ✅ Operaciones CRUD completas

### PR #3: Cambio de Categorías
- ✅ Sistema de audit trail
- ✅ Cambio de estados con motivo
- ✅ Historial de cambios
- ✅ Notificaciones en tiempo real

### PR #4: Gestión de Turnos
- ✅ Creación y gestión de turnos
- ✅ Participantes por turno
- ✅ Equipos médicos
- ✅ Estados de turno

### PR #5: Cloud Functions
- ✅ Cierre automático de turnos
- ✅ Archivo de registros
- ✅ Generación de reportes PDF
- ✅ Notificaciones push

### PR #6: Histórico y Reportes
- ✅ Página de histórico completo
- ✅ Filtros avanzados
- ✅ Estadísticas visuales
- ✅ Descarga de reportes

### PR #7: Pruebas y Optimización
- ✅ Tests unitarios con Vitest
- ✅ Tests E2E con Playwright
- ✅ Optimizaciones de rendimiento
- ✅ Documentación completa

## 🎯 Casos de Uso

### Para Administradores
1. **Gestión de Usuarios**: Crear y gestionar cuentas de personal
2. **Configuración del Sistema**: Ajustar parámetros y configuraciones
3. **Reportes Generales**: Acceso a estadísticas completas
4. **Auditoría**: Revisar logs y cambios del sistema

### Para Cirujanos
1. **Gestión de Registros**: Crear y editar registros de pacientes
2. **Cambio de Categorías**: Actualizar estado de cirugías
3. **Participación en Turnos**: Unirse a turnos activos
4. **Consulta de Histórico**: Revisar turnos anteriores

### Para Enfermeros
1. **Registro de Pacientes**: Ingresar datos de pacientes
2. **Seguimiento**: Monitorear estado de cirugías
3. **Participación en Turnos**: Colaborar en turnos activos

### Para Técnicos
1. **Visualización**: Consultar registros y turnos
2. **Soporte Técnico**: Asistir en operaciones
3. **Mantenimiento**: Gestionar equipos médicos

## 🔒 Seguridad

### Autenticación
- Firebase Authentication
- Tokens JWT seguros
- Expiración automática de sesiones

### Autorización
- Control de acceso por roles
- Protección de rutas
- Validación de permisos

### Datos
- Encriptación en tránsito (HTTPS)
- Validación de entrada
- Sanitización de datos

## 📈 Métricas de Rendimiento

### Bundle Size
- **Total**: ~135KB (First Load JS)
- **Vendor**: ~81.9KB
- **App**: ~53.3KB

### Lighthouse Scores
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo

- **Desarrollador Principal**: [Tu Nombre]
- **Diseño UX/UI**: [Diseñador]
- **Testing**: [QA Engineer]

## 📞 Soporte

Para soporte técnico o preguntas:
- 📧 Email: soporte@agendaqx.com
- 📱 WhatsApp: +56 9 XXXX XXXX
- 🌐 Web: https://agendaqx.com

---

**AgendaQX** - Simplificando la gestión quirúrgica 🏥
