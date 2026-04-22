/**
 * gemini.js
 * Gemini API integration for ElectionAI.
 * Uses @google/generative-ai SDK with election-focused system prompt.
 * Auto-falls back to rich pre-built responses on quota/API errors.
 */
import { GoogleGenerativeAI } from '@google/generative-ai';

// System prompt for election education context
const SYSTEM_PROMPT = `You are ElectionAI — a friendly, knowledgeable, and non-partisan civic education assistant 
specializing in election processes. You help citizens understand:
- How democratic elections work (India and general)
- Voter registration requirements and steps
- The election timeline from announcement to results
- How to cast a valid vote and what to expect at polling stations
- Electoral rolls, EVMs, VVPATs, Model Code of Conduct
- Rights and responsibilities of voters
- Election Commission of India (ECI) roles and functions
- How candidates and parties are regulated

RULES:
1. Stay neutral and factual. Never favor any political party or candidate.
2. Always encourage voting and civic participation.
3. Provide answers in the language the user writes in (Hindi or English).
4. If asked in Hindi, respond in Hindi (Devanagari script).
5. Keep answers clear, structured, and easy for a first-time voter to understand.
6. Use bullet points and numbered lists for step-by-step processes.
7. If you don't know something, say so clearly rather than guessing.`;

// Initialize Gemini only if API key is present
let genAI;
let model;

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (apiKey && apiKey !== 'your_gemini_api_key_here') {
  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
  });
}

/**
 * Send a message to Gemini and get a streaming response.
 * Falls back to rich local responses on API errors (quota, network, etc.)
 */
export async function sendMessageToGemini(history, message, onChunk) {
  // Use fallback if no model configured
  if (!model) {
    const fallback = getFallbackResponse(message);
    await simulateStream(fallback, onChunk);
    return fallback;
  }

  try {
    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
    });

    const result = await chat.sendMessageStream(message);
    let fullText = '';

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      if (onChunk) onChunk(chunkText);
    }

    return fullText;
  } catch (err) {
    console.warn('Gemini API unavailable, using local knowledge base:', err.message?.slice(0, 60));
    // Auto-fallback — never show an error to the user
    const fallback = getFallbackResponse(message);
    await simulateStream(fallback, onChunk);
    return fallback;
  }
}

/**
 * Simulate streaming for fallback responses (word by word).
 */
async function simulateStream(text, onChunk) {
  if (!onChunk) return;
  const words = text.split(' ');
  for (const word of words) {
    onChunk(word + ' ');
    await new Promise(r => setTimeout(r, 25));
  }
}

/**
 * Rich local knowledge base — covers all major election topics.
 * Used when Gemini API is unavailable.
 */
function getFallbackResponse(message) {
  const msg = message.toLowerCase();

  // ── Voter Registration ─────────────────────────────────────────────────────
  if (msg.includes('register') || msg.includes('registration') || msg.includes('enrol') ||
      msg.includes('पंजीकरण') || msg.includes('नामांकन')) {
    return `**Voter Registration in India** 🗳️

To register as a voter, follow these steps:

1. **Check Eligibility** — You must be 18+ years old and an Indian citizen as of January 1st of the qualifying year.
2. **Visit the Official Portal** — Go to [voters.eci.gov.in](https://voters.eci.gov.in) or use the **Voter Helpline App**.
3. **Fill Form 6** — This is the New Voter Registration form (also available at your nearest BLO/ERO office).
4. **Submit Documents**:
   - Proof of age: Aadhaar, birth certificate, or school leaving certificate
   - Proof of address: Aadhaar, utility bill, or bank passbook
5. **Track Your Application** — You'll receive an Application Reference Number to track status online.
6. **Receive EPIC Card** — Your Elector Photo Identity Card (Voter ID) will be issued within a few weeks.

📱 **Quick options:**
- Call **1950** (National Voter Helpline)
- Download the **Voter Helpline App** from Play Store / App Store
- Visit your local **BLO (Booth Level Officer)**`;
  }

  // ── Documents needed ───────────────────────────────────────────────────────
  if (msg.includes('document') || msg.includes('id') || msg.includes('identity') ||
      msg.includes('दस्तावेज') || msg.includes('पहचान')) {
    return `**Documents Needed to Vote in India** 📋

Your **EPIC (Voter ID card)** is the primary document. However, the Election Commission accepts **12 alternative photo IDs**:

1. 🪪 Aadhaar Card
2. 🛂 Passport
3. 🚗 Driving License
4. 💳 PAN Card
5. 📋 MNREGA Job Card
6. 🏥 Health Insurance Smart Card (Labour Ministry)
7. 📖 Bank / Post Office Passbook with photo
8. 📜 Service Identity Cards (Central/State Govt employees)
9. 🏛️ NPR Smart Card
10. ♿ Disability Certificate with photo (UDID Card)
11. 🧾 Pension document with photo
12. 📱 Smart Card issued by Labour Ministry

✅ **Important:** Your name must be in the **Electoral Roll** of that constituency — even with valid ID, you cannot vote if your name is missing.

🔍 **Check your name:** Visit [electoralsearch.eci.gov.in](https://electoralsearch.eci.gov.in)`;
  }

  // ── EVM / Voting Machine ───────────────────────────────────────────────────
  if (msg.includes('evm') || msg.includes('machine') || msg.includes('electronic voting') ||
      msg.includes('वोटिंग मशीन') || msg.includes('इलेक्ट्रॉनिक')) {
    return `**Electronic Voting Machines (EVMs)** 🔷

India has used EVMs in all major elections since **2004**. Here's how they work:

**Two Main Units:**
- **Ballot Unit (BU)** — In the voting compartment; voter presses the button next to their choice
- **Control Unit (CU)** — At the polling officer's table; enables voting and stores results

**Security Features:**
- ✅ Standalone — NOT connected to internet or any network
- ✅ One-time programmable microchip — cannot be reprogrammed
- ✅ Battery powered — works without electricity
- ✅ Tamper-evident seals on all ports
- ✅ Undergoes rigorous First Level Checking (FLC) before deployment

**VVPAT (Voter Verifiable Paper Audit Trail):**
- Attached to EVM; prints a paper slip after each vote
- Shows candidate name, serial number & symbol for **7 seconds**
- Visible through a transparent window — you confirm your vote
- VVPAT slips are sealed and used for audit if needed

🏛️ EVMs have been upheld as reliable by the **Supreme Court of India**.`;
  }

  // ── NOTA ──────────────────────────────────────────────────────────────────
  if (msg.includes('nota') || msg.includes('none of the above') || msg.includes('इनमें से कोई नहीं')) {
    return `**NOTA — None Of The Above** 🚫

**What is NOTA?**
NOTA stands for **"None Of The Above"** — it lets voters formally reject all candidates on the ballot.

**When was it introduced?**
NOTA was introduced in Indian elections on **September 27, 2013**, following a landmark Supreme Court order in the *People's Union for Civil Liberties vs Union of India* case.

**How to vote NOTA:**
- It appears as the **last option** on the Ballot Unit of the EVM
- It has a standard symbol (a crossed ballot paper)
- Press the button next to NOTA to cast your vote

**Important limitations:**
- ⚠️ NOTA votes are counted but have **no legal effect**
- Even if NOTA gets the most votes, the candidate with the **highest votes still wins**
- NOTA cannot cause a re-election (except in some local body elections in certain states)

**Purpose:**
NOTA allows voters to express dissatisfaction with all candidates while still participating in the democratic process.`;
  }

  // ── Election Timeline / Process ────────────────────────────────────────────
  if (msg.includes('timeline') || msg.includes('process') || msg.includes('step') ||
      msg.includes('how does election') || msg.includes('election work') ||
      msg.includes('चुनाव प्रक्रिया') || msg.includes('समयरेखा')) {
    return `**Indian Election Process — Step by Step** 📅

**Phase 1: Pre-Election**
1. 📢 **Announcement** — ECI announces schedule; Model Code of Conduct (MCC) begins immediately
2. 📋 **Electoral Rolls Finalized** — Voter lists published; last-minute registrations processed
3. 📝 **Nominations** — Candidates file Form 2B with Returning Officer + security deposit
4. 🔍 **Scrutiny** — Returning Officer verifies eligibility and documents
5. ↩️ **Withdrawal** — Candidates may withdraw by the deadline; final candidate list published

**Phase 2: Campaign**
6. 📣 **Campaigning** — Rallies, speeches, advertisements (campaign ends 48 hours before polling — "Silent Period")

**Phase 3: Voting**
7. 🗳️ **Polling Day** — Registered voters vote at assigned booths (typically 7am–6pm); ink mark applied to finger

**Phase 4: Results**
8. 🔢 **Counting** — EVMs unsealed at counting centres; results declared constituency by constituency
9. 🤝 **Oath Taking** — Winning candidates receive certificates and take oath of office; government formed`;
  }

  // ── Polling Day / How to Vote ──────────────────────────────────────────────
  if (msg.includes('polling') || msg.includes('how to vote') || msg.includes('voting day') ||
      msg.includes('booth') || msg.includes('cast') || msg.includes('मतदान') || msg.includes('वोट कैसे')) {
    return `**How to Vote on Polling Day** 🗳️

**Before You Go:**
- ✅ Check your name on the electoral roll at [voters.eci.gov.in](https://voters.eci.gov.in)
- ✅ Find your polling booth (shown on your Voter Slip or the ECI website)
- ✅ Carry your Voter ID (EPIC) or any of the 12 alternative photo IDs

**At the Polling Station:**
1. **Join the queue** at your assigned booth (usually open 7am–6pm)
2. **Show your ID** to the polling officer — they verify your name in the register
3. **Sign/thumbprint** in the voter register
4. **Collect the ballot slip** and proceed to the EVM
5. **Press the button** next to your chosen candidate on the Ballot Unit
6. **Verify on VVPAT** — a paper slip appears for 7 seconds showing your choice
7. **Ink mark** — indelible ink is applied to your left index finger to prevent double voting

**Tips:**
- 🧴 Do NOT use nail polish — it may interfere with the ink verification
- 📵 Mobile phones are NOT allowed inside the voting compartment
- 🆓 Your employer MUST give you paid leave to vote on polling day`;
  }

  // ── Election Commission ────────────────────────────────────────────────────
  if (msg.includes('election commission') || msg.includes('eci') || msg.includes('निर्वाचन आयोग')) {
    return `**Election Commission of India (ECI)** 🏛️

**What is ECI?**
The Election Commission of India is an **autonomous constitutional authority** responsible for administering all elections to Parliament and State Legislatures, and elections to the offices of President and Vice-President.

**Established:** January 25, 1950 (celebrated as National Voters' Day)

**Structure:**
- Chief Election Commissioner (CEC)
- Two Election Commissioners
- All three have equal voting power; removal requires parliamentary process (same as a Supreme Court judge)

**Key Responsibilities:**
- 📋 Maintaining Electoral Rolls
- 📅 Scheduling and conducting elections
- 📜 Enforcing Model Code of Conduct
- 🔷 Managing EVMs and VVPATs
- 💰 Monitoring election expenditure
- ⚖️ Recognizing political parties and allotting symbols
- 🚫 Taking action against electoral malpractice

**Official Website:** [eci.gov.in](https://eci.gov.in)
**Voter Helpline:** **1950**`;
  }

  // ── Model Code of Conduct ──────────────────────────────────────────────────
  if (msg.includes('model code') || msg.includes('mcc') || msg.includes('आदर्श आचार संहिता')) {
    return `**Model Code of Conduct (MCC)** 📜

**What is MCC?**
The Model Code of Conduct is a set of guidelines issued by the Election Commission of India that governs the behaviour of political parties, candidates, and the ruling government during elections.

**When does it apply?**
Comes into effect **immediately** on the date of election schedule announcement and remains until results are declared.

**Key restrictions under MCC:**

*For Political Parties & Candidates:*
- ❌ No use of caste, communal, or religious appeals
- ❌ No bribery, intimidation, or impersonation of voters
- ❌ Campaign must end 48 hours before polling (Silent Period)
- ❌ No election meetings within 100m of polling stations

*For the Government:*
- ❌ No new policy announcements or inaugurations using public funds
- ❌ No use of government machinery for campaign purposes
- ❌ Ministers cannot use official vehicles for campaign tours
- ❌ No transfers of officials involved in election duty without ECI approval

**Violation?** Report to ECI via the **cVIGIL app** or call **1950**.`;
  }

  // ── Voter Rights ───────────────────────────────────────────────────────────
  if (msg.includes('right') || msg.includes('mandatory') || msg.includes('compulsory') ||
      msg.includes('अधिकार') || msg.includes('अनिवार्य')) {
    return `**Voter Rights & Duties in India** ⚖️

**Is voting mandatory in India?**
No — voting is a **constitutional right**, not a legal obligation. You cannot be punished for not voting (except in some local body elections in Gujarat).

**Your Rights as a Voter:**
- ✅ **Right to vote** — if enrolled in the electoral roll
- ✅ **Secret ballot** — no one can force you to reveal your vote
- ✅ **Paid leave** — your employer must give you time off to vote
- ✅ **Free and fair election** — protected by ECI and the Constitution
- ✅ **Right to information** — candidates must declare criminal records, assets, and education

**Protection against fraud:**
- Impersonating a voter is a criminal offence under **Section 171D IPC** — punishable with up to **1 year imprisonment**
- If someone has voted in your name, report immediately to the **Presiding Officer** at the booth

**Postal Ballot** (voting from outside your constituency):
Available for: Armed Forces, Police on duty, Election officials on duty, Senior citizens (85+), and persons with disabilities`;
  }

  // ── Hindi general ──────────────────────────────────────────────────────────
  if (msg.includes('मतदान') || msg.includes('चुनाव') || msg.includes('वोट') || msg.includes('भारत')) {
    return `**भारतीय चुनाव प्रक्रिया** 🗳️

नमस्ते! मैं ElectionAI हूँ — आपका चुनाव शिक्षा सहायक।

मैं इन विषयों पर जानकारी दे सकता हूँ:

- 📋 **मतदाता पंजीकरण** — कैसे और कहाँ करें
- 🗓️ **चुनाव प्रक्रिया** — घोषणा से शपथ ग्रहण तक
- 🔷 **EVM और VVPAT** — कैसे काम करते हैं
- 📜 **मतदाता अधिकार** — आपके क्या अधिकार हैं
- ❓ **NOTA** — इसका उपयोग कब करें
- 🏛️ **चुनाव आयोग** — क्या करता है

**मतदान के लिए क्या चाहिए?**
- मतदाता पहचान पत्र (EPIC) या 12 वैकल्पिक दस्तावेजों में से कोई एक
- मतदाता सूची में नाम होना अनिवार्य है
- जाँचें: [voters.eci.gov.in](https://voters.eci.gov.in)

आप किस विषय के बारे में जानना चाहते हैं?`;
  }

  // ── Default / General ──────────────────────────────────────────────────────
  return `**Welcome to ElectionAI!** 🗳️

I'm your AI-powered election education assistant with knowledge about India's democratic process.

Here's what I can help you with:

| Topic | What I cover |
|-------|-------------|
| 🗳️ **How to Vote** | Polling day process, booth assignment, ink mark |
| 📋 **Registration** | Form 6, eligibility, online/offline process |
| 🔷 **EVMs & VVPATs** | How they work, security, verification |
| 🗓️ **Election Timeline** | All 9 phases from announcement to oath |
| 📜 **Rules & MCC** | Model Code of Conduct, campaign rules |
| ❓ **NOTA** | What it is and how to use it |
| ⚖️ **Voter Rights** | Your rights, postal ballot, fraud protection |
| 🏛️ **Election Commission** | ECI's role and functions |

**Try asking:**
- *"How do I register to vote?"*
- *"What documents do I need to vote?"*
- *"Explain the election process step by step"*
- *"What is NOTA?"*
- *"How does an EVM work?"*`;
}
