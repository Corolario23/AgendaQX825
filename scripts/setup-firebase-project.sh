#!/bin/bash

# Script para configurar un proyecto Firebase real para AgendaQX
# Ejecutar: chmod +x scripts/setup-firebase-project.sh && ./scripts/setup-firebase-project.sh

set -e

echo "🚀 Configurando proyecto Firebase real para AgendaQX..."
echo ""

# Verificar que Firebase CLI esté instalado
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI no está instalado"
    echo "📦 Instalando Firebase CLI..."
    npm install -g firebase-tools
fi

# Verificar que estés logueado en Firebase
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Iniciando sesión en Firebase..."
    firebase login
fi

echo ""
echo "📋 Proyectos Firebase disponibles:"
firebase projects:list

echo ""
echo "🔧 Pasos para configurar Firebase:"
echo "1. Ve a https://console.firebase.google.com/"
echo "2. Crea un nuevo proyecto o selecciona uno existente"
echo "3. Habilita Authentication, Firestore y Storage"
echo "4. Copia la configuración del proyecto"
echo "5. Ejecuta: firebase use [PROJECT_ID]"
echo ""

# Solicitar ID del proyecto
read -p "📝 Ingresa el ID de tu proyecto Firebase: " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    echo "❌ No se proporcionó ID de proyecto"
    exit 1
fi

echo ""
echo "🔗 Conectando al proyecto: $PROJECT_ID"

# Configurar el proyecto
firebase use $PROJECT_ID

echo ""
echo "📝 Configurando servicios..."

# Configurar Firestore
echo "🗄️ Configurando Firestore..."
firebase firestore:rules:deploy firestore.rules
firebase firestore:indexes:deploy firestore.indexes.json

# Configurar Storage
echo "📁 Configurando Storage..."
firebase storage:rules:deploy storage.rules

echo ""
echo "✅ Configuración de Firebase completada!"
echo ""
echo "🔑 Ahora actualiza src/lib/firebase.ts con tu configuración real"
echo "📱 Ejecuta: npm run setup:firebase para crear usuarios de prueba"
echo "🧪 Ejecuta: npm run test:integration para pruebas completas"
echo ""
echo "🎯 Próximos pasos:"
echo "1. Actualizar configuración en src/lib/firebase.ts"
echo "2. Crear usuarios de prueba con npm run setup:firebase"
echo "3. Ejecutar pruebas de integración"
echo "4. Probar la aplicación en producción"
