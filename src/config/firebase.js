import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Check if Firebase is configured
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'undefined' &&
  firebaseConfig.projectId !== 'undefined'
)

// Log configuration status (only in development)
if (import.meta.env.DEV) {
  console.log('Firebase Config Status:', {
    configured: isFirebaseConfigured,
    projectId: firebaseConfig.projectId || 'NOT SET',
    hasApiKey: Boolean(firebaseConfig.apiKey)
  })
}

// Initialize Firebase only if configured
let app = null
let storage = null
let db = null
let auth = null

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig)
    storage = getStorage(app)
    db = getFirestore(app)
    auth = getAuth(app)
    console.log('✅ Firebase initialized successfully')
  } catch (error) {
    console.error('❌ Firebase initialization error:', error)
  }
} else {
  console.log('⚠️ Firebase not configured - running in demo mode')
}

export { storage, db, auth }
export default app
