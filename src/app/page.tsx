'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏥 AgendaQX
          </h1>
          <p className="text-gray-600">
            Registro de Turnos Quirúrgicos
          </p>
        </div>

        <div className="space-y-4">
          <Link 
            href="/login-simple"
            className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔐 Login Simple
          </Link>
          
          <Link 
            href="/dashboard-simple"
            className="block w-full bg-green-600 text-white text-center py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            📊 Dashboard Simple
          </Link>
          
          <Link 
            href="/turno-simple"
            className="block w-full bg-purple-600 text-white text-center py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
          >
            ⏰ Gestión de Turnos
          </Link>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Selecciona una opción para continuar</p>
        </div>
      </div>
    </div>
  )
}
