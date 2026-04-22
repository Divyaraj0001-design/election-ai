/**
 * gemini.js
 * Gemini API integration for ElectionAI.
 * Uses @google/generative-ai SDK with election-focused system prompt.
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
 * @param {Array} history - Array of {role, parts} objects for conversation context
 * @param {string} message - User's current message
 * @param {Function} onChunk - Callback called with each text chunk for streaming
 * @returns {Promise<string>} Full response text
 */
export async function sendMessageToGemini(history, message, onChunk) {
  // Fallback response when API key is not configured
  if (!model) {
    const fallback = getFallbackResponse(message);
    await simulateStream(fallback, onChunk);
    return fallback;
  }

  try {
    // Build chat with existing history
    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
    });

    // Send message with streaming
    const result = await chat.sendMessageStream(message);
    let fullText = '';

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      if (onChunk) onChunk(chunkText);
    }

    return fullText;
  } catch (err) {
    console.error('Gemini API error:', err);
    const errMsg = '⚠️ Sorry, I encountered an error. Please check your API key or try again later.';
    if (onChunk) onChunk(errMsg);
    return errMsg;
  }
}

/**
 * Simulate streaming for demo fallback responses.
 */
async function simulateStream(text, onChunk) {
  if (!onChunk) return;
  const words = text.split(' ');
  for (const word of words) {
    onChunk(word + ' ');
    await new Promise(r => setTimeout(r, 30));
  }
}

/**
 * Fallback responses for demo mode (no API key).
 */
function getFallbackResponse(message) {
  const msg = message.toLowerCase();

  if (msg.includes('register') || msg.includes('registration') || msg.includes('पंजीकरण')) {
    return `**Voter Registration in India** 🗳️

To register as a voter in India, follow these steps:

1. **Check Eligibility**: You must be 18+ years old and an Indian citizen.
2. **Visit the Official Portal**: Go to [voters.eci.gov.in](https://voters.eci.gov.in)
3. **Fill Form 6**: This is the New Voter Registration form.
4. **Submit Documents**: Proof of age (Aadhaar, birth certificate) and proof of address.
5. **Receive EPIC Card**: Your Elector Photo Identity Card (Voter ID) will be issued.

📱 You can also register via the **Voter Helpline App** or call **1950** for assistance.`;
  }

  if (msg.includes('evm') || msg.includes('machine') || msg.includes('वोटिंग मशीन')) {
    return `**Electronic Voting Machines (EVMs)** 🔷

India uses EVMs for all major elections since 2004. Here's how they work:

- **Two Units**: Ballot Unit (voter interface) + Control Unit (polling officer's table)
- **VVPAT**: Voter Verifiable Paper Audit Trail — shows a paper slip so you can verify your vote
- **Tamper-proof**: Standalone machines, not connected to internet
- **Battery powered**: Work without electricity
- **Result Storage**: Stored in flash memory, counted electronically

✅ EVMs have made elections faster, cheaper, and more accurate than paper ballots.`;
  }

  if (msg.includes('timeline') || msg.includes('process') || msg.includes('चुनाव प्रक्रिया')) {
    return `**Indian Election Process – Step by Step** 📋

1. **Announcement**: Election Commission announces schedule & Model Code of Conduct begins
2. **Voter List Finalization**: Electoral rolls are updated and published
3. **Nomination**: Candidates file nominations (Form 2B)
4. **Scrutiny**: Returning Officer checks nominations
5. **Withdrawal**: Candidates can withdraw within deadline
6. **Campaigning**: Political parties campaign (ends 48hrs before polling)
7. **Polling Day**: Voters cast votes at designated booths
8. **Counting**: Votes counted on designated day, results declared
9. **Oath Taking**: Winning candidates take oath of office`;
  }

  return `Hello! I'm **ElectionAI** 🗳️, your election education assistant.

⚠️ *Demo mode active — Add your Gemini API key in the .env file for full AI responses.*

I can help you with:
- 📋 **Election process** and timelines
- 🗒️ **Voter registration** steps
- 🔷 **EVM and VVPAT** information  
- 📜 **Rights and duties** of voters
- 🏛️ **Election Commission** of India
- ❓ **FAQs** about elections

What would you like to know about elections?`;
}
