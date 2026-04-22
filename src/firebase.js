/**
 * firebase.js
 * Firebase initialization for ElectionAI.
 * Services:
 *   - Firestore  – chat history persistence
 *   - Auth       – anonymous sign-in so history is tied to a session user
 *   - Analytics  – Firebase Analytics event logging
 * Keys come from environment variables (VITE_ prefix).
 */
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getAnalytics,
  logEvent,
  isSupported as analyticsIsSupported,
} from 'firebase/analytics';

// ─── Firebase project config from .env ────────────────────────────────────
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID, // optional for Firebase Analytics
};

// ─── Singleton instances ──────────────────────────────────────────────────
let app;
let db;
let auth;
let analytics;

const isConfigured =
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== 'your_project_id' &&
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'your_firebase_api_key_here';

try {
  if (isConfigured) {
    app = initializeApp(firebaseConfig);

    // Firestore
    db = getFirestore(app);

    // Auth
    auth = getAuth(app);

    // Firebase Analytics (async – not all environments support it)
    analyticsIsSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
        console.info('[Firebase] Analytics initialised.');
      }
    }).catch(() => {
      // Silently skip if unsupported
    });
  } else {
    console.info('[Firebase] Not fully configured. Using local-only mode.');
  }
} catch (err) {
  console.warn('[Firebase] Initialisation failed. Running without Firebase.', err);
}

// ─── Anonymous Authentication ─────────────────────────────────────────────

/**
 * Sign the user in anonymously so Firestore security rules can
 * identify the session. Safe to call multiple times (idempotent).
 * @returns {Promise<import('firebase/auth').User|null>}
 */
export async function signInAnonymousUser() {
  if (!auth) return null;
  try {
    const result = await signInAnonymously(auth);
    console.info('[Firebase Auth] Signed in anonymously. UID:', result.user.uid);
    return result.user;
  } catch (err) {
    console.warn('[Firebase Auth] Anonymous sign-in failed:', err);
    return null;
  }
}

/**
 * Subscribe to auth state changes.
 * @param {function} callback - Called with the User object or null.
 * @returns {function} Unsubscribe function.
 */
export function onUserAuthChange(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

// ─── Firestore Chat History ───────────────────────────────────────────────

/**
 * Save a chat message to Firestore.
 * @param {string} sessionId - Unique session identifier (or Firebase UID)
 * @param {'user'|'ai'} role - Who sent the message
 * @param {string} content   - Message text
 */
export async function saveChatMessage(sessionId, role, content) {
  if (!db) return;
  try {
    await addDoc(collection(db, 'chatHistory'), {
      sessionId,
      role,
      content,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('[Firestore] Failed to save message:', err);
  }
}

/**
 * Load recent chat history for a session.
 * @param {string} sessionId
 * @param {number} [messageLimit=50]
 * @returns {Promise<Array>} Array of message objects
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
    console.warn('[Firestore] Failed to load history:', err);
    return [];
  }
}

// ─── Firebase Analytics ───────────────────────────────────────────────────

/**
 * Log an event to Firebase Analytics.
 * Used by analytics.js as a passthrough.
 * @param {string} eventName
 * @param {object} [params]
 */
export function logAnalyticsEvent(eventName, params = {}) {
  if (!analytics) return;
  try {
    logEvent(analytics, eventName, params);
  } catch (err) {
    console.warn('[Firebase Analytics] logEvent failed:', err);
  }
}

export { db, auth };
