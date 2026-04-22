/**
 * FAQSection.jsx
 * Frequently Asked Questions about elections.
 * Accordion-style, bilingual, categorized by topic.
 */
import React, { useState } from 'react';

const FAQ_DATA = {
  en: [
    {
      category: 'Voting Basics',
      icon: '🗳️',
      color: '#3b82f6',
      questions: [
        {
          q: 'Who is eligible to vote in India?',
          a: 'Any Indian citizen who is 18 years or older on January 1st of the qualifying year and is enrolled in the electoral roll of their constituency. Non-resident Indians with valid Indian passports can also register under Form 6A.',
        },
        {
          q: 'What ID do I need to vote?',
          a: 'While the EPIC (Voter ID card) is primary, the ECI allows 12 alternative documents: Aadhaar Card, Passport, Driving License, PAN Card, MNREGA Job Card, Smart Card (Labour Dept), Health Insurance Smart Card, Pension Document, NPR Smart Card, Bank/Post Office Passbook, Service Identity Cards of govt employees, and disability certificates.',
        },
        {
          q: 'Can I vote if my name is not on the voter list?',
          a: 'No. Your name must be on the electoral roll of that constituency to vote there. You can check your enrollment at voters.eci.gov.in. If not enrolled, apply via Form 6 at least 5 days before the last date for enrollment.',
        },
      ],
    },
    {
      category: 'EVMs & Technology',
      icon: '🔷',
      color: '#8b5cf6',
      questions: [
        {
          q: 'How does an EVM work?',
          a: 'An EVM has two units: the Ballot Unit (BU) where voters press the button next to their choice, and the Control Unit (CU) operated by polling officers. When you press a button, the vote is electronically stored. The machines are standalone, battery-powered, and not connected to any network.',
        },
        {
          q: 'What is VVPAT and how does it help?',
          a: 'VVPAT (Voter Verifiable Paper Audit Trail) is a printer attached to the EVM that generates a paper slip showing the candidate name, serial number, and symbol for 7 seconds after you vote. You can see it through a transparent window to verify your vote was cast correctly.',
        },
        {
          q: 'Can EVMs be hacked or tampered with?',
          a: 'The Election Commission maintains that EVMs are tamper-proof: they are standalone machines not connected to any network, run on one-time programmable chips, and undergo rigorous First Level Checking (FLC) before deployment. They have been upheld as reliable by the Supreme Court of India.',
        },
      ],
    },
    {
      category: 'Election Rules',
      icon: '📜',
      color: '#10b981',
      questions: [
        {
          q: 'What is the Model Code of Conduct (MCC)?',
          a: 'The MCC is a set of guidelines issued by the Election Commission of India that govern the behavior of political parties, candidates, and the ruling government from the date of announcement of elections until the declaration of results. It ensures elections are free and fair.',
        },
        {
          q: 'What is a by-election?',
          a: 'A by-election (also called a bye-election) is held to fill a parliamentary or assembly seat that has become vacant due to death, resignation, or disqualification of the sitting member before the end of the regular term.',
        },
        {
          q: 'What is NOTA and when was it introduced?',
          a: 'NOTA stands for "None Of The Above." It was introduced in Indian elections on September 27, 2013, following a Supreme Court order, to allow voters who do not wish to vote for any candidate to formally reject all options. However, the candidate with the most votes still wins even if NOTA gets more votes.',
        },
      ],
    },
    {
      category: 'Voter Rights',
      icon: '⚖️',
      color: '#f97316',
      questions: [
        {
          q: 'Is voting mandatory in India?',
          a: 'No, voting is not mandatory in India — it is a right, not a legal obligation. However, civic participation is strongly encouraged. Some states/cities offer voluntary pledge programs. Gujarat was the first state to pass a local law requiring compulsory voting in gram panchayat elections.',
        },
        {
          q: 'Can I vote if I\'m away from my constituency on polling day?',
          a: 'Generally, postal ballot is available for: service voters (armed forces, police), election duty officers, and those with certain disabilities or aged 85+. For absentee voting, apply to the Returning Officer. Ordinary voters must travel to their registered constituency to vote in person.',
        },
        {
          q: 'What happens if someone votes on my behalf fraudulently?',
          a: 'Impersonating a voter is a criminal offence under Section 171D of the Indian Penal Code, punishable with up to 1 year imprisonment, or a fine, or both. If you suspect impersonation, report immediately to the Presiding Officer at the polling station.',
        },
      ],
    },
  ],
  hi: [
    {
      category: 'मतदान की मूल बातें',
      icon: '🗳️',
      color: '#3b82f6',
      questions: [
        {
          q: 'भारत में मतदान के लिए कौन पात्र है?',
          a: 'कोई भी भारतीय नागरिक जो योग्यता वर्ष की 1 जनवरी को 18 वर्ष या उससे अधिक का हो और अपने निर्वाचन क्षेत्र की मतदाता सूची में पंजीकृत हो। वैध भारतीय पासपोर्ट वाले प्रवासी भारतीय भी फॉर्म 6A के तहत पंजीकरण कर सकते हैं।',
        },
        {
          q: 'मतदान के लिए कौन सा पहचान पत्र चाहिए?',
          a: 'EPIC (मतदाता पहचान पत्र) प्राथमिक है, लेकिन ECI 12 वैकल्पिक दस्तावेज स्वीकार करता है: आधार कार्ड, पासपोर्ट, ड्राइविंग लाइसेंस, पैन कार्ड, मनरेगा जॉब कार्ड, बैंक पासबुक, सरकारी कर्मचारी पहचान पत्र आदि।',
        },
        {
          q: 'NOTA क्या है?',
          a: 'NOTA का मतलब है "इनमें से कोई नहीं" (None Of The Above)। इसे 27 सितंबर 2013 को सुप्रीम कोर्ट के आदेश पर शुरू किया गया था। यह मतदाताओं को सभी उम्मीदवारों को अस्वीकार करने का विकल्प देता है।',
        },
      ],
    },
    {
      category: 'EVM और तकनीक',
      icon: '🔷',
      color: '#8b5cf6',
      questions: [
        {
          q: 'EVM कैसे काम करती है?',
          a: 'EVM में दो इकाइयां होती हैं: बैलट यूनिट (BU) जहां मतदाता बटन दबाता है, और कंट्रोल यूनिट (CU) जो मतदान अधिकारी के पास होती है। मशीन स्टैंडअलोन है, किसी नेटवर्क से जुड़ी नहीं है।',
        },
        {
          q: 'VVPAT क्या है?',
          a: 'VVPAT (मतदाता सत्यापन योग्य पेपर ऑडिट ट्रेल) EVM से जुड़ा एक प्रिंटर है जो मतदान के बाद 7 सेकंड के लिए उम्मीदवार का नाम और चुनाव चिह्न दिखाने वाली पेपर पर्ची उत्पन्न करता है।',
        },
      ],
    },
    {
      category: 'मतदाता अधिकार',
      icon: '⚖️',
      color: '#f97316',
      questions: [
        {
          q: 'क्या भारत में मतदान अनिवार्य है?',
          a: 'नहीं, भारत में मतदान अनिवार्य नहीं है — यह एक अधिकार है, कानूनी दायित्व नहीं। हालाँकि, नागरिक भागीदारी की दृढ़ता से सलाह दी जाती है। गुजरात पहला राज्य था जिसने ग्राम पंचायत चुनावों में अनिवार्य मतदान का कानून पारित किया।',
        },
        {
          q: 'आदर्श आचार संहिता (MCC) क्या है?',
          a: 'MCC चुनाव आयोग द्वारा जारी दिशानिर्देशों का एक समूह है जो राजनीतिक दलों, उम्मीदवारों और सत्तारूढ़ सरकार के आचरण को चुनाव की घोषणा से परिणाम घोषणा तक नियंत्रित करता है।',
        },
      ],
    },
  ],
};

export default function FAQSection({ lang }) {
  const [openItem, setOpenItem] = useState(null); // "catIdx-qIdx"

  const data = FAQ_DATA[lang];

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold gradient-text">
          {lang === 'en' ? '❓ Frequently Asked Questions' : '❓ अक्सर पूछे जाने वाले सवाल'}
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
          {lang === 'en'
            ? 'Common questions about elections, voting, and civic rights'
            : 'चुनाव, मतदान और नागरिक अधिकारों के बारे में सामान्य प्रश्न'}
        </p>
      </div>

      {/* FAQ categories */}
      {data.map((category, catIdx) => (
        <section key={catIdx} aria-labelledby={`faq-cat-${catIdx}`}>
          {/* Category header */}
          <div
            className="flex items-center gap-2 mb-3 px-1"
            id={`faq-cat-${catIdx}`}
          >
            <span className="text-lg" aria-hidden="true">{category.icon}</span>
            <h3 className="font-bold text-sm" style={{ color: category.color }}>
              {category.category}
            </h3>
            <div className="flex-1 h-px" style={{ background: `${category.color}30` }} />
          </div>

          {/* Questions */}
          <div className="flex flex-col gap-2">
            {category.questions.map((item, qIdx) => {
              const key = `${catIdx}-${qIdx}`;
              const isOpen = openItem === key;
              return (
                <div key={qIdx} className="animate-fade-in-up" style={{ animationDelay: `${qIdx * 0.05}s` }}>
                  <button
                    onClick={() => setOpenItem(isOpen ? null : key)}
                    className="w-full text-left glass p-4 transition-all duration-200"
                    style={{
                      borderColor: isOpen ? category.color + '50' : 'var(--color-border)',
                      background: isOpen ? `${category.color}08` : 'rgba(30,41,59,0.7)',
                      borderRadius: isOpen ? '16px 16px 0 0' : '16px',
                    }}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${key}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                        {item.q}
                      </span>
                      <span
                        className="text-slate-500 text-sm flex-shrink-0 transition-transform duration-200 mt-0.5"
                        style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}
                        aria-hidden="true"
                      >
                        ▼
                      </span>
                    </div>
                  </button>

                  {/* Answer */}
                  {isOpen && (
                    <div
                      id={`faq-answer-${key}`}
                      className="animate-fade-in-up px-4 py-3 text-sm"
                      style={{
                        background: `${category.color}06`,
                        border: `1px solid ${category.color}30`,
                        borderTop: 'none',
                        borderRadius: '0 0 16px 16px',
                        color: 'var(--color-muted)',
                        lineHeight: 1.7,
                      }}
                    >
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* Bottom CTA */}
      <div
        className="glass p-4 flex items-center gap-3 text-sm"
        style={{ borderColor: 'rgba(59,130,246,0.25)' }}
      >
        <span className="text-2xl" aria-hidden="true">💬</span>
        <div>
          <p style={{ color: 'var(--color-text)' }} className="font-medium">
            {lang === 'en' ? 'Have more questions?' : 'और सवाल हैं?'}
          </p>
          <p style={{ color: 'var(--color-muted)' }} className="text-xs">
            {lang === 'en'
              ? 'Use the AI Chat tab to ask anything — Gemini will answer instantly!'
              : 'AI चैट टैब पर जाएं और कुछ भी पूछें — Gemini तुरंत जवाब देगा!'}
          </p>
        </div>
      </div>
    </div>
  );
}
