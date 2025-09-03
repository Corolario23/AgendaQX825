#!/usr/bin/env node

/**
 * Script para configurar Firebase Storage en modo producción
 * Ejecutar: node scripts/setup-firebase-storage.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔥 Configurando Firebase Storage en modo producción...\n');

async function setupFirebaseStorage() {
  try {
    // 1. Verificar que estamos en el proyecto correcto
    console.log('📋 Verificando proyecto actual...');
    const projectInfo = execSync('firebase projects:list', { encoding: 'utf8' });
    console.log(projectInfo);
    
    // 2. Verificar si Storage ya está habilitado
    console.log('\n🔍 Verificando estado de Storage...');
    try {
      const storageStatus = execSync('firebase storage:rules:list', { encoding: 'utf8' });
      console.log('✅ Storage ya está habilitado');
      console.log(storageStatus);
    } catch (error) {
      console.log('⚠️ Storage no está habilitado aún');
      console.log('📝 Necesitas habilitarlo desde la consola web primero');
    }
    
    // 3. Mostrar instrucciones para habilitar Storage
    console.log('\n📋 INSTRUCCIONES PARA HABILITAR STORAGE:');
    console.log('1. Ve a: https://console.firebase.google.com/project/agendaqx-d1241/storage');
    console.log('2. Haz clic en "Get Started"');
    console.log('3. Selecciona "Start in production mode" (NO test mode)');
    console.log('4. Elige la ubicación: us-central1 (recomendado)');
    console.log('5. Haz clic en "Done"');
    console.log('\n⏳ Espera a que se complete la configuración...');
    
    // 4. Desplegar reglas de Storage
    console.log('\n🚀 Desplegando reglas de Storage...');
    try {
      execSync('firebase deploy --only storage', { stdio: 'inherit' });
      console.log('\n✅ Reglas de Storage desplegadas exitosamente!');
    } catch (error) {
      console.log('\n❌ Error desplegando reglas de Storage');
      console.log('💡 Asegúrate de que Storage esté habilitado primero');
      return;
    }
    
    // 5. Verificar la configuración final
    console.log('\n🔍 Verificando configuración final...');
    const finalStatus = execSync('firebase storage:rules:list', { encoding: 'utf8' });
    console.log(finalStatus);
    
    console.log('\n🎉 ¡Firebase Storage configurado exitosamente en modo producción!');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Verificar que Storage esté habilitado en la consola');
    console.log('2. Ejecutar: npm run setup:firebase para crear usuarios');
    console.log('3. Ejecutar: npm run test:integration para pruebas completas');
    
  } catch (error) {
    console.error('❌ Error configurando Storage:', error.message);
    console.log('\n💡 Solución:');
    console.log('1. Asegúrate de estar logueado: firebase login');
    console.log('2. Verifica el proyecto: firebase use agendaqx-d1241');
    console.log('3. Habilita Storage desde la consola web primero');
  }
}

// Ejecutar script
if (require.main === module) {
  setupFirebaseStorage();
}

module.exports = { setupFirebaseStorage };
