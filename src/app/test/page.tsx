export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          ¡AgendaQX Funciona!
        </h1>
        <p className="text-gray-600 mb-6">
          La aplicación está funcionando correctamente
        </p>
        <div className="space-y-2">
          <a 
            href="/login" 
            className="block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Ir al Login
          </a>
          <a 
            href="/dashboard" 
            className="block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Ir al Dashboard
          </a>
          <a 
            href="/turno" 
            className="block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Ir al Turno
          </a>
        </div>
      </div>
    </div>
  )
}


