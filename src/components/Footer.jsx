/**
 * Footer.jsx
 * App footer with hackathon info, disclaimer, and links.
 */
import React from 'react';

export default function Footer({ lang }) {
  return (
    <footer
      className="border-t mt-8"
      style={{ borderColor: 'var(--color-border)', background: 'rgba(15,23,42,0.6)' }}
      role="contentinfo"
    >
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">🗳️</span>
            <div>
              <p className="font-bold text-sm gradient-text">ElectionAI</p>
              <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
                {lang === 'en' ? 'Election Education Assistant' : 'चुनाव शिक्षा सहायक'}
              </p>
            </div>
          </div>

          {/* Hackathon badge */}
          <div className="flex items-center gap-2">
            <span
              className="text-xs px-3 py-1.5 rounded-full font-semibold"
              style={{
                background: 'rgba(249,115,22,0.15)',
                border: '1px solid rgba(249,115,22,0.3)',
                color: '#fb923c',
              }}
            >
              🏆 PromptWars Hackathon · Hack2skill 2025
            </span>
          </div>
        </div>

        {/* Tech stack */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          {[
            { label: 'React 18', color: '#61dafb' },
            { label: 'Vite', color: '#646cff' },
            { label: 'Tailwind CSS', color: '#38bdf8' },
            { label: 'Gemini 1.5 Flash', color: '#4285f4' },
            { label: 'Firebase Firestore', color: '#ffa611' },
          ].map((tech, i) => (
            <span
              key={i}
              className="text-xs px-2.5 py-1 rounded-full"
              style={{
                background: `${tech.color}18`,
                border: `1px solid ${tech.color}35`,
                color: tech.color,
              }}
            >
              {tech.label}
            </span>
          ))}
        </div>

        {/* Disclaimer */}
        <div
          className="text-center text-xs rounded-xl px-4 py-3"
          style={{
            background: 'rgba(30,41,59,0.5)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-muted)',
            lineHeight: 1.6,
          }}
        >
          ⚖️{' '}
          {lang === 'en'
            ? 'ElectionAI is a non-partisan civic education tool. This app does not endorse any political party, candidate, or ideology. Information is provided for educational purposes only. For official election information, visit '
            : 'ElectionAI एक गैर-पक्षपाती नागरिक शिक्षा उपकरण है। यह ऐप किसी राजनीतिक दल, उम्मीदवार या विचारधारा का समर्थन नहीं करता। आधिकारिक जानकारी के लिए देखें: '}
          <a
            href="https://eci.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#60a5fa' }}
            aria-label="Visit Election Commission of India website"
          >
            eci.gov.in
          </a>
        </div>

        {/* Bottom bar */}
        <p className="text-center text-xs mt-3" style={{ color: 'var(--color-muted)' }}>
          {lang === 'en'
            ? '🇮🇳 Built with ❤️ for civic empowerment | Open Source'
            : '🇮🇳 नागरिक सशक्तीकरण के लिए ❤️ से बनाया गया | ओपन सोर्स'}
        </p>
      </div>
    </footer>
  );
}
