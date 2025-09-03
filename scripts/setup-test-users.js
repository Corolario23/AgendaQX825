const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const { getFunctions, httpsCallable } = require('firebase/functions');

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const functions = getFunctions(app);

// Test users configuration
const testUsers = [
  {
    email: 'admin@agendaqx.com',
    password: 'admin123',
    nombre: 'Dr. Juan Pérez',
    rol: 'full'
  },
  {
    email: 'editor@agendaqx.com',
    password: 'editor123',
    nombre: 'Dra. María González',
    rol: 'edit'
  },
  {
    email: 'viewer@agendaqx.com',
    password: 'viewer123',
    nombre: 'Dr. Carlos López',
    rol: 'view'
  }
];

// Function to set custom claims (requires Cloud Function)
async function setCustomClaims(uid, claims) {
  try {
    const setClaims = httpsCallable(functions, 'setCustomClaims');
    await setClaims({ uid, claims });
    console.log(`✅ Custom claims set for ${uid}:`, claims);
  } catch (error) {
    console.error(`❌ Error setting custom claims for ${uid}:`, error);
  }
}

// Function to create user and set claims
async function createUserWithClaims(userConfig) {
  try {
    console.log(`\n🔄 Creating user: ${userConfig.email}`);
    
    // Create user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userConfig.email,
      userConfig.password
    );
    
    const user = userCredential.user;
    console.log(`✅ User created: ${user.uid}`);
    
    // Set custom claims
    const claims = {
      role: userConfig.rol,
      nombre: userConfig.nombre
    };
    
    await setCustomClaims(user.uid, claims);
    
    console.log(`✅ User ${userConfig.email} setup complete!`);
    console.log(`   - UID: ${user.uid}`);
    console.log(`   - Role: ${userConfig.rol}`);
    console.log(`   - Name: ${userConfig.nombre}`);
    
    return user;
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log(`⚠️ User ${userConfig.email} already exists, signing in...`);
      
      // Sign in to get user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        userConfig.email,
        userConfig.password
      );
      
      const user = userCredential.user;
      
      // Update custom claims
      const claims = {
        role: userConfig.rol,
        nombre: userConfig.nombre
      };
      
      await setCustomClaims(user.uid, claims);
      
      console.log(`✅ User ${userConfig.email} updated!`);
      console.log(`   - UID: ${user.uid}`);
      console.log(`   - Role: ${userConfig.rol}`);
      console.log(`   - Name: ${userConfig.nombre}`);
      
      return user;
    } else {
      console.error(`❌ Error creating user ${userConfig.email}:`, error);
      throw error;
    }
  }
}

// Main function
async function setupTestUsers() {
  console.log('🚀 Setting up test users for AgendaQX...\n');
  
  try {
    for (const userConfig of testUsers) {
      await createUserWithClaims(userConfig);
    }
    
    console.log('\n🎉 All test users setup complete!');
    console.log('\n📋 Test Users Summary:');
    console.log('┌─────────────────┬─────────────┬─────────────┐');
    console.log('│ Email           │ Password    │ Role        │');
    console.log('├─────────────────┼─────────────┼─────────────┤');
    testUsers.forEach(user => {
      console.log(`│ ${user.email.padEnd(15)} │ ${user.password.padEnd(11)} │ ${user.rol.padEnd(11)} │`);
    });
    console.log('└─────────────────┴─────────────┴─────────────┘');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  setupTestUsers();
}

module.exports = { setupTestUsers, createUserWithClaims };
