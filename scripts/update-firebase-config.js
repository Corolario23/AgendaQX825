#!/usr/bin/env node

/**
 * Script para actualizar la configuración de Firebase en el proyecto
 * Ejecutar: node scripts/update-firebase-config.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Actualizando configuración de Firebase...\n');

// Solicitar configuración del usuario
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function getFirebaseConfig() {
  console.log('📝 Ingresa la configuración de tu proyecto Firebase:\n');
  
  const apiKey = await question('🔑 API Key: ');
  const authDomain = await question('🌐 Auth Domain: ');
  const projectId = await question('📁 Project ID: ');
  const storageBucket = await question('📦 Storage Bucket: ');
  const messagingSenderId = await question('📱 Messaging Sender ID: ');
  const appId = await question('🆔 App ID: ');
  
  rl.close();
  
  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId
  };
}

function updateFirebaseFile(config) {
  const firebasePath = path.join(__dirname, '..', 'src', 'lib', 'firebase.ts');
  
  const firebaseContent = `import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

// Firebase configuration - REAL PROJECT
const firebaseConfig = {
  apiKey: "${config.apiKey}",
  authDomain: "${config.authDomain}",
  projectId: "${config.projectId}",
  storageBucket: "${config.storageBucket}",
  messagingSenderId: "${config.messagingSenderId}",
  appId: "${config.appId}"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Connect to emulators in development
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_EMULATORS === 'true') {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    console.log('🔥 Connected to Firebase Emulators');
  } catch (error) {
    console.log('⚠️ Emulators already connected or not available');
  }
}

export default { firebaseConfig };
`;

  try {
    fs.writeFileSync(firebasePath, firebaseContent);
    console.log('✅ Archivo src/lib/firebase.ts actualizado correctamente');
  } catch (error) {
    console.error('❌ Error actualizando archivo:', error.message);
    process.exit(1);
  }
}

async function main() {
  try {
    const config = await getFirebaseConfig();
    
    // Validar que todos los campos estén completos
    const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
    const missingFields = requiredFields.filter(field => !config[field]);
    
    if (missingFields.length > 0) {
      console.error('❌ Campos faltantes:', missingFields.join(', '));
      process.exit(1);
    }
    
    console.log('\n🔧 Actualizando configuración...');
    updateFirebaseFile(config);
    
    console.log('\n🎉 Configuración actualizada exitosamente!');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Ejecuta: npm run setup:firebase para crear usuarios de prueba');
    console.log('2. Ejecuta: npm run test:integration para pruebas completas');
    console.log('3. Inicia la aplicación: npm run dev');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
