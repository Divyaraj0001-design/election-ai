/**
 * firebase.js
 * Firebase initialization for ElectionAI.
 * Handles Firestore chat history persistence.
 * Keys come from environment variables (VITE_ prefix).
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

// Firebase project config from .env
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase app (singleton)
let app;
let db;

try {
  // Only initialize if a valid project ID is provided
  if (firebaseConfig.projectId && firebaseConfig.projectId !== 'your_project_id') {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
} catch (err) {
  console.warn('Firebase not configured. Chat history will not be persisted.', err);
}

/**
 * Save a chat message to Firestore.
 * @param {string} sessionId - Unique session identifier
 * @param {'user'|'ai'} role - Who sent the message
 * @param {string} content - Message text
 */
export async function saveChatMessage(sessionId, role, content) {
  if (!db) return; // Silently skip if Firebase not configured
  try {
    await addDoc(collection(db, 'chatHistory'), {
      sessionId,
      role,
      content,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Failed to save message:', err);
  }
}

/**
 * Load recent chat history for a session.
 * @param {string} sessionId
 * @param {number} messageLimit
 * @returns {Array} Array of message objects
 */
export async function loadChatHistory(sessionId, messageLimit = 50) {
  if (!db) return [];
  try {
    const q = query(
      collection(db, 'chatHistory'),
      orderBy('timestamp', 'asc'),
      limit(messageLimit)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map(doc => doc.data())
      .filter(msg => msg.sessionId === sessionId);
  } catch (err) {
    console.warn('Failed to load history:', err);
    return [];
  }
}

export { db };
