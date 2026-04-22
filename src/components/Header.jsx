/**
 * Header.jsx
 * Top navigation bar with branding, language toggle, and hackathon badge.
 */
import React from 'react';

export default function Header({ lang, setLang }) {
  return (
    <header
      className="border-b"
      style={{
        background: 'linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,41,59,0.95))',
        borderColor: 'var(--color-border)',
      }}
      role="banner"
    >
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        {/* === Brand / Logo === */}
        <div className="flex items-center gap-3">
          {/* Animated vote icon */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl pulse-ring"
            style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
            aria-hidden="true"
          >
            🗳️
          </div>
          <div>
            <h1
              className="text-lg font-bold leading-tight gradient-text"
              style={{ margin: 0 }}
            >
              ElectionAI
            </h1>
            <p className="text-xs" style={{ color: 'var(--color-muted)', margin: 0 }}>
              {lang === 'en'
                ? 'Election Education Assistant'
                : 'चुनाव शिक्षा सहायक'}
            </p>
          </div>
        </div>

        {/* === Right side: hackathon badge + language toggle === */}
        <div className="flex items-center gap-3">
          {/* Hackathon badge */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(234,88,12,0.15))',
              border: '1px solid rgba(249,115,22,0.4)',
              color: '#fb923c',
            }}
            aria-label="PromptWars Hackathon by Hack2skill"
          >
            🏆 PromptWars · Hack2skill
          </div>

          {/* Language toggle button */}
          <button
            onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              background: 'rgba(59,130,246,0.15)',
              border: '1px solid rgba(59,130,246,0.3)',
              color: '#60a5fa',
            }}
            aria-label={lang === 'en' ? 'Switch to Hindi' : 'English में बदलें'}
          >
            <span aria-hidden="true">{lang === 'en' ? '🇮🇳' : '🇬🇧'}</span>
            <span>{lang === 'en' ? 'हिंदी' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* === Powered-by strip === */}
      <div
        className="px-4 py-1.5 flex items-center justify-center gap-2 text-xs"
        style={{
          background: 'rgba(59,130,246,0.06)',
          borderTop: '1px solid var(--color-border)',
          color: 'var(--color-muted)',
        }}
      >
        <span>⚡ Powered by</span>
        <span style={{ color: '#60a5fa', fontWeight: 600 }}>Google Gemini 1.5 Flash</span>
        <span>·</span>
        <span style={{ color: '#a78bfa', fontWeight: 600 }}>Firebase Firestore</span>
        <span>·</span>
        <span style={{ color: '#34d399', fontWeight: 600 }}>React + Vite</span>
      </div>
    </header>
  );
}
