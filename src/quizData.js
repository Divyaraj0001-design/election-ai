/**
 * quizData.js
 * Quiz questions for Election Knowledge Quiz.
 * Both English and Hindi sets included.
 */

export const quizQuestionsEnglish = [
  {
    id: 1,
    question: "What is the minimum age to vote in India?",
    options: ["16 years", "18 years", "21 years", "25 years"],
    correct: 1,
    explanation: "In India, the minimum voting age is 18 years, as amended by the 61st Constitutional Amendment Act, 1988.",
  },
  {
    id: 2,
    question: "What does EVM stand for?",
    options: [
      "Electoral Voting Method",
      "Electronic Voting Machine",
      "Election Verification Module",
      "Electronic Vote Meter",
    ],
    correct: 1,
    explanation: "EVM stands for Electronic Voting Machine. India has used EVMs in all Lok Sabha elections since 2004.",
  },
  {
    id: 3,
    question: "Which body conducts elections in India?",
    options: [
      "Supreme Court of India",
      "Ministry of Home Affairs",
      "Election Commission of India",
      "Rajya Sabha Secretariat",
    ],
    correct: 2,
    explanation: "The Election Commission of India (ECI) is an autonomous constitutional body responsible for administering elections.",
  },
  {
    id: 4,
    question: "What is VVPAT?",
    options: [
      "Voter Verified Paper Audit Trail",
      "Voting Verification and Polling Audit Tool",
      "Vote Validation Protocol and Tracking",
      "Verified Voter Paper Audit Track",
    ],
    correct: 0,
    explanation: "VVPAT (Voter Verifiable Paper Audit Trail) is a device attached to EVMs that lets voters verify their vote via a paper slip.",
  },
  {
    id: 5,
    question: "What is the Model Code of Conduct?",
    options: [
      "A set of rules for voters",
      "Guidelines for EVMs",
      "Rules for political parties and candidates during elections",
      "Rules for election officials",
    ],
    correct: 2,
    explanation: "The Model Code of Conduct (MCC) is a set of guidelines issued by the ECI for political parties and candidates to ensure free and fair elections.",
  },
  {
    id: 6,
    question: "What form is used to register as a new voter in India?",
    options: ["Form 1", "Form 6", "Form 8", "Form 20"],
    correct: 1,
    explanation: "Form 6 is the Application for inclusion of name in the Electoral Roll for new voters in India.",
  },
  {
    id: 7,
    question: "How many Lok Sabha constituencies are there in India?",
    options: ["400", "543", "552", "790"],
    correct: 1,
    explanation: "There are 543 parliamentary constituencies in India, each electing one Member of Parliament to the Lok Sabha.",
  },
  {
    id: 8,
    question: "What is NOTA in Indian elections?",
    options: [
      "None Of The Above",
      "New Official Total Audit",
      "National Online Tally Application",
      "Not On The Agenda",
    ],
    correct: 0,
    explanation: "NOTA (None Of The Above) was introduced in Indian elections in 2013, allowing voters to reject all candidates on the ballot.",
  },
  {
    id: 9,
    question: "Which document serves as primary voter ID in India?",
    options: ["Passport", "Aadhaar Card", "EPIC Card (Voter ID)", "PAN Card"],
    correct: 2,
    explanation: "The EPIC (Elector's Photo Identity Card), commonly called the Voter ID card, is the primary identification for voting in India.",
  },
  {
    id: 10,
    question: "When did India first use EVMs in a general election?",
    options: ["1989", "1999", "2004", "2009"],
    correct: 2,
    explanation: "India used EVMs for the first time in all constituencies for the 2004 Lok Sabha general elections.",
  },
];

export const quizQuestionsHindi = [
  {
    id: 1,
    question: "भारत में मतदान करने की न्यूनतम आयु क्या है?",
    options: ["16 वर्ष", "18 वर्ष", "21 वर्ष", "25 वर्ष"],
    correct: 1,
    explanation: "भारत में मतदान की न्यूनतम आयु 18 वर्ष है, जो 61वें संवैधानिक संशोधन अधिनियम 1988 द्वारा तय की गई है।",
  },
  {
    id: 2,
    question: "EVM का पूर्ण रूप क्या है?",
    options: [
      "इलेक्टोरल वोटिंग मेथड",
      "इलेक्ट्रॉनिक वोटिंग मशीन",
      "इलेक्शन वेरिफिकेशन मॉड्यूल",
      "इलेक्ट्रॉनिक वोट मीटर",
    ],
    correct: 1,
    explanation: "EVM का मतलब है इलेक्ट्रॉनिक वोटिंग मशीन। भारत में 2004 से सभी लोकसभा चुनावों में EVM का उपयोग किया जा रहा है।",
  },
  {
    id: 3,
    question: "भारत में चुनाव कौन सी संस्था आयोजित करती है?",
    options: [
      "भारत का सर्वोच्च न्यायालय",
      "गृह मंत्रालय",
      "भारत निर्वाचन आयोग",
      "राज्यसभा सचिवालय",
    ],
    correct: 2,
    explanation: "भारत निर्वाचन आयोग (ECI) एक स्वायत्त संवैधानिक निकाय है जो चुनावों का संचालन करता है।",
  },
  {
    id: 4,
    question: "NOTA का क्या अर्थ है?",
    options: [
      "उपरोक्त में से कोई नहीं",
      "नेशनल ऑनलाइन ट्रैकिंग एप्लीकेशन",
      "नया अधिकारी टैली ऑडिट",
      "एजेंडे में नहीं",
    ],
    correct: 0,
    explanation: "NOTA यानी 'None Of The Above' (उपरोक्त में से कोई नहीं)। इसे 2013 में लागू किया गया ताकि मतदाता सभी उम्मीदवारों को अस्वीकार कर सकें।",
  },
  {
    id: 5,
    question: "भारत में लोकसभा की कितनी सीटें हैं?",
    options: ["400", "543", "552", "790"],
    correct: 1,
    explanation: "भारत में 543 संसदीय निर्वाचन क्षेत्र हैं, प्रत्येक से एक सांसद लोकसभा के लिए चुना जाता है।",
  },
];
