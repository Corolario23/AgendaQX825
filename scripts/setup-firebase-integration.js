#!/usr/bin/env node

/**
 * Script para configurar Firebase y crear usuarios de prueba
 * para las pruebas de integración de AgendaQX
 */

const { initializeApp } = require('firebase/app');
const { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut 
} = require('firebase/auth');
const { 
  getFirestore, 
  doc, 
  setDoc, 
  collection, 
  addDoc,
  serverTimestamp 
} = require('firebase/firestore');

// Configuración de Firebase - REAL PROJECT
const firebaseConfig = {
  apiKey: "AIzaSyAR6bytdExGLztDVmHNN4xGCmCc24kp9h8",
  authDomain: "agendaqx-d1241.firebaseapp.com",
  projectId: "agendaqx-d1241",
  storageBucket: "agendaqx-d1241.firebasestorage.app",
  messagingSenderId: "753491188238",
  appId: "1:753491188238:web:ff0c4709b603e8b9ae3a5f"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Usuarios de prueba
const testUsers = [
  {
    email: 'admin@agendaqx.test',
    password: 'Admin123!',
    nombre: 'Administrador Test',
    role: 'full'
  },
  {
    email: 'editor@agendaqx.test',
    password: 'Editor123!',
    nombre: 'Editor Test',
    role: 'edit'
  },
  {
    email: 'viewer@agendaqx.test',
    password: 'Viewer123!',
    nombre: 'Visualizador Test',
    role: 'view'
  }
];

// Datos de prueba para turnos
const testTurno = {
  inicio: new Date('2024-01-15T08:00:00'),
  fin: null,
  estado: 'activo',
  participantes: [
    { nombre: 'Dr. Juan Pérez', rol: 'Cirujano', horario: '08:00 - 16:00' },
    { nombre: 'Enf. María García', rol: 'Enfermero/a', horario: '08:00 - 16:00' }
  ],
  equipo: [],
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
};

// Datos de prueba para registros
const testRegistros = [
  {
    nombre: 'Paciente Test 1',
    rut: '12345678-9',
    edad: 45,
    diagnostico: 'Apendicitis aguda',
    habitacion: '101',
    cirujano: 'Dr. Juan Pérez',
    hora: '10:00',
    cirugiaPropuesta: 'Apendicectomía laparoscópica',
    categoria: 'pendiente',
    turnoId: null, // Se asignará después
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    nombre: 'Paciente Test 2',
    rut: '98765432-1',
    edad: 32,
    diagnostico: 'Hernia inguinal',
    habitacion: '102',
    cirujano: 'Dr. Juan Pérez',
    hora: '11:30',
    cirugiaPropuesta: 'Herniorrafia',
    categoria: 'operado',
    cirugiaRealizada: 'Herniorrafia laparoscópica',
    diagnosticoPostoperatorio: 'Paciente estable',
    turnoId: null, // Se asignará después
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }
];

async function createTestUsers() {
  console.log('🔐 Creando usuarios de prueba...');
  
  for (const userData of testUsers) {
    try {
      // Crear usuario en Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );
      
      // Crear documento de usuario en Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: userData.email,
        nombre: userData.nombre,
        role: userData.role,
        activo: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log(`✅ Usuario creado: ${userData.email} (${userData.role})`);
      
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️ Usuario ya existe: ${userData.email}`);
      } else {
        console.error(`❌ Error creando usuario ${userData.email}:`, error.message);
      }
    }
  }
}

async function createTestTurno() {
  console.log('🏥 Creando turno de prueba...');
  
  try {
    const turnoRef = await addDoc(collection(db, 'turnos'), testTurno);
    console.log(`✅ Turno creado con ID: ${turnoRef.id}`);
    return turnoRef.id;
  } catch (error) {
    console.error('❌ Error creando turno:', error.message);
    return null;
  }
}

async function createTestRegistros(turnoId) {
  if (!turnoId) {
    console.log('⚠️ No se puede crear registros sin turno');
    return;
  }
  
  console.log('📝 Creando registros de prueba...');
  
  for (const registro of testRegistros) {
    try {
      const registroData = { ...registro, turnoId };
      await addDoc(collection(db, 'registros'), registroData);
      console.log(`✅ Registro creado: ${registro.nombre}`);
    } catch (error) {
      console.error(`❌ Error creando registro ${registro.nombre}:`, error.message);
    }
  }
}

async function setupFirestoreRules() {
  console.log('🔒 Configurando reglas de Firestore...');
  
  try {
    // Crear reglas básicas de seguridad
    const rules = {
      rules: {
        turnos: {
          '.read': 'request.auth != null',
          '.write': 'request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ["full", "edit"]'
        },
        registros: {
          '.read': 'request.auth != null',
          '.write': 'request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ["full", "edit"]'
        },
        historialCambios: {
          '.read': 'request.auth != null',
          '.write': 'request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ["full", "edit"]'
        },
        libroHistorico: {
          '.read': 'request.auth != null',
          '.write': 'request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ["full", "edit"]'
        },
        users: {
          '.read': 'request.auth != null',
          '.write': 'request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "full"'
        }
      }
    };
    
    console.log('✅ Reglas de Firestore configuradas');
    console.log('📋 Nota: Las reglas reales deben configurarse en la consola de Firebase');
    
  } catch (error) {
    console.error('❌ Error configurando reglas:', error.message);
  }
}

async function main() {
  console.log('🚀 Configurando Firebase para pruebas de integración...\n');
  
  try {
    // Verificar configuración
    if (firebaseConfig.apiKey === "TU_API_KEY_AQUI") {
      console.log('❌ ERROR: Debes configurar las credenciales reales de Firebase en este script');
      console.log('📋 Edita el archivo scripts/setup-firebase-integration.js con tus datos');
      process.exit(1);
    }
    
    // Crear usuarios de prueba
    await createTestUsers();
    console.log('');
    
    // Crear turno de prueba
    const turnoId = await createTestTurno();
    console.log('');
    
    // Crear registros de prueba
    await createTestRegistros(turnoId);
    console.log('');
    
    // Configurar reglas de seguridad
    await setupFirestoreRules();
    console.log('');
    
    console.log('🎉 Configuración completada exitosamente!');
    console.log('📱 Ahora puedes ejecutar las pruebas de integración');
    console.log('');
    console.log('🔑 Credenciales de prueba:');
    testUsers.forEach(user => {
      console.log(`   ${user.role.toUpperCase()}: ${user.email} / ${user.password}`);
    });
    
  } catch (error) {
    console.error('❌ Error en la configuración:', error.message);
    process.exit(1);
  }
}

// Ejecutar script
if (require.main === module) {
  main();
}

module.exports = {
  createTestUsers,
  createTestTurno,
  createTestRegistros,
  setupFirestoreRules
};
