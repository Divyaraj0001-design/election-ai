/**
 * App.jsx
 * Root component for ElectionAI.
 * Manages global state: active tab, language, Firebase auth session.
 * Integrates GA4 + Firebase Analytics for event tracking.
 */
import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import ChatSection from './components/ChatSection.jsx';
import TimelineSection from './components/TimelineSection.jsx';
import RegistrationSection from './components/RegistrationSection.jsx';
import FAQSection from './components/FAQSection.jsx';
import QuizSection from './components/QuizSection.jsx';
import Footer from './components/Footer.jsx';
import { initAnalytics, logPageView } from './analytics.js';
import { signInAnonymousUser } from './firebase.js';

// Navigation tabs configuration
const TABS = [
  { id: 'chat',      label: { en: '💬 AI Chat',   hi: '💬 चैट' } },
  { id: 'timeline',  label: { en: '🗓️ Timeline',   hi: '🗓️ समयरेखा' } },
  { id: 'register',  label: { en: '📋 Register',   hi: '📋 पंजीकरण' } },
  { id: 'faq',       label: { en: '❓ FAQ',         hi: '❓ सवाल-जवाब' } },
  { id: 'quiz',      label: { en: '🧠 Quiz',        hi: '🧠 क्विज़' } },
];

export default function App() {
  // Active tab state
  const [activeTab, setActiveTab] = useState('chat');
  // Language toggle: 'en' | 'hi'
  const [lang, setLang] = useState('en');

  // ── On mount: init GA4 and sign in anonymously ──────────────────────────
  useEffect(() => {
    // Initialise Google Analytics 4
    initAnalytics();

    // Anonymous Firebase Auth — ties chat history to a session user
    signInAnonymousUser().catch(() => {
      // Silent fail — app works without Firebase
    });

    // Log initial page view (chat tab)
    logPageView('chat', lang);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Log page view on every tab switch ──────────────────────────────────
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    logPageView(tabId, lang);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* === Top Navigation Header === */}
      <Header lang={lang} setLang={setLang} />

      {/* === Tab Navigation Bar === */}
      <nav
        role="tablist"
        aria-label="Main navigation"
        className="sticky top-0 z-40 border-b"
        style={{
          background: 'rgba(15,23,42,0.85)',
          backdropFilter: 'blur(12px)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto"
             style={{ scrollbarWidth: 'none' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2 ${
                activeTab === tab.id
                  ? 'text-blue-400 border-blue-500'
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-600'
              }`}
            >
              {tab.label[lang]}
            </button>
          ))}
        </div>
      </nav>

      {/* === Main Content Area === */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Each section rendered based on active tab */}
        <div
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
        >
          {activeTab === 'chat'     && <ChatSection lang={lang} />}
          {activeTab === 'timeline' && <TimelineSection lang={lang} />}
          {activeTab === 'register' && <RegistrationSection lang={lang} />}
          {activeTab === 'faq'      && <FAQSection lang={lang} />}
          {activeTab === 'quiz'     && <QuizSection lang={lang} />}
        </div>
      </main>

      {/* === Footer === */}
      <Footer lang={lang} />
    </div>
  );
}
