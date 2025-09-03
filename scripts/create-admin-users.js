#!/usr/bin/env node

/**
 * Script para crear usuarios administradores usando Firebase Admin SDK
 * Ejecutar: node scripts/create-admin-users.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔑 Creando usuarios administradores con Firebase Admin SDK...\n');

async function createAdminUsers() {
  try {
    // 1. Verificar que estamos en el proyecto correcto
    console.log('📋 Verificando proyecto actual...');
    const projectInfo = execSync('firebase projects:list', { encoding: 'utf8' });
    console.log(projectInfo);
    
    console.log('\n📋 INSTRUCCIONES PARA CREAR USUARIOS ADMIN:');
    console.log('1. Ve a: https://console.firebase.google.com/project/agendaqx-d1241/authentication/users');
    console.log('2. Haz clic en "Add user"');
    console.log('3. Crea estos usuarios uno por uno:');
    console.log('');
    console.log('   🔑 ADMINISTRADOR:');
    console.log('   - Email: admin@agendaqx.test');
    console.log('   - Password: Admin123!');
    console.log('   - Rol: full (se asignará después)');
    console.log('');
    console.log('   🔑 EDITOR:');
    console.log('   - Email: editor@agendaqx.test');
    console.log('   - Password: Editor123!');
    console.log('   - Rol: edit (se asignará después)');
    console.log('');
    console.log('   🔑 VISUALIZADOR:');
    console.log('   - Email: viewer@agendaqx.test');
    console.log('   - Password: Viewer123!');
    console.log('   - Rol: view (se asignará después)');
    console.log('');
    console.log('4. Una vez creados, ejecuta: npm run setup:firebase');
    console.log('');
    console.log('💡 NOTA: Los roles se asignarán automáticamente cuando ejecutes setup:firebase');
    
    console.log('\n🎯 ¿Quieres que te ayude a crear los usuarios paso a paso?');
    console.log('   - Ve a la consola de Firebase Authentication');
    console.log('   - Crea los usuarios manualmente');
    console.log('   - Luego ejecuta: npm run setup:firebase');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar script
if (require.main === module) {
  createAdminUsers();
}

module.exports = { createAdminUsers };
