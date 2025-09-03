# 🔥 Firebase Integration Setup - AgendaQX

Este documento explica cómo configurar Firebase real para ejecutar pruebas de integración en AgendaQX.

## 📋 Prerrequisitos

1. **Cuenta de Firebase**: Debes tener un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. **Node.js**: Versión 18 o superior
3. **npm**: Para instalar dependencias

## 🚀 Configuración Paso a Paso

### 1. Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Crear un proyecto"
3. Nombra tu proyecto (ej: `agendaqx-test`)
4. Habilita Google Analytics (opcional)
5. Haz clic en "Crear proyecto"

### 2. Configurar Authentication

1. En el panel izquierdo, haz clic en "Authentication"
2. Haz clic en "Comenzar"
3. En la pestaña "Sign-in method", habilita "Correo electrónico/contraseña"
4. Haz clic en "Guardar"

### 3. Configurar Firestore Database

1. En el panel izquierdo, haz clic en "Firestore Database"
2. Haz clic en "Crear base de datos"
3. Selecciona "Comenzar en modo de prueba" (para desarrollo)
4. Selecciona la ubicación más cercana a ti
5. Haz clic en "Habilitar"

### 4. Configurar Storage

1. En el panel izquierdo, haz clic en "Storage"
2. Haz clic en "Comenzar"
3. Selecciona "Comenzar en modo de prueba" (para desarrollo)
4. Selecciona la ubicación más cercana a ti
5. Haz clic en "Habilitar"

### 5. Obtener Configuración del Proyecto

1. En la página principal del proyecto, haz clic en el ícono de configuración (⚙️)
2. Selecciona "Configuración del proyecto"
3. En la pestaña "General", desplázate hacia abajo hasta "Tus apps"
4. Haz clic en el ícono de web (</>)
5. Nombra tu app (ej: `agendaqx-web`)
6. Haz clic en "Registrar app"
7. Copia la configuración que aparece

### 6. Actualizar Configuración en el Código

1. Abre `src/lib/firebase.ts`
2. Reemplaza la configuración mock con tus datos reales:

```typescript
const firebaseConfig = {
  apiKey: "TU_API_KEY_REAL",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### 7. Configurar Reglas de Seguridad

#### Firestore Rules
1. En Firestore Database, ve a la pestaña "Reglas"
2. Reemplaza las reglas existentes con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'full');
    }
    
    // Turnos
    match /turnos/{turnoId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['full', 'edit'];
    }
    
    // Registros
    match /registros/{registroId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['full', 'edit'];
    }
    
    // Historial de cambios
    match /historialCambios/{cambioId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['full', 'edit'];
    }
    
    // Libro histórico
    match /libroHistorico/{itemId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['full', 'edit'];
    }
  }
}
```

#### Storage Rules
1. En Storage, ve a la pestaña "Reglas"
2. Reemplaza las reglas existentes con:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /reportes/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 8. Crear Usuarios de Prueba

1. Abre `scripts/setup-firebase-integration.js`
2. Reemplaza la configuración con tus datos reales
3. Ejecuta el script:

```bash
npm run setup:firebase
```

Esto creará usuarios de prueba con diferentes roles:
- **Admin**: `admin@agendaqx.test` / `Admin123!` (rol: full)
- **Editor**: `editor@agendaqx.test` / `Editor123!` (rol: edit)
- **Visualizador**: `viewer@agendaqx.test` / `Viewer123!` (rol: view)

## 🧪 Ejecutar Pruebas de Integración

### Pruebas Unitarias (Mock)
```bash
npm run test:unit
```

### Pruebas de Integración (Firebase Real)
```bash
npm run test:integration
```

### Todas las Pruebas
```bash
npm run test:run
```

### Pruebas con Cobertura
```bash
npm run test:coverage
```

## 🔧 Solución de Problemas

### Error: "Firebase App named '[DEFAULT]' already exists"
- **Causa**: Múltiples inicializaciones de Firebase
- **Solución**: Verifica que solo haya una llamada a `initializeApp()`

### Error: "Permission denied"
- **Causa**: Reglas de seguridad muy restrictivas
- **Solución**: Verifica las reglas de Firestore y Storage

### Error: "Invalid API key"
- **Causa**: Clave API incorrecta o proyecto no configurado
- **Solución**: Verifica la configuración en `src/lib/firebase.ts`

### Error: "Quota exceeded"
- **Causa**: Límites de Firebase alcanzados
- **Solución**: Actualiza a un plan de pago o espera al siguiente mes

## 📊 Monitoreo y Logs

### Firebase Console
- **Authentication**: Usuarios activos y intentos de login
- **Firestore**: Uso de base de datos y consultas
- **Storage**: Archivos subidos y descargados
- **Functions**: Logs de funciones en la nube

### Logs de la Aplicación
```typescript
// Habilitar logs detallados
if (process.env.NODE_ENV === 'development') {
  console.log('🔥 Firebase configurado:', firebaseConfig.projectId);
}
```

## 🚀 Despliegue a Producción

### 1. Cambiar Reglas de Seguridad
- Actualiza las reglas para ser más restrictivas
- Implementa validación de datos
- Agrega auditoría y logging

### 2. Configurar Variables de Entorno
```bash
# .env.production
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_produccion
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-prod
```

### 3. Desplegar Reglas
```bash
npm run firebase:deploy:firestore
npm run firebase:deploy:storage
```

## 📚 Recursos Adicionales

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Firebase Testing](https://firebase.google.com/docs/rules/unit-tests)
- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)

## 🤝 Soporte

Si encuentras problemas:

1. **Revisa los logs** en Firebase Console
2. **Verifica la configuración** en el código
3. **Consulta la documentación** oficial
4. **Revisa las reglas** de seguridad
5. **Verifica los límites** de tu plan de Firebase

---

**¡Con Firebase configurado, ahora puedes ejecutar pruebas de integración reales!** 🎉
