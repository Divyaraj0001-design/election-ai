/**
 * TimelineSection.jsx
 * Visual step-by-step election process timeline.
 * Shows all phases from announcement to oath-taking.
 */
import React, { useState } from 'react';

// Election timeline data (bilingual)
const TIMELINE_STEPS = [
  {
    id: 1,
    icon: '📢',
    color: '#3b82f6',
    en: {
      phase: 'Announcement',
      title: 'Election Schedule Announced',
      desc: 'The Election Commission of India announces the election schedule, polling dates, and the Model Code of Conduct (MCC) comes into effect immediately.',
      details: ['ECI holds press conference', 'MCC activated nationwide', 'Dates for all phases announced', 'Nomination process begins'],
    },
    hi: {
      phase: 'घोषणा',
      title: 'चुनाव कार्यक्रम की घोषणा',
      desc: 'भारत निर्वाचन आयोग चुनाव कार्यक्रम और मतदान तिथियों की घोषणा करता है। आदर्श आचार संहिता (MCC) तुरंत लागू हो जाती है।',
      details: ['ECI प्रेस कॉन्फ्रेंस', 'MCC पूरे देश में लागू', 'सभी चरणों की तिथियां घोषित', 'नामांकन प्रक्रिया शुरू'],
    },
  },
  {
    id: 2,
    icon: '📋',
    color: '#8b5cf6',
    en: {
      phase: 'Voter List',
      title: 'Electoral Rolls Finalized',
      desc: 'The final electoral rolls are published. Citizens can verify their registration, and last-minute registration requests are processed.',
      details: ['Final voter lists published', 'Name verification open', 'EPIC card distribution', 'Polling booth assignment'],
    },
    hi: {
      phase: 'मतदाता सूची',
      title: 'मतदाता सूची अंतिम रूप',
      desc: 'अंतिम मतदाता सूचियां प्रकाशित की जाती हैं। नागरिक अपना पंजीकरण सत्यापित कर सकते हैं।',
      details: ['अंतिम मतदाता सूची प्रकाशित', 'नाम सत्यापन खुला', 'EPIC कार्ड वितरण', 'मतदान केंद्र आवंटन'],
    },
  },
  {
    id: 3,
    icon: '📝',
    color: '#f59e0b',
    en: {
      phase: 'Nomination',
      title: 'Candidates File Nominations',
      desc: 'Prospective candidates submit nomination papers (Form 2B) to the Returning Officer along with the required security deposit.',
      details: ['Submit Form 2B to Returning Officer', 'Security deposit required', 'Documents and affidavit attached', 'Last date for nomination'],
    },
    hi: {
      phase: 'नामांकन',
      title: 'उम्मीदवारों का नामांकन',
      desc: 'संभावित उम्मीदवार रिटर्निंग अधिकारी को नामांकन पत्र (फॉर्म 2B) जमा करते हैं।',
      details: ['फॉर्म 2B रिटर्निंग अधिकारी को जमा करें', 'जमानत राशि आवश्यक', 'दस्तावेज और शपथ पत्र संलग्न', 'नामांकन की अंतिम तिथि'],
    },
  },
  {
    id: 4,
    icon: '🔍',
    color: '#10b981',
    en: {
      phase: 'Scrutiny',
      title: 'Nomination Papers Scrutinized',
      desc: 'The Returning Officer scrutinizes all nomination papers to check eligibility, documents, and compliance with election rules.',
      details: ['Eligibility verified', 'Documents checked', 'Objections can be raised', 'Valid nominations confirmed'],
    },
    hi: {
      phase: 'जांच',
      title: 'नामांकन पत्रों की जांच',
      desc: 'रिटर्निंग अधिकारी पात्रता, दस्तावेजों और चुनाव नियमों के अनुपालन की जांच करता है।',
      details: ['पात्रता सत्यापित', 'दस्तावेजों की जांच', 'आपत्तियां उठाई जा सकती हैं', 'वैध नामांकन पुष्ट'],
    },
  },
  {
    id: 5,
    icon: '↩️',
    color: '#ef4444',
    en: {
      phase: 'Withdrawal',
      title: 'Candidate Withdrawal Window',
      desc: 'Candidates may withdraw their nomination within the specified deadline. After this date, the final list of candidates is published.',
      details: ['Withdrawal deadline set', 'Candidates can pull out', 'Final candidate list published', 'Symbols allotted to candidates'],
    },
    hi: {
      phase: 'वापसी',
      title: 'उम्मीदवार वापसी',
      desc: 'उम्मीदवार निर्धारित अंतिम तिथि से पहले अपना नामांकन वापस ले सकते हैं।',
      details: ['वापसी की अंतिम तिथि', 'उम्मीदवार नाम वापस ले सकते हैं', 'अंतिम उम्मीदवार सूची प्रकाशित', 'उम्मीदवारों को चुनाव चिह्न आवंटित'],
    },
  },
  {
    id: 6,
    icon: '📣',
    color: '#f97316',
    en: {
      phase: 'Campaigning',
      title: 'Election Campaign Period',
      desc: 'Candidates and parties campaign across constituencies. Campaign must end 48 hours before polling day (Silent Period).',
      details: ['Rallies, speeches, door-to-door', 'Spending limits apply', 'Campaign ends 48h before poll', 'Media coverage regulated'],
    },
    hi: {
      phase: 'चुनाव प्रचार',
      title: 'चुनाव प्रचार अवधि',
      desc: 'उम्मीदवार और पार्टियां निर्वाचन क्षेत्रों में प्रचार करती हैं। मतदान से 48 घंटे पहले प्रचार बंद हो जाता है।',
      details: ['रैलियां, भाषण, घर-घर प्रचार', 'खर्च सीमाएं लागू', 'मतदान से 48 घंटे पहले प्रचार बंद', 'मीडिया कवरेज नियंत्रित'],
    },
  },
  {
    id: 7,
    icon: '🗳️',
    color: '#22d3ee',
    en: {
      phase: 'Polling Day',
      title: 'Voting Day – Cast Your Vote!',
      desc: 'Eligible voters head to their assigned polling booths, verify identity, and cast their vote using the EVM. VVPAT confirms the choice.',
      details: ['Polling 7am–6pm', 'Voter ID verification', 'EVM + VVPAT voting', 'Ink mark on finger'],
    },
    hi: {
      phase: 'मतदान दिवस',
      title: 'मतदान दिवस – अपना वोट डालें!',
      desc: 'पात्र मतदाता अपने मतदान केंद्र पर जाते हैं, पहचान सत्यापित करते हैं और EVM से वोट डालते हैं।',
      details: ['मतदान सुबह 7 से शाम 6 बजे', 'मतदाता पहचान सत्यापन', 'EVM + VVPAT से मतदान', 'उंगली पर स्याही का निशान'],
    },
  },
  {
    id: 8,
    icon: '🔢',
    color: '#a78bfa',
    en: {
      phase: 'Counting',
      title: 'Vote Counting & Results',
      desc: 'EVMs are unsealed and votes counted at designated counting centres. Results are declared constituency-by-constituency.',
      details: ['Counting day announced', 'Party agents present', 'Round-by-round counting', 'Winning candidates declared'],
    },
    hi: {
      phase: 'मतगणना',
      title: 'मतगणना और परिणाम',
      desc: 'EVM मशीनों की सील खोली जाती हैं और निर्धारित मतगणना केंद्रों पर वोटों की गिनती होती है।',
      details: ['मतगणना दिवस घोषित', 'पार्टी एजेंट मौजूद', 'राउंड-दर-राउंड गिनती', 'जीते उम्मीदवारों की घोषणा'],
    },
  },
  {
    id: 9,
    icon: '🤝',
    color: '#34d399',
    en: {
      phase: 'Oath Taking',
      title: 'Elected Members Take Oath',
      desc: 'Winning candidates are issued election certificates and take the oath of office. The new government is formed.',
      details: ['Election certificates issued', 'Oath administered by Speaker', 'New Parliament/Assembly convenes', 'Government formation begins'],
    },
    hi: {
      phase: 'शपथ ग्रहण',
      title: 'निर्वाचित सदस्यों का शपथ ग्रहण',
      desc: 'विजयी उम्मीदवारों को चुनाव प्रमाण पत्र दिए जाते हैं और वे शपथ लेते हैं। नई सरकार का गठन होता है।',
      details: ['चुनाव प्रमाण पत्र जारी', 'अध्यक्ष द्वारा शपथ', 'नई संसद/विधानसभा का अधिवेशन', 'सरकार गठन प्रक्रिया शुरू'],
    },
  },
];

export default function TimelineSection({ lang }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="flex flex-col gap-4">
      {/* Section header */}
      <div>
        <h2 className="text-xl font-bold gradient-text">
          {lang === 'en' ? '🗓️ Election Timeline' : '🗓️ चुनाव समयरेखा'}
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
          {lang === 'en'
            ? 'Step-by-step: from election announcement to oath taking'
            : 'चुनाव की घोषणा से शपथ ग्रहण तक — हर चरण'}
        </p>
      </div>

      {/* Timeline */}
      <div className="relative flex flex-col gap-2">
        {TIMELINE_STEPS.map((step, idx) => {
          const data = step[lang];
          const isOpen = expanded === step.id;
          return (
            <div key={step.id} className="relative flex gap-4 animate-fade-in-up" style={{ animationDelay: `${idx * 0.06}s` }}>
              {/* Vertical connector line */}
              {idx < TIMELINE_STEPS.length - 1 && (
                <div
                  className="absolute left-5 top-10"
                  style={{
                    width: '2px',
                    bottom: '-8px',
                    background: `linear-gradient(to bottom, ${step.color}60, transparent)`,
                    zIndex: 0,
                  }}
                />
              )}

              {/* Step icon circle */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 z-10"
                style={{
                  background: `${step.color}22`,
                  border: `2px solid ${step.color}55`,
                  boxShadow: `0 0 12px ${step.color}30`,
                }}
                aria-hidden="true"
              >
                {step.icon}
              </div>

              {/* Step card */}
              <button
                onClick={() => setExpanded(isOpen ? null : step.id)}
                className="flex-1 text-left glass p-4 transition-all duration-200 hover:border-opacity-50 mb-2"
                style={{
                  borderColor: isOpen ? step.color + '60' : 'var(--color-border)',
                  background: isOpen ? `${step.color}0a` : 'rgba(30,41,59,0.7)',
                }}
                aria-expanded={isOpen}
                aria-label={`${lang === 'en' ? 'Step' : 'चरण'} ${step.id}: ${data.title}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    {/* Phase badge */}
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full mb-1 inline-block"
                      style={{ background: `${step.color}20`, color: step.color }}
                    >
                      {lang === 'en' ? `Step ${step.id}` : `चरण ${step.id}`} · {data.phase}
                    </span>
                    <h3 className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                      {data.title}
                    </h3>
                    <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
                      {data.desc}
                    </p>
                  </div>
                  <span className="text-slate-500 text-sm flex-shrink-0 transition-transform duration-200"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                    ▼
                  </span>
                </div>

                {/* Expanded details */}
                {isOpen && (
                  <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5 animate-fade-in-up">
                    {data.details.map((d, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg"
                        style={{
                          background: `${step.color}15`,
                          color: '#cbd5e1',
                        }}
                      >
                        <span style={{ color: step.color }}>✓</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Bottom tip */}
      <div
        className="glass p-4 text-sm text-center"
        style={{ color: 'var(--color-muted)', borderColor: 'rgba(59,130,246,0.2)' }}
      >
        💡 {lang === 'en'
          ? 'Click any step to expand details. The entire process ensures free, fair, and transparent elections.'
          : 'किसी भी चरण पर क्लिक करके विवरण देखें। यह पूरी प्रक्रिया स्वतंत्र, निष्पक्ष और पारदर्शी चुनाव सुनिश्चित करती है।'}
      </div>
    </div>
  );
}
