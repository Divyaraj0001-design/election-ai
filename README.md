# 🗳️ ElectionAI – Election Process Education Assistant

> **PromptWars Hackathon | Hack2skill 2025**

An interactive, AI-powered web application that helps citizens understand the complete election process, timelines, voting steps, and civic education — powered by **Google Gemini 1.5 Flash**.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 💬 **AI Chat** | Ask anything about elections — Gemini answers in real-time with streaming |
| 🗓️ **Election Timeline** | 9-step interactive timeline from announcement to oath-taking |
| 📋 **Voter Registration** | Complete step-by-step registration guide with official links |
| ❓ **FAQ** | Categorized accordion FAQs covering all election topics |
| 🧠 **Quiz Mode** | 10-question interactive quiz with explanations and grading |
| 🌐 **Bilingual** | Full English + Hindi (हिंदी) language support |

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/your-username/election-ai-assistant.git
cd election-ai-assistant
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
```
Edit `.env` and fill in your API keys:
- **Gemini API Key**: Get free at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
- **Firebase**: Create project at [console.firebase.google.com](https://console.firebase.google.com)

### 3. Run Locally
```bash
npm run dev
```
Open **http://localhost:5173**

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | Frontend UI framework |
| **Vite 6** | Build tool & dev server |
| **Tailwind CSS v4** | Utility-first styling |
| **Google Gemini 1.5 Flash** | AI chat responses (streaming) |
| **Firebase Firestore** | Chat history persistence |
| **@google/generative-ai** | Official Gemini SDK |

---

## 📁 Project Structure

```
election-ai-assistant/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Top bar with language toggle
│   │   ├── ChatSection.jsx     # AI chat with Gemini streaming
│   │   ├── TimelineSection.jsx # Interactive election timeline
│   │   ├── RegistrationSection.jsx  # Voter registration guide
│   │   ├── FAQSection.jsx      # Accordion FAQ
│   │   ├── QuizSection.jsx     # Knowledge quiz
│   │   └── Footer.jsx          # Footer with links
│   ├── App.jsx                 # Root component + tab navigation
│   ├── main.jsx                # React entry point
│   ├── index.css               # Global styles + design system
│   ├── gemini.js               # Gemini API integration
│   ├── firebase.js             # Firebase/Firestore setup
│   └── quizData.js             # Quiz questions (EN + HI)
├── index.html                  # HTML entry point
├── vite.config.js              # Vite configuration
├── package.json
├── .env.example                # Environment template
└── .gitignore
```

---

## 🎨 Design Highlights

- **Dark glassmorphism** UI with blue gradient accents
- **Streaming AI responses** with typing indicator
- **Sticky tab navigation** with smooth transitions
- **Mobile-first responsive** layout
- **ARIA labels** on all interactive elements for accessibility
- **WCAG-compliant** color contrast ratios

---

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_GEMINI_API_KEY` | ✅ | Google Gemini API key |
| `VITE_FIREBASE_API_KEY` | Optional | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Optional | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Optional | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Optional | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Optional | Firebase messaging ID |
| `VITE_FIREBASE_APP_ID` | Optional | Firebase app ID |

> ℹ️ Firebase is optional — the app works fully without it (chat history won't persist across sessions).

---

## 🚀 Firebase Deployment

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Build & Deploy
npm run build
firebase deploy
```

---

## 🌟 Hackathon Info

- **Event**: PromptWars Hackathon
- **Platform**: Hack2skill
- **Theme**: AI-powered civic education
- **AI Model**: Google Gemini 1.5 Flash

---

## ⚖️ Disclaimer

ElectionAI is a **non-partisan** civic education tool. This app does not endorse any political party, candidate, or ideology. Information is provided for educational purposes only. For official election information, visit [eci.gov.in](https://eci.gov.in).

---

🇮🇳 *Built with ❤️ for civic empowerment*
