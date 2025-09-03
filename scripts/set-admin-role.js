#!/usr/bin/env node

/**
 * Script para asignar rol de administrador al primer usuario
 * Ejecutar: node scripts/set-admin-role.js
 */

const { execSync } = require('child_process');

console.log('🔑 Asignando rol de administrador al usuario...\n');

async function setAdminRole() {
  try {
    // 1. Verificar que estamos en el proyecto correcto
    console.log('📋 Verificando proyecto actual...');
    const projectInfo = execSync('firebase projects:list', { encoding: 'utf8' });
    console.log(projectInfo);
    
    console.log('\n📋 INSTRUCCIONES MANUALES PARA ASIGNAR ROL:');
    console.log('1. Ve a: https://console.firebase.google.com/project/agendaqx-d1241/authentication/users');
    console.log('2. Busca el usuario: admin@agendaqx.test');
    console.log('3. Haz clic en "Edit" (lápiz)');
    console.log('4. En "Custom claims" agrega: {"role": "full"}');
    console.log('5. Haz clic en "Save"');
    console.log('\n⏳ Después de hacer esto, ejecuta: npm run setup:firebase');
    
    console.log('\n💡 Alternativa: Usar Firebase Functions para automatizar');
    console.log('   - Crear función setCustomClaims');
    console.log('   - Llamarla desde la consola');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar script
if (require.main === module) {
  setAdminRole();
}

module.exports = { setAdminRole };
