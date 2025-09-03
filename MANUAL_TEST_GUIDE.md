# 🧪 AgendaQX - Guía de Pruebas Manuales

## 🎯 **Objetivo**
Validar que la aplicación **AgendaQX** funciona correctamente en un entorno real de usuario.

## 🚀 **Preparación**
1. **Asegúrate de que el servidor esté corriendo:**
   ```bash
   npm run dev
   ```
2. **Abre tu navegador en:** `http://localhost:3000`

---

## 📋 **Escenario 1: Flujo Completo de Usuario**

### **Paso 1: Acceso a la Aplicación**
- [ ] **Abrir:** `http://localhost:3000`
- [ ] **Verificar:** Página de inicio con 3 botones:
  - 🔐 Login Simple
  - 📊 Dashboard Simple  
  - ⏰ Gestión de Turnos
- [ ] **Hacer clic en:** "🔐 Login Simple"

### **Paso 2: Autenticación**
- [ ] **Ingresar email:** `test@example.com`
- [ ] **Ingresar contraseña:** `password123`
- [ ] **Hacer clic en:** "Iniciar Sesión"
- [ ] **Verificar:** Redirección automática al dashboard

### **Paso 3: Navegación al Turno**
- [ ] **Hacer clic en:** "⏰ Gestión de Turnos"
- [ ] **Verificar:** Carga de página con estadísticas
- [ ] **Confirmar:** Presencia de 4 secciones de categorías

**✅ Criterios de Aceptación:**
- Página carga en < 3 segundos
- Todas las secciones son visibles
- Estadísticas muestran datos correctos

---

## 📝 **Escenario 2: Gestión de Registros**

### **2.1 Crear Registro Pendiente**
- [ ] **Hacer clic en:** "+ Agregar Registro"
- [ ] **Verificar:** Categoría por defecto es "Pendientes por Operar"

**Llenar datos básicos:**
- [ ] **Nombre:** `Juan Pérez`
- [ ] **RUT:** `12345678-9`
- [ ] **Edad:** `45`
- [ ] **Diagnóstico:** `Apendicitis aguda`
- [ ] **Habitación:** `301`
- [ ] **Cirujano:** `Dr. Carlos Silva`
- [ ] **Hora:** `14:00`

**Llenar datos específicos:**
- [ ] **Cirugía Propuesta:** `Apendicectomía laparoscópica`
- [ ] **Comentarios:** `Paciente preparado`

**Guardar:**
- [ ] **Hacer clic en:** "Guardar Registro"
- [ ] **Verificar:** Aparece en sección "Pendientes por Operar"

### **2.2 Editar Registro**
- [ ] **Hacer clic en:** "✏️ Editar" del registro creado
- [ ] **Verificar:** Formulario se abre con datos
- [ ] **Cambiar nombre a:** `Juan Carlos Pérez`
- [ ] **Actualizar diagnóstico**
- [ ] **Hacer clic en:** "Actualizar Registro"
- [ ] **Verificar:** Cambios se reflejan en la tabla

### **2.3 Eliminar Registro**
- [ ] **Hacer clic en:** "🗑️ Eliminar"
- [ ] **Confirmar en diálogo**
- [ ] **Verificar:** Registro desaparece de la tabla

**✅ Criterios de Aceptación:**
- Formulario valida campos requeridos
- Datos se guardan correctamente
- Edición funciona sin errores
- Eliminación requiere confirmación

---

## 🔄 **Escenario 3: Cambio de Categorías**

### **3.1 Mover Pendiente a Operado**
- [ ] **Crear registro en:** "Pendientes por Operar"
- [ ] **Verificar:** Tiene botón "🔄 Mover"
- [ ] **Hacer hover sobre:** "🔄 Mover"
- [ ] **Seleccionar:** "🟢 Operados"
- [ ] **Verificar:** Se abre formulario automáticamente

**Completar datos post-operatorios:**
- [ ] **Cirugía Realizada:** `Apendicectomía laparoscópica`
- [ ] **Diagnóstico Postoperatorio:** `Paciente estable`
- [ ] **Guardar cambios**

**Verificar resultado:**
- [ ] **Confirmar:** Registro aparece en "Operados"
- [ ] **Verificar:** Ya no está en "Pendientes"

### **3.2 Mover a Otras Categorías**
- [ ] **Seleccionar registro existente**
- [ ] **Hacer clic en:** "🔄 Mover" → "🟡 Ingresos No Quirúrgicos"
- [ ] **Verificar:** Cambio de categoría instantáneo
- [ ] **Seleccionar registro**
- [ ] **Hacer clic en:** "🔄 Mover" → "🔴 Novedades"
- [ ] **Verificar:** Aparece en sección correcta

**✅ Criterios de Aceptación:**
- Movimiento Pendientes → Operados abre formulario automáticamente
- Otros movimientos son instantáneos
- Registros aparecen en categorías correctas
- Botones de acción funcionan correctamente

---

## 📱 **Escenario 4: Interfaz Móvil**

### **4.1 Simular Dispositivo Móvil**
- [ ] **Abrir DevTools:** F12
- [ ] **Activar modo responsive**
- [ ] **Seleccionar:** iPhone 12 Pro

### **4.2 Validar Elementos**
- [ ] **Verificar:** Botones son táctiles (mínimo 44px)
- [ ] **Confirmar:** Formularios son legibles
- [ ] **Validar:** Tablas se desplazan horizontalmente

### **4.3 Navegación por Teclado**
- [ ] **Usar Tab:** Para navegar entre elementos
- [ ] **Verificar:** Focus es visible
- [ ] **Confirmar:** Enter activa botones

**✅ Criterios de Aceptación:**
- Interfaz funciona en pantallas pequeñas
- Elementos son accesibles por teclado
- Contraste cumple estándares WCAG

---

## ⚠️ **Escenario 5: Casos Edge y Errores**

### **5.1 Validaciones de Formulario**
- [ ] **Intentar guardar:** Formulario vacío
- [ ] **Verificar:** Se muestran errores
- [ ] **Confirmar:** No se puede guardar

### **5.2 Formatos de Datos**
- [ ] **Ingresar RUT inválido:** `123`
- [ ] **Ingresar edad negativa:** `-5`
- [ ] **Verificar:** Validaciones funcionan

### **5.3 Casos Límite**
- [ ] **Crear 10+ registros** en cada categoría
- [ ] **Verificar:** Tablas se desplazan correctamente
- [ ] **Confirmar:** Estadísticas se actualizan

**✅ Criterios de Aceptación:**
- Formularios validan datos correctamente
- Errores se muestran claramente
- Interfaz maneja datos extremos

---

## 🎯 **Casos de Prueba Críticos**

### **TC-001: Flujo Completo de Turno**
**Prioridad:** Crítica

**Pasos:**
1. Login → Dashboard → Turno
2. Crear 3 registros (diferentes categorías)
3. Editar 1 registro
4. Mover 1 registro entre categorías
5. Eliminar 1 registro

**Resultado Esperado:** Todo funciona sin errores

### **TC-002: Movimiento Pendientes → Operados**
**Prioridad:** Alta

**Pasos:**
1. Crear registro en "Pendientes"
2. Mover a "Operados"
3. Verificar que se abre formulario
4. Llenar datos post-operatorios
5. Guardar

**Resultado Esperado:** Formulario se abre automáticamente con campos específicos

### **TC-003: Interfaz Móvil**
**Prioridad:** Alta

**Pasos:**
1. Abrir en iPhone/Android
2. Navegar por todas las secciones
3. Crear/editar registros
4. Usar botones de acción

**Resultado Esperado:** Interfaz es usable en móvil

---

## 📊 **Métricas de Rendimiento**

### **Tiempo de Respuesta**
- [ ] **Carga inicial:** < 3 segundos
- [ ] **Navegación entre páginas:** < 1 segundo
- [ ] **Operaciones CRUD:** < 500ms

### **Compatibilidad**
- [ ] **Chrome:** ✅ Funciona
- [ ] **Safari:** ✅ Funciona
- [ ] **Firefox:** ✅ Funciona
- [ ] **iOS Safari:** ✅ Funciona
- [ ] **Android Chrome:** ✅ Funciona

---

## 🚨 **Registro de Defectos**

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

---

## ✅ **Checklist Final**

### **Funcionalidades Básicas**
- [ ] Login funciona correctamente
- [ ] Navegación entre páginas
- [ ] Dashboard muestra estadísticas
- [ ] Formularios de registro funcionan
- [ ] Edición de registros
- [ ] Eliminación de registros
- [ ] Movimiento entre categorías

### **Funcionalidades Avanzadas**
- [ ] Lógica especial Pendientes → Operados
- [ ] Validaciones de formulario
- [ ] Interfaz responsive
- [ ] Accesibilidad por teclado
- [ ] Manejo de errores

### **Experiencia de Usuario**
- [ ] Interfaz intuitiva
- [ ] Tiempos de respuesta aceptables
- [ ] Mensajes de error claros
- [ ] Confirmaciones apropiadas
- [ ] Diseño consistente

---

## 🎉 **Criterios de Aceptación Final**

### **Definición de "Listo" (DoD)**
- [ ] Todos los escenarios críticos pasan
- [ ] Interfaz funciona en móvil
- [ ] No hay errores en consola
- [ ] Usuario puede completar flujo completo
- [ ] Validaciones funcionan correctamente
- [ ] Rendimiento es aceptable

---

*Documento actualizado: [Fecha]*
*Versión: 1.0*
*Responsable: Equipo de Desarrollo*
