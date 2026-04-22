/**
 * analytics.js
 * Google Analytics (GA4) + Firebase Analytics integration for ElectionAI.
 * 
 * Tracks:
 *   - Page/tab views
 *   - Chat interactions
 *   - Quiz completions
 *   - Timeline views
 */

// ─── GA4 Measurement ID ───────────────────────────────────────────────────────
const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID || '';

// ─── GA4 gtag helper ─────────────────────────────────────────────────────────

/**
 * Safely call gtag. No-ops if GA4 script hasn't loaded.
 */
function gtag(...args) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args);
  }
}

// ─── Initialise GA4 ──────────────────────────────────────────────────────────

/**
 * Inject the GA4 <script> tags dynamically.
 * Call once on app startup (main.jsx or App.jsx).
 */
export function initAnalytics() {
  if (!GA4_MEASUREMENT_ID) {
    console.info('[Analytics] GA4 Measurement ID not configured. Skipping GA4 init.');
    return;
  }
  if (typeof window === 'undefined') return;

  // Avoid double-injection
  if (document.getElementById('ga4-script')) return;

  // 1. Load the gtag.js library
  const script = document.createElement('script');
  script.id = 'ga4-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // 2. Bootstrap the data layer and configure GA4
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); }; // eslint-disable-line prefer-rest-params
  window.gtag('js', new Date());
  window.gtag('config', GA4_MEASUREMENT_ID, {
    send_page_view: false, // We'll fire page_view manually per tab
  });

  console.info('[Analytics] GA4 initialised with ID:', GA4_MEASUREMENT_ID);
}

// ─── Event helpers ────────────────────────────────────────────────────────────

/**
 * Log a page/tab view.
 * @param {string} tabId   - e.g. 'chat', 'timeline', 'faq', 'quiz', 'register'
 * @param {string} [lang]  - 'en' | 'hi'
 */
export function logPageView(tabId, lang = 'en') {
  // GA4
  gtag('event', 'page_view', {
    page_title: `ElectionAI – ${tabId}`,
    page_location: `${window.location.origin}/#${tabId}`,
    language: lang,
  });

  // Firebase Analytics (fires if firebase.js exports logFirebaseEvent)
  _firebaseLog('page_view', { tab_id: tabId, language: lang });
}

/**
 * Log a chat interaction (user sends a message).
 * @param {string} [lang] - 'en' | 'hi'
 */
export function logChatInteraction(lang = 'en') {
  gtag('event', 'chat_message_sent', {
    event_category: 'AI Chat',
    language: lang,
  });
  _firebaseLog('chat_message_sent', { language: lang });
}

/**
 * Log quiz completion.
 * @param {number} score      - Number correct
 * @param {number} total      - Total questions
 * @param {string} [lang]
 */
export function logQuizCompletion(score, total, lang = 'en') {
  const percentage = Math.round((score / total) * 100);
  gtag('event', 'quiz_completed', {
    event_category: 'Quiz',
    score,
    total_questions: total,
    percentage,
    language: lang,
  });
  _firebaseLog('quiz_completed', { score, total_questions: total, percentage, language: lang });
}

/**
 * Log timeline section view.
 * @param {string} [lang]
 */
export function logTimelineView(lang = 'en') {
  gtag('event', 'timeline_viewed', {
    event_category: 'Timeline',
    language: lang,
  });
  _firebaseLog('timeline_viewed', { language: lang });
}

// ─── Firebase Analytics passthrough ─────────────────────────────────────────

/**
 * Internal helper – forwards events to Firebase Analytics if available.
 * The actual logEvent import comes from firebase.js to keep this file
 * independent of Firebase's SDK loading woes.
 */
function _firebaseLog(eventName, params = {}) {
  try {
    // Dynamically access the Firebase logEvent exported from firebase.js
    // (imported lazily to avoid circular dependency issues)
    import('./firebase.js').then(({ logAnalyticsEvent }) => {
      if (typeof logAnalyticsEvent === 'function') {
        logAnalyticsEvent(eventName, params);
      }
    }).catch(() => {
      // Firebase analytics not available – silent fail
    });
  } catch {
    // noop
  }
}
