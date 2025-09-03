import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { PDFGenerator } from './pdf-generator';
import { 
  CloseTurnRequest, 
  Turno, 
  Registro, 
  LibroHistoricoItem,
  Categoria 
} from './types';

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();
const storage = admin.storage();

export const cerrarTurno = functions
  .region('us-central1')
  .runWith({
    timeoutSeconds: 540, // 9 minutes
    memory: '2GB'
  })
  .https.onCall(async (data: CloseTurnRequest, context) => {
    // Verify authentication
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Usuario no autenticado'
      );
    }

    const { turnoId, participantes, cerradoPor, cerradoPorNombre } = data;

    try {
      // Use a transaction to ensure data consistency
      const result = await db.runTransaction(async (transaction) => {
        // Get the turno document
        const turnoRef = db.collection('turnos').doc(turnoId);
        const turnoDoc = await transaction.get(turnoRef);

        if (!turnoDoc.exists) {
          throw new functions.https.HttpsError(
            'not-found',
            'Turno no encontrado'
          );
        }

        const turno = turnoDoc.data() as Turno;

        // Check if turno is already closed
        if (turno.cerrado) {
          throw new functions.https.HttpsError(
            'already-exists',
            'El turno ya está cerrado'
          );
        }

        // Get all registros for this turno
        const registrosSnapshot = await transaction.get(
          db.collection('registros').where('turnoId', '==', turnoId)
        );

        const registros = registrosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Registro[];

        const cerradoEn = new Date();

        // Update turno with closure information
        const turnoUpdates = {
          cerrado: true,
          cerradoPor,
          cerradoPorNombre,
          cerradoEn,
          participantes,
          actualizadoEn: cerradoEn
        };

        transaction.update(turnoRef, turnoUpdates);

        // Process registros based on category
        const registrosToArchive: Registro[] = [];
        const registrosToUpdate: { id: string; updates: any }[] = [];

        registros.forEach(registro => {
          if (registro.categoria === 'PENDIENTE') {
            // Mark PENDIENTE registros for carry-over
            registrosToUpdate.push({
              id: registro.id!,
              updates: {
                arrastre: true,
                actualizadoEn: cerradoEn
              }
            });
          } else {
            // Archive other categories
            registrosToArchive.push(registro);
          }
        });

        // Update PENDIENTE registros
        registrosToUpdate.forEach(({ id, updates }) => {
          const registroRef = db.collection('registros').doc(id);
          transaction.update(registroRef, updates);
        });

        // Archive other registros to libroHistorico
        registrosToArchive.forEach(registro => {
          const historicoItem: Omit<LibroHistoricoItem, 'id'> = {
            turnoId,
            registro,
            cerradoEn,
            cerradoPor,
            cerradoPorNombre
          };

          const historicoRef = db
            .collection('libroHistorico')
            .doc(turnoId)
            .collection('items')
            .doc();

          transaction.set(historicoRef, historicoItem);

          // Delete the original registro
          const registroRef = db.collection('registros').doc(registro.id!);
          transaction.delete(registroRef);
        });

        return {
          turno: { ...turno, ...turnoUpdates },
          registros,
          registrosArchivados: registrosToArchive.length,
          registrosArrastrados: registrosToUpdate.length
        };
      });

      // Generate PDF report
      const pdfGenerator = new PDFGenerator();
      const pdfData = {
        turno: result.turno,
        registros: result.registros,
        participantes,
        equipo: result.turno.equipo,
        cerradoPor,
        cerradoPorNombre,
        cerradoEn: result.turno.cerradoEn!
      };

      const pdfDoc = pdfGenerator.generateTurnReport(pdfData);
      
      // Convert PDF to buffer
      const pdfChunks: Buffer[] = [];
      pdfDoc.on('data', (chunk) => pdfChunks.push(chunk));
      
      await new Promise<void>((resolve, reject) => {
        pdfDoc.on('end', () => resolve());
        pdfDoc.on('error', reject);
        pdfDoc.end();
      });

      const pdfBuffer = Buffer.concat(pdfChunks);
      const fileName = `reportes/turno-${turnoId}-${Date.now()}.pdf`;
      const file = storage.bucket().file(fileName);

      // Upload PDF to Storage
      await file.save(pdfBuffer, {
        metadata: {
          contentType: 'application/pdf',
          metadata: {
            turnoId,
            cerradoPor,
            cerradoEn: result.turno.cerradoEn!.toISOString()
          }
        }
      });

      // Get download URL
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '03-01-2500' // Far future expiration
      });

      // Update turno with PDF URL
      await db.collection('turnos').doc(turnoId).update({
        reporteUrl: url
      });

      return {
        success: true,
        message: 'Turno cerrado correctamente',
        data: {
          turnoId,
          registrosArchivados: result.registrosArchivados,
          registrosArrastrados: result.registrosArrastrados,
          reporteUrl: url
        }
      };

    } catch (error) {
      console.error('Error closing turno:', error);
      
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }

      throw new functions.https.HttpsError(
        'internal',
        'Error interno al cerrar el turno',
        error
      );
    }
  });

// Helper function to get current turno
export const getCurrentTurno = functions
  .region('us-central1')
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Usuario no autenticado'
      );
    }

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const turnosSnapshot = await db
        .collection('turnos')
        .where('inicio', '>=', today)
        .where('inicio', '<', tomorrow)
        .where('cerrado', '==', false)
        .orderBy('inicio', 'desc')
        .limit(1)
        .get();

      if (turnosSnapshot.empty) {
        return null;
      }

      const turnoDoc = turnosSnapshot.docs[0];
      return {
        id: turnoDoc.id,
        ...turnoDoc.data()
      };

    } catch (error) {
      console.error('Error getting current turno:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Error interno al obtener el turno actual',
        error
      );
    }
  });

// Función para asignar rol a un usuario
export const setUserRole = functions.https.onCall(async (data, context) => {
  // Verificar que el usuario esté autenticado
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
  }

  const { uid, role } = data;

  // Verificar que se proporcionen los datos necesarios
  if (!uid || !role) {
    throw new functions.https.HttpsError('invalid-argument', 'Se requiere uid y role');
  }

  // Verificar que el rol sea válido
  const validRoles = ['full', 'edit', 'view'];
  if (!validRoles.includes(role)) {
    throw new functions.https.HttpsError('invalid-argument', 'Rol no válido. Debe ser: full, edit, o view');
  }

  try {
    // Asignar custom claim
    await admin.auth().setCustomUserClaims(uid, { role });
    
    console.log(`✅ Rol ${role} asignado al usuario ${uid}`);
    
    return {
      success: true,
      message: `Rol ${role} asignado exitosamente al usuario ${uid}`,
      uid,
      role
    };
  } catch (error) {
    console.error('❌ Error asignando rol:', error);
    throw new functions.https.HttpsError('internal', 'Error interno asignando rol');
  }
});

// Función para obtener el rol de un usuario
export const getUserRole = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
  }

  const { uid } = data;

  if (!uid) {
    throw new functions.https.HttpsError('invalid-argument', 'Se requiere uid');
  }

  try {
    const userRecord = await admin.auth().getUser(uid);
    const customClaims = userRecord.customClaims || {};
    
    return {
      success: true,
      uid,
      role: customClaims.role || 'sin-rol',
      customClaims
    };
  } catch (error) {
    console.error('❌ Error obteniendo rol:', error);
    throw new functions.https.HttpsError('internal', 'Error interno obteniendo rol');
  }
});

// Función para listar todos los usuarios con roles
export const listUsersWithRoles = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
  }

  try {
    const listUsersResult = await admin.auth().listUsers();
    const usersWithRoles = listUsersResult.users.map(user => ({
      uid: user.uid,
      email: user.email,
      role: user.customClaims?.role || 'sin-rol',
      displayName: user.displayName,
      emailVerified: user.emailVerified,
      disabled: user.disabled
    }));
    
    return {
      success: true,
      users: usersWithRoles,
      total: usersWithRoles.length
    };
  } catch (error) {
    console.error('❌ Error listando usuarios:', error);
    throw new functions.https.HttpsError('internal', 'Error interno listando usuarios');
  }
});


