# 🧪 AgendaQX - Plan de Pruebas Integral

## 📋 **Resumen Ejecutivo**

Este documento define la estrategia de pruebas para la aplicación **AgendaQX**, un sistema PWA para gestión de turnos quirúrgicos. El enfoque es **MVP usable en teléfono** con funcionalidades críticas validadas.

## 🎯 **Objetivos de Pruebas**

### **Funcionalidades Críticas a Validar:**
1. ✅ **Autenticación y Navegación**
2. ✅ **Gestión de Registros (CRUD)**
3. ✅ **Cambio de Categorías con Auditoría**
4. ✅ **Cierre de Turnos y Generación de PDFs**
5. ✅ **Interfaz Móvil-First**
6. ✅ **Roles y Permisos**

## 🧪 **Tipos de Pruebas**

### **1. Pruebas Unitarias (Vitest)**
**Archivo:** `src/app/turno-simple/__tests__/page.test.tsx`

#### **Funcionalidades Validadas:**
- ✅ Renderizado de secciones principales
- ✅ Apertura y cierre de formularios
- ✅ Creación de registros por categoría
- ✅ Edición de registros existentes
- ✅ Eliminación de registros
- ✅ Movimiento entre categorías
- ✅ Lógica especial: Pendientes → Operados

#### **Cobertura Actual:**
```bash
npm run test -- --coverage
```

### **2. Pruebas E2E (Playwright)**
**Archivos:** `tests/e2e/*.spec.ts`

#### **Flujos Críticos:**
- ✅ **Flujo de Autenticación**
- ✅ **Gestión Completa de Registros**
- ✅ **Cierre de Turno y Generación de Reportes**

#### **Ejecución:**
```bash
npm run e2e
```

### **3. Pruebas de Integración**
**Archivos:** `src/lib/__tests__/*.test.ts`

#### **Servicios Validados:**
- ✅ **Firestore Services**
- ✅ **Turno Service**
- ✅ **PDF Generator**
- ✅ **Auth Service**

## 🚀 **Plan de Pruebas Manuales**

### **Escenario 1: Flujo Completo de Usuario**
**Objetivo:** Validar experiencia completa desde login hasta cierre de turno

#### **Pasos:**
1. **Acceso a la aplicación**
   - [ ] Abrir `http://localhost:3000`
   - [ ] Verificar página de inicio con opciones
   - [ ] Hacer clic en "🔐 Login Simple"

2. **Autenticación**
   - [ ] Ingresar email: `test@example.com`
   - [ ] Ingresar contraseña: `password123`
   - [ ] Hacer clic en "Iniciar Sesión"
   - [ ] Verificar redirección a dashboard

3. **Navegación al Turno**
   - [ ] Hacer clic en "⏰ Gestión de Turnos"
   - [ ] Verificar carga de página con estadísticas
   - [ ] Confirmar presencia de 4 secciones de categorías

#### **Criterios de Aceptación:**
- ✅ Página carga en < 3 segundos
- ✅ Todas las secciones son visibles
- ✅ Estadísticas muestran datos correctos

---

### **Escenario 2: Gestión de Registros**
**Objetivo:** Validar CRUD completo de registros

#### **2.1 Crear Registro Pendiente**
1. **Abrir formulario**
   - [ ] Hacer clic en "+ Agregar Registro"
   - [ ] Verificar que categoría por defecto es "Pendientes por Operar"

2. **Llenar datos básicos**
   - [ ] Nombre: `Juan Pérez`
   - [ ] RUT: `12345678-9`
   - [ ] Edad: `45`
   - [ ] Diagnóstico: `Apendicitis aguda`
   - [ ] Habitación: `301`
   - [ ] Cirujano: `Dr. Carlos Silva`
   - [ ] Hora: `14:00`

3. **Llenar datos específicos**
   - [ ] Cirugía Propuesta: `Apendicectomía laparoscópica`
   - [ ] Comentarios: `Paciente preparado`

4. **Guardar**
   - [ ] Hacer clic en "Guardar Registro"
   - [ ] Verificar que aparece en sección "Pendientes por Operar"

#### **2.2 Editar Registro**
1. **Abrir edición**
   - [ ] Hacer clic en "✏️ Editar" del registro creado
   - [ ] Verificar que formulario se abre con datos

2. **Modificar datos**
   - [ ] Cambiar nombre a `Juan Carlos Pérez`
   - [ ] Actualizar diagnóstico

3. **Guardar cambios**
   - [ ] Hacer clic en "Actualizar Registro"
   - [ ] Verificar que cambios se reflejan en la tabla

#### **2.3 Eliminar Registro**
1. **Confirmar eliminación**
   - [ ] Hacer clic en "🗑️ Eliminar"
   - [ ] Confirmar en diálogo
   - [ ] Verificar que registro desaparece de la tabla

#### **Criterios de Aceptación:**
- ✅ Formulario valida campos requeridos
- ✅ Datos se guardan correctamente
- ✅ Edición funciona sin errores
- ✅ Eliminación requiere confirmación

---

### **Escenario 3: Cambio de Categorías**
**Objetivo:** Validar movimiento entre categorías y auditoría

#### **3.1 Mover Pendiente a Operado**
1. **Preparar registro**
   - [ ] Crear registro en "Pendientes por Operar"
   - [ ] Verificar que tiene botón "🔄 Mover"

2. **Ejecutar movimiento**
   - [ ] Hacer hover sobre "🔄 Mover"
   - [ ] Seleccionar "🟢 Operados"
   - [ ] Verificar que se abre formulario automáticamente

3. **Completar datos post-operatorios**
   - [ ] Llenar "Cirugía Realizada": `Apendicectomía laparoscópica`
   - [ ] Llenar "Diagnóstico Postoperatorio": `Paciente estable`
   - [ ] Guardar cambios

4. **Verificar resultado**
   - [ ] Confirmar que registro aparece en "Operados"
   - [ ] Verificar que ya no está en "Pendientes"

#### **3.2 Mover a Otras Categorías**
1. **Mover a No Quirúrgicos**
   - [ ] Seleccionar registro existente
   - [ ] Hacer clic en "🔄 Mover" → "🟡 Ingresos No Quirúrgicos"
   - [ ] Verificar cambio de categoría

2. **Mover a Novedades**
   - [ ] Seleccionar registro
   - [ ] Hacer clic en "🔄 Mover" → "🔴 Novedades"
   - [ ] Verificar que aparece en sección correcta

#### **Criterios de Aceptación:**
- ✅ Movimiento Pendientes → Operados abre formulario automáticamente
- ✅ Otros movimientos son instantáneos
- ✅ Registros aparecen en categorías correctas
- ✅ Botones de acción funcionan correctamente

---

### **Escenario 4: Validaciones de Interfaz**
**Objetivo:** Validar comportamiento responsive y UX

#### **4.1 Interfaz Móvil**
1. **Simular dispositivo móvil**
   - [ ] Abrir DevTools (F12)
   - [ ] Activar modo responsive
   - [ ] Seleccionar iPhone 12 Pro

2. **Validar elementos**
   - [ ] Verificar que botones son táctiles (mínimo 44px)
   - [ ] Confirmar que formularios son legibles
   - [ ] Validar que tablas se desplazan horizontalmente

#### **4.2 Accesibilidad**
1. **Navegación por teclado**
   - [ ] Usar Tab para navegar entre elementos
   - [ ] Verificar que focus es visible
   - [ ] Confirmar que Enter activa botones

2. **Contraste y legibilidad**
   - [ ] Verificar contraste de texto
   - [ ] Confirmar que colores de categorías son distinguibles

#### **Criterios de Aceptación:**
- ✅ Interfaz funciona en pantallas pequeñas
- ✅ Elementos son accesibles por teclado
- ✅ Contraste cumple estándares WCAG

---

### **Escenario 5: Casos Edge y Errores**
**Objetivo:** Validar manejo de errores y casos límite

#### **5.1 Validaciones de Formulario**
1. **Campos requeridos**
   - [ ] Intentar guardar formulario vacío
   - [ ] Verificar que se muestran errores
   - [ ] Confirmar que no se puede guardar

2. **Formatos de datos**
   - [ ] Ingresar RUT inválido: `123`
   - [ ] Ingresar edad negativa: `-5`
   - [ ] Verificar validaciones

#### **5.2 Casos límite**
1. **Muchos registros**
   - [ ] Crear 10+ registros en cada categoría
   - [ ] Verificar que tablas se desplazan correctamente
   - [ ] Confirmar que estadísticas se actualizan

2. **Datos largos**
   - [ ] Ingresar nombres muy largos
   - [ ] Escribir diagnósticos extensos
   - [ ] Verificar que interfaz se adapta

#### **Criterios de Aceptación:**
- ✅ Formularios validan datos correctamente
- ✅ Errores se muestran claramente
- ✅ Interfaz maneja datos extremos

---

## 📊 **Métricas de Calidad**

### **Cobertura de Código**
- **Objetivo:** > 80% de cobertura
- **Actual:** Por medir
- **Comando:** `npm run test -- --coverage`

### **Tiempo de Respuesta**
- **Carga inicial:** < 3 segundos
- **Navegación entre páginas:** < 1 segundo
- **Operaciones CRUD:** < 500ms

### **Compatibilidad**
- **Navegadores:** Chrome, Safari, Firefox
- **Dispositivos:** iOS Safari, Android Chrome
- **Tamaños de pantalla:** 320px - 1920px

## 🚨 **Casos de Prueba Críticos**

### **TC-001: Flujo Completo de Turno**
**Prioridad:** Crítica
**Descripción:** Usuario completa ciclo completo desde login hasta cierre

**Pasos:**
1. Login → Dashboard → Turno
2. Crear 3 registros (diferentes categorías)
3. Editar 1 registro
4. Mover 1 registro entre categorías
5. Eliminar 1 registro
6. Cerrar turno

**Resultado Esperado:** Todo funciona sin errores

### **TC-002: Movimiento Pendientes → Operados**
**Prioridad:** Alta
**Descripción:** Validar lógica especial de movimiento

**Pasos:**
1. Crear registro en "Pendientes"
2. Mover a "Operados"
3. Verificar que se abre formulario
4. Llenar datos post-operatorios
5. Guardar

**Resultado Esperado:** Formulario se abre automáticamente con campos específicos

### **TC-003: Interfaz Móvil**
**Prioridad:** Alta
**Descripción:** Validar experiencia en dispositivo móvil

**Pasos:**
1. Abrir en iPhone/Android
2. Navegar por todas las secciones
3. Crear/editar registros
4. Usar botones de acción

**Resultado Esperado:** Interfaz es usable en móvil

## 🔧 **Comandos de Ejecución**

### **Pruebas Unitarias**
```bash
# Ejecutar todas las pruebas
npm run test

# Ejecutar con UI
npm run test:ui

# Ejecutar con cobertura
npm run test -- --coverage
```

### **Pruebas E2E**
```bash
# Ejecutar todas las pruebas E2E
npm run e2e

# Ejecutar con UI
npm run e2e:ui

# Ejecutar pruebas específicas
npm run e2e -- tests/e2e/auth.spec.ts
```

### **Pruebas Manuales**
```bash
# Iniciar servidor de desarrollo
npm run dev

# Abrir en navegador
open http://localhost:3000
```

## 📝 **Registro de Defectos**

### **Plantilla de Bug Report**
```
**Título:** [Descripción breve del problema]

**Severidad:** [Crítica/Alta/Media/Baja]

**Pasos para reproducir:**
1. [Paso 1]
2. [Paso 2]
3. [Paso 3]

**Resultado esperado:** [Qué debería pasar]

**Resultado actual:** [Qué está pasando]

**Navegador/Dispositivo:** [Especificar]

**Capturas de pantalla:** [Si aplica]
```

## ✅ **Criterios de Aceptación**

### **Definición de "Listo" (DoD)**
- [ ] Todas las pruebas unitarias pasan
- [ ] Todas las pruebas E2E pasan
- [ ] Pruebas manuales críticas validadas
- [ ] Cobertura de código > 80%
- [ ] Interfaz funciona en móvil
- [ ] No hay errores en consola
- [ ] Documentación actualizada

---

## 📅 **Cronograma de Pruebas**

### **Semana 1: Pruebas Unitarias**
- [ ] Configurar entorno de pruebas
- [ ] Implementar pruebas de componentes
- [ ] Validar servicios de backend
- [ ] Medir cobertura de código

### **Semana 2: Pruebas E2E**
- [ ] Implementar flujos críticos
- [ ] Validar integración completa
- [ ] Probar casos edge
- [ ] Optimizar tiempo de ejecución

### **Semana 3: Pruebas Manuales**
- [ ] Validar experiencia de usuario
- [ ] Probar en dispositivos móviles
- [ ] Verificar accesibilidad
- [ ] Documentar hallazgos

### **Semana 4: Optimización**
- [ ] Corregir defectos encontrados
- [ ] Optimizar rendimiento
- [ ] Finalizar documentación
- [ ] Preparar para producción

---

*Documento actualizado: [Fecha]*
*Versión: 1.0*
*Responsable: Equipo de Desarrollo*
