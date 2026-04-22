/**
 * RegistrationSection.jsx
 * Step-by-step voter registration guide for India.
 * Includes required documents list and official links.
 */
import React, { useState } from 'react';

// Registration steps data (bilingual)
const STEPS = {
  en: [
    {
      num: '01',
      icon: '✅',
      title: 'Check Your Eligibility',
      color: '#22d3ee',
      desc: 'You must be an Indian citizen, at least 18 years old on January 1st of the qualifying year, and ordinarily resident in your constituency.',
      tip: 'Tip: You can register in the constituency where you currently live, not just where you were born.',
    },
    {
      num: '02',
      icon: '🌐',
      title: 'Visit the Official Portal',
      color: '#3b82f6',
      desc: 'Go to voters.eci.gov.in or download the "Voter Helpline" app (available on Android and iOS). You can also visit your nearest Booth Level Officer (BLO).',
      tip: 'Tip: The Voter Helpline number is 1950 — available in all states.',
    },
    {
      num: '03',
      icon: '📋',
      title: 'Fill Form 6',
      color: '#8b5cf6',
      desc: 'Form 6 is for new voter registration. Fill in your personal details, address, and attach required documents. Available online and at ERO/AERO offices.',
      tip: 'Tip: Form 6A is for Overseas Indian citizens (NRIs) wanting to register.',
    },
    {
      num: '04',
      icon: '📎',
      title: 'Attach Required Documents',
      color: '#f59e0b',
      desc: 'You must provide proof of age, proof of address, and a recent passport-size photograph. Documents must be self-attested copies.',
      tip: 'Tip: Aadhaar card alone is accepted as both age and address proof at many ERO offices.',
    },
    {
      num: '05',
      icon: '📬',
      title: 'Submit & Track',
      color: '#10b981',
      desc: 'Submit online via the portal or physically at the ERO/AERO office. You\'ll get a reference number to track your application status.',
      tip: 'Tip: Online submissions are faster — typically processed within 2–4 weeks.',
    },
    {
      num: '06',
      icon: '🪪',
      title: 'Receive Your EPIC Card',
      color: '#f97316',
      desc: 'Upon approval, your Elector\'s Photo Identity Card (EPIC/Voter ID) will be dispatched to your registered address, or you can collect it from the BLO.',
      tip: 'Tip: You can also download a digital Voter ID from the Voter Helpline App or voters.eci.gov.in.',
    },
  ],
  hi: [
    {
      num: '01',
      icon: '✅',
      title: 'पात्रता जांचें',
      color: '#22d3ee',
      desc: 'आप भारतीय नागरिक होने चाहिए, योग्यता वर्ष की 1 जनवरी को कम से कम 18 वर्ष की आयु के, और अपने निर्वाचन क्षेत्र के सामान्य निवासी होने चाहिए।',
      tip: 'टिप: आप वहां पंजीकरण कर सकते हैं जहां आप वर्तमान में रहते हैं।',
    },
    {
      num: '02',
      icon: '🌐',
      title: 'आधिकारिक पोर्टल पर जाएं',
      color: '#3b82f6',
      desc: 'voters.eci.gov.in पर जाएं या "Voter Helpline" ऐप डाउनलोड करें। आप अपने नजदीकी बूथ लेवल ऑफिसर (BLO) से भी मिल सकते हैं।',
      tip: 'टिप: मतदाता हेल्पलाइन नंबर 1950 है।',
    },
    {
      num: '03',
      icon: '📋',
      title: 'फॉर्म 6 भरें',
      color: '#8b5cf6',
      desc: 'फॉर्म 6 नए मतदाता पंजीकरण के लिए है। अपनी व्यक्तिगत जानकारी, पता भरें और दस्तावेज संलग्न करें।',
      tip: 'टिप: प्रवासी भारतीय (NRI) के लिए फॉर्म 6A है।',
    },
    {
      num: '04',
      icon: '📎',
      title: 'दस्तावेज संलग्न करें',
      color: '#f59e0b',
      desc: 'आयु प्रमाण, पता प्रमाण और पासपोर्ट साइज फोटो आवश्यक है। स्व-साक्षांकित प्रतियां जमा करें।',
      tip: 'टिप: आधार कार्ड को अनेक ERO कार्यालयों में आयु और पता दोनों प्रमाण के रूप में माना जाता है।',
    },
    {
      num: '05',
      icon: '📬',
      title: 'जमा करें और ट्रैक करें',
      color: '#10b981',
      desc: 'पोर्टल के माध्यम से ऑनलाइन या ERO कार्यालय में भौतिक रूप से जमा करें। आवेदन ट्रैकिंग के लिए संदर्भ संख्या मिलेगी।',
      tip: 'टिप: ऑनलाइन आवेदन आमतौर पर 2-4 सप्ताह में संसाधित होते हैं।',
    },
    {
      num: '06',
      icon: '🪪',
      title: 'EPIC कार्ड प्राप्त करें',
      color: '#f97316',
      desc: 'मंजूरी मिलने पर आपका मतदाता पहचान पत्र (EPIC/Voter ID) आपके पते पर भेजा जाएगा या BLO से प्राप्त करें।',
      tip: 'टिप: voters.eci.gov.in से डिजिटल मतदाता पहचान पत्र भी डाउनलोड किया जा सकता है।',
    },
  ],
};

// Documents required for registration
const DOCUMENTS = {
  en: {
    age: ['Aadhaar Card', 'Birth Certificate', 'PAN Card', 'Passport', '10th Marksheet'],
    address: ['Aadhaar Card', 'Electricity/Water Bill', 'Bank Passbook', 'Driving License', 'Rent Agreement'],
  },
  hi: {
    age: ['आधार कार्ड', 'जन्म प्रमाण पत्र', 'पैन कार्ड', 'पासपोर्ट', '10वीं अंकतालिका'],
    address: ['आधार कार्ड', 'बिजली/पानी का बिल', 'बैंक पासबुक', 'ड्राइविंग लाइसेंस', 'किराया समझौता'],
  },
};

export default function RegistrationSection({ lang }) {
  const [activeStep, setActiveStep] = useState(null);
  const steps = STEPS[lang];
  const docs = DOCUMENTS[lang];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold gradient-text">
          {lang === 'en' ? '📋 Voter Registration Guide' : '📋 मतदाता पंजीकरण गाइड'}
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
          {lang === 'en'
            ? 'Your complete guide to registering as a voter in India'
            : 'भारत में मतदाता बनने की पूरी गाइड'}
        </p>
      </div>

      {/* Registration steps */}
      <div className="grid gap-3">
        {steps.map((step, i) => {
          const isActive = activeStep === i;
          return (
            <button
              key={i}
              onClick={() => setActiveStep(isActive ? null : i)}
              className="glass text-left p-4 transition-all duration-200 animate-fade-in-up"
              style={{
                animationDelay: `${i * 0.07}s`,
                borderColor: isActive ? step.color + '60' : 'var(--color-border)',
                background: isActive ? `${step.color}08` : 'rgba(30,41,59,0.7)',
              }}
              aria-expanded={isActive}
              aria-label={`${lang === 'en' ? 'Step' : 'चरण'} ${step.num}: ${step.title}`}
            >
              <div className="flex items-start gap-4">
                {/* Step number + icon */}
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: `${step.color}20`, border: `1.5px solid ${step.color}40` }}
                    aria-hidden="true"
                  >
                    {step.icon}
                  </div>
                  <span className="text-xs font-bold" style={{ color: step.color }}>{step.num}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                    {step.title}
                  </h3>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
                    {step.desc}
                  </p>
                  {/* Expanded tip */}
                  {isActive && (
                    <div
                      className="mt-3 px-3 py-2 rounded-lg text-xs animate-fade-in-up"
                      style={{
                        background: `${step.color}15`,
                        border: `1px solid ${step.color}30`,
                        color: step.color,
                      }}
                    >
                      💡 {step.tip}
                    </div>
                  )}
                </div>

                <span
                  className="text-slate-500 text-sm flex-shrink-0 transition-transform duration-200"
                  style={{ transform: isActive ? 'rotate(180deg)' : 'none' }}
                  aria-hidden="true"
                >
                  ▼
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Documents required */}
      <div className="glass p-5">
        <h3 className="font-bold text-sm mb-4" style={{ color: '#60a5fa' }}>
          📎 {lang === 'en' ? 'Documents Required' : 'आवश्यक दस्तावेज'}
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Age proof */}
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: '#f59e0b' }}>
              {lang === 'en' ? '🎂 Age Proof (any one)' : '🎂 आयु प्रमाण (कोई एक)'}
            </p>
            <ul className="flex flex-col gap-1.5">
              {docs.age.map((d, i) => (
                <li key={i} className="flex items-center gap-2 text-xs"
                    style={{ color: 'var(--color-muted)' }}>
                  <span style={{ color: '#22c55e' }}>✓</span> {d}
                </li>
              ))}
            </ul>
          </div>
          {/* Address proof */}
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: '#a78bfa' }}>
              {lang === 'en' ? '🏠 Address Proof (any one)' : '🏠 पते का प्रमाण (कोई एक)'}
            </p>
            <ul className="flex flex-col gap-1.5">
              {docs.address.map((d, i) => (
                <li key={i} className="flex items-center gap-2 text-xs"
                    style={{ color: 'var(--color-muted)' }}>
                  <span style={{ color: '#22c55e' }}>✓</span> {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Official links */}
      <div className="glass p-5">
        <h3 className="font-bold text-sm mb-3" style={{ color: '#60a5fa' }}>
          🔗 {lang === 'en' ? 'Official Resources' : 'आधिकारिक संसाधन'}
        </h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            { label: lang === 'en' ? 'ECI Voter Portal' : 'ECI मतदाता पोर्टल', url: 'https://voters.eci.gov.in', color: '#3b82f6' },
            { label: lang === 'en' ? 'NVSP (National Voter Service)' : 'राष्ट्रीय मतदाता सेवा', url: 'https://www.nvsp.in', color: '#8b5cf6' },
            { label: lang === 'en' ? 'Voter Helpline App' : 'मतदाता हेल्पलाइन ऐप', url: 'https://play.google.com/store/apps/details?id=com.eci.citizen', color: '#10b981' },
            { label: lang === 'en' ? 'Call 1950 (Voter Helpline)' : '1950 पर कॉल करें', url: 'tel:1950', color: '#f59e0b' },
          ].map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all hover:-translate-y-0.5"
              style={{
                background: `${link.color}15`,
                border: `1px solid ${link.color}30`,
                color: link.color,
                textDecoration: 'none',
              }}
              aria-label={`Open ${link.label} in new tab`}
            >
              <span>↗</span> {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
