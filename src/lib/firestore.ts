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
  Timestamp,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore'
import { db } from './firebase'
import { 
  Registro, 
  Turno, 
  HistorialCambio, 
  LibroHistoricoItem,
  Categoria,
  Usuario
} from '../types'

// Collections
export const COLLECTIONS = {
  TURNOS: 'turnos',
  REGISTROS: 'registros',
  HISTORIAL_CAMBIOS: 'historialCambios',
  LIBRO_HISTORICO: 'libroHistorico',
  USUARIOS: 'users'
} as const

// Utility functions
export const timestampToDate = (timestamp: Timestamp | null): Date | null => {
  return timestamp ? timestamp.toDate() : null
}

export const dateToTimestamp = (date: Date | null): Timestamp | null => {
  return date ? Timestamp.fromDate(date) : null
}

export const docToData = <T>(doc: any): T => {
  if (!doc.exists()) return null as T
  const data = doc.data()
  return { id: doc.id, ...data } as T
}

// Turno Service
export const turnoService = {
  async getCurrentTurn(callback: (turno: Turno | null) => void) {
    const q = query(
      collection(db, COLLECTIONS.TURNOS),
      where('estado', '==', 'activo'),
      orderBy('inicio', 'desc'),
      limit(1)
    )
    
    return onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        callback(null)
        return
      }
      
      const turno = docToData<Turno>(snapshot.docs[0])
      callback(turno)
    })
  },

  async createTurn(turnoData: Partial<Turno>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.TURNOS), {
      ...turnoData,
      estado: 'activo',
      inicio: serverTimestamp(),
      createdAt: serverTimestamp()
    })
    return docRef.id
  },

  async updateTurn(turnoId: string, updates: Partial<Turno>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.TURNOS, turnoId)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
  },

  async getTurnById(turnoId: string): Promise<Turno | null> {
    const docRef = doc(db, COLLECTIONS.TURNOS, turnoId)
    const docSnap = await getDoc(docRef)
    return docToData<Turno>(docSnap)
  },

  async getClosedTurns(): Promise<Turno[]> {
    const q = query(
      collection(db, COLLECTIONS.TURNOS),
      where('estado', '==', 'cerrado'),
      orderBy('fin', 'desc')
    )
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => docToData<Turno>(doc))
  },

  async closeTurn(turnoId: string, participantes: any[], userId: string, userName: string): Promise<any> {
    const docRef = doc(db, COLLECTIONS.TURNOS, turnoId)
    await updateDoc(docRef, {
      estado: 'cerrado',
      fin: serverTimestamp(),
      participantes,
      cerradoPor: { id: userId, nombre: userName },
      updatedAt: serverTimestamp()
    })
    
    return {
      success: true,
      message: 'Turno cerrado correctamente',
      data: {
        turnoId,
        registrosArchivados: 0,
        registrosArrastrados: 0,
        reporteUrl: null
      }
    }
  }
}

// Registro Service
export const registroService = {
  async getRegistrosByTurn(turnoId: string, callback: (registros: Registro[]) => void) {
    const q = query(
      collection(db, COLLECTIONS.REGISTROS),
      where('turnoId', '==', turnoId),
      orderBy('createdAt', 'desc')
    )
    
    return onSnapshot(q, (snapshot) => {
      const registros = snapshot.docs.map(doc => docToData<Registro>(doc))
      callback(registros)
    })
  },

  async createRegistro(registroData: Partial<Registro>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.REGISTROS), {
      ...registroData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return docRef.id
  },

  async updateRegistro(registroId: string, updates: Partial<Registro>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.REGISTROS, registroId)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
  },

  async deleteRegistro(registroId: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.REGISTROS, registroId)
    await deleteDoc(docRef)
  },

  async getRegistroById(registroId: string): Promise<Registro | null> {
    const docRef = doc(db, COLLECTIONS.REGISTROS, registroId)
    const docSnap = await getDoc(docRef)
    return docToData<Registro>(docSnap)
  },

  async searchRegistros(query: string, turnoId: string): Promise<Registro[]> {
    const q = query(
      collection(db, COLLECTIONS.REGISTROS),
      where('turnoId', '==', turnoId),
      where('nombre', '>=', query),
      where('nombre', '<=', query + '\uf8ff')
    )
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => docToData<Registro>(doc))
  }
}

// Historial Service
export const historialService = {
  async addChange(registroId: string, cambio: Partial<HistorialCambio>): Promise<void> {
    await addDoc(collection(db, COLLECTIONS.HISTORIAL_CAMBIOS), {
      registroId,
      ...cambio,
      timestamp: serverTimestamp()
    })
  },

  async getChangesByRegistro(registroId: string): Promise<HistorialCambio[]> {
    const q = query(
      collection(db, COLLECTIONS.HISTORIAL_CAMBIOS),
      where('registroId', '==', registroId),
      orderBy('timestamp', 'desc')
    )
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => docToData<HistorialCambio>(doc))
  }
}

// Real-time Service
export const realtimeService = {
  onRegistrosChange(turnoId: string, callback: (registros: Registro[]) => void) {
    return registroService.getRegistrosByTurn(turnoId, callback)
  },

  onTurnoChange(turnoId: string, callback: (turno: Turno | null) => void) {
    return turnoService.getCurrentTurn(callback)
  }
}

// Batch Service
export const batchService = {
  async batchUpdate(updates: Array<{ collection: string, docId: string, data: any }>) {
    const batch = writeBatch(db)
    
    updates.forEach(({ collection: col, docId, data }) => {
      const docRef = doc(db, col, docId)
      batch.update(docRef, data)
    })
    
    await batch.commit()
  }
}

// Libro Historico Service
export const libroHistoricoService = {
  async addToHistory(item: Partial<LibroHistoricoItem>): Promise<void> {
    await addDoc(collection(db, COLLECTIONS.LIBRO_HISTORICO), {
      ...item,
      createdAt: serverTimestamp()
    })
  },

  async getHistoryByDateRange(startDate: Date, endDate: Date): Promise<LibroHistoricoItem[]> {
    const q = query(
      collection(db, COLLECTIONS.LIBRO_HISTORICO),
      where('fecha', '>=', startDate),
      where('fecha', '<=', endDate),
      orderBy('fecha', 'desc')
    )
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => docToData<LibroHistoricoItem>(doc))
  }
}
