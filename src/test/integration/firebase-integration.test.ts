import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore'
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth'
import { db, auth } from '../../lib/firebase'
import { 
  Registro, 
  Turno, 
  HistorialCambio,
  Categoria,
  UserRole 
} from '../../types'

describe('Firebase Integration Tests', () => {
  let testTurnoId: string
  let testRegistroId: string
  let testUserId: string
  
  // Datos de prueba
  const testTurno: Partial<Turno> = {
    inicio: new Date('2024-01-15T08:00:00'),
    fin: null,
    estado: 'activo',
    participantes: [
      { nombre: 'Dr. Test', rol: 'Cirujano', horario: '08:00 - 16:00' }
    ],
    equipo: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }
  
  const testRegistro: Partial<Registro> = {
    nombre: 'Paciente Test Integración',
    rut: '12345678-9',
    edad: 45,
    diagnostico: 'Test diagnóstico',
    habitacion: '101',
    cirujano: 'Dr. Test',
    hora: '10:00',
    cirugiaPropuesta: 'Test cirugía',
    categoria: 'pendiente',
    turnoId: null, // Se asignará después
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }

  beforeAll(async () => {
    // Verificar que Firebase esté configurado
    expect(db).toBeDefined()
    expect(auth).toBeDefined()
    
    console.log('🔥 Firebase configurado correctamente')
  })

  afterAll(async () => {
    // Limpiar datos de prueba
    if (testRegistroId) {
      try {
        await deleteDoc(doc(db, 'registros', testRegistroId))
        console.log('🧹 Registro de prueba eliminado')
      } catch (error) {
        console.log('⚠️ No se pudo eliminar registro de prueba:', error)
      }
    }
    
    if (testTurnoId) {
      try {
        await deleteDoc(doc(db, 'turnos', testTurnoId))
        console.log('🧹 Turno de prueba eliminado')
      } catch (error) {
        console.log('⚠️ No se pudo eliminar turno de prueba:', error)
      }
    }
  })

  describe('Authentication', () => {
    it('should connect to Firebase Auth', () => {
      expect(auth).toBeDefined()
      expect(typeof auth.app.options.projectId).toBe('string')
    })

    it('should handle auth state changes', (done) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        expect(user === null || typeof user.uid === 'string').toBe(true)
        unsubscribe()
        done()
      })
    })
  })

  describe('Firestore Connection', () => {
    it('should connect to Firestore', () => {
      expect(db).toBeDefined()
      expect(typeof db.app.options.projectId).toBe('string')
    })

    it('should be able to read collections', async () => {
      const snapshot = await getDocs(collection(db, 'turnos'))
      expect(Array.isArray(snapshot.docs)).toBe(true)
    })
  })

  describe('Turno Operations', () => {
    it('should create a new turno', async () => {
      const docRef = await addDoc(collection(db, 'turnos'), testTurno)
      testTurnoId = docRef.id
      
      expect(testTurnoId).toBeDefined()
      expect(typeof testTurnoId).toBe('string')
      expect(testTurnoId.length).toBeGreaterThan(0)
      
      console.log('✅ Turno creado:', testTurnoId)
    })

    it('should read the created turno', async () => {
      const docSnap = await getDoc(doc(db, 'turnos', testTurnoId))
      expect(docSnap.exists()).toBe(true)
      
      const data = docSnap.data()
      expect(data.nombre).toBe(testTurno.nombre)
      expect(data.estado).toBe('activo')
    })

    it('should update turno', async () => {
      const updates = {
        estado: 'cerrado',
        fin: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      await updateDoc(doc(db, 'turnos', testTurnoId), updates)
      
      const docSnap = await getDoc(doc(db, 'turnos', testTurnoId))
      const data = docSnap.data()
      expect(data.estado).toBe('cerrado')
    })

    it('should query turnos by status', async () => {
      const q = query(
        collection(db, 'turnos'),
        where('estado', '==', 'cerrado'),
        orderBy('fin', 'desc')
      )
      
      const snapshot = await getDocs(q)
      expect(Array.isArray(snapshot.docs)).toBe(true)
      
      // Debería encontrar al menos nuestro turno de prueba
      const found = snapshot.docs.find(doc => doc.id === testTurnoId)
      expect(found).toBeDefined()
    })
  })

  describe('Registro Operations', () => {
    it('should create a new registro', async () => {
      const registroData = { ...testRegistro, turnoId: testTurnoId }
      const docRef = await addDoc(collection(db, 'registros'), registroData)
      testRegistroId = docRef.id
      
      expect(testRegistroId).toBeDefined()
      expect(typeof testRegistroId).toBe('string')
      
      console.log('✅ Registro creado:', testRegistroId)
    })

    it('should read the created registro', async () => {
      const docSnap = await getDoc(doc(db, 'registros', testRegistroId))
      expect(docSnap.exists()).toBe(true)
      
      const data = docSnap.data()
      expect(data.nombre).toBe(testRegistro.nombre)
      expect(data.turnoId).toBe(testTurnoId)
    })

    it('should update registro', async () => {
      const updates = {
        categoria: 'operado',
        cirugiaRealizada: 'Test cirugía completada',
        diagnosticoPostoperatorio: 'Paciente estable',
        updatedAt: serverTimestamp()
      }
      
      await updateDoc(doc(db, 'registros', testRegistroId), updates)
      
      const docSnap = await getDoc(doc(db, 'registros', testRegistroId))
      const data = docSnap.data()
      expect(data.categoria).toBe('operado')
      expect(data.cirugiaRealizada).toBe('Test cirugía completada')
    })

    it('should query registros by turno', async () => {
      const q = query(
        collection(db, 'registros'),
        where('turnoId', '==', testTurnoId),
        orderBy('createdAt', 'desc')
      )
      
      const snapshot = await getDocs(q)
      expect(Array.isArray(snapshot.docs)).toBe(true)
      expect(snapshot.docs.length).toBeGreaterThan(0)
      
      const found = snapshot.docs.find(doc => doc.id === testRegistroId)
      expect(found).toBeDefined()
    })
  })

  describe('Real-time Updates', () => {
    it('should listen to real-time changes', (done) => {
      const q = query(
        collection(db, 'registros'),
        where('turnoId', '==', testTurnoId),
        limit(1)
      )
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        expect(Array.isArray(snapshot.docs)).toBe(true)
        unsubscribe()
        done()
      })
    })
  })

  describe('Batch Operations', () => {
    it('should perform batch updates', async () => {
      const batch = writeBatch(db)
      
      // Actualizar múltiples documentos en lote
      batch.update(doc(db, 'registros', testRegistroId), {
        updatedAt: serverTimestamp(),
        batchUpdated: true
      })
      
      batch.update(doc(db, 'turnos', testTurnoId), {
        updatedAt: serverTimestamp(),
        batchUpdated: true
      })
      
      await batch.commit()
      
      // Verificar que los cambios se aplicaron
      const registroSnap = await getDoc(doc(db, 'registros', testRegistroId))
      const turnoSnap = await getDoc(doc(db, 'turnos', testTurnoId))
      
      expect(registroSnap.data().batchUpdated).toBe(true)
      expect(turnoSnap.data().batchUpdated).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid document reads gracefully', async () => {
      const docSnap = await getDoc(doc(db, 'registros', 'invalid-id'))
      expect(docSnap.exists()).toBe(false)
    })

    it('should handle collection queries with no results', async () => {
      const q = query(
        collection(db, 'registros'),
        where('turnoId', '==', 'non-existent-turno')
      )
      
      const snapshot = await getDocs(q)
      expect(snapshot.empty).toBe(true)
      expect(snapshot.docs.length).toBe(0)
    })
  })
})
