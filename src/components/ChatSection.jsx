/**
 * ChatSection.jsx
 * Core AI chat interface powered by Gemini 1.5 Flash.
 * Features: streaming responses, chat history, suggested prompts,
 * Firebase persistence, language-aware system prompt.
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { sendMessageToGemini } from '../gemini.js';
import { saveChatMessage, loadChatHistory } from '../firebase.js';

// Unique session ID for this browser tab
const SESSION_ID = `session_${Date.now()}`;

// Suggested starter prompts (English and Hindi)
const SUGGESTED_PROMPTS = {
  en: [
    "How do I register to vote in India?",
    "Explain the election process step by step",
    "What is EVM and how does it work?",
    "What is NOTA and when can I use it?",
    "What documents do I need to vote?",
    "How does the Election Commission work?",
  ],
  hi: [
    "मतदाता पंजीकरण कैसे करें?",
    "भारत में चुनाव प्रक्रिया क्या है?",
    "EVM मशीन क्या होती है?",
    "NOTA क्या है और इसका उपयोग कब करें?",
    "मतदान के लिए कौन-कौन से दस्तावेज चाहिए?",
  ],
};

/**
 * Simple markdown-like renderer for AI responses.
 * Handles **bold**, *italic*, numbered lists, bullets.
 */
function renderAIText(text) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Bold: **text**
    let parts = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic: *text*
    parts = parts.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Inline code: `code`
    parts = parts.replace(/`(.*?)`/g, '<code style="background:rgba(99,102,241,0.2);padding:1px 5px;border-radius:4px;font-size:0.85em;">$1</code>');

    if (line.startsWith('# ')) {
      return <h3 key={i} className="text-base font-bold mt-2 mb-1" style={{ color: '#93c5fd' }} dangerouslySetInnerHTML={{ __html: parts.replace(/^# /, '') }} />;
    }
    if (line.match(/^\d+\. /)) {
      return <li key={i} className="ml-4 my-1" dangerouslySetInnerHTML={{ __html: parts }} />;
    }
    if (line.startsWith('- ') || line.startsWith('• ')) {
      return <li key={i} className="ml-4 my-1 list-disc" dangerouslySetInnerHTML={{ __html: parts.replace(/^[-•] /, '') }} />;
    }
    if (line.trim() === '') return <br key={i} />;
    return <p key={i} className="my-1" dangerouslySetInnerHTML={{ __html: parts }} />;
  });
}

export default function ChatSection({ lang }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamBuffer, setStreamBuffer] = useState(''); // current streaming text
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const historyRef = useRef([]); // conversation history for Gemini context

  // Load Firebase chat history on mount
  useEffect(() => {
    loadChatHistory(SESSION_ID).then(history => {
      if (history.length > 0) {
        setMessages(history);
        historyRef.current = history;
      } else {
        // Show welcome message
        const welcome = {
          role: 'ai',
          content: lang === 'en'
            ? "👋 **Welcome to ElectionAI!**\n\nI'm your AI-powered election education assistant. Ask me anything about:\n- 🗳️ How to vote\n- 📋 Voter registration\n- 🗓️ Election timelines\n- 🔷 EVMs and VVPATs\n- ❓ Voter rights and duties\n\nWhat would you like to learn today?"
            : "👋 **ElectionAI में आपका स्वागत है!**\n\nमैं आपका चुनाव शिक्षा सहायक हूँ। मुझसे पूछें:\n- 🗳️ मतदान कैसे करें\n- 📋 मतदाता पंजीकरण\n- 🗓️ चुनाव समयरेखा\n- 🔷 EVM और VVPAT\n- ❓ मतदाता अधिकार\n\nआप क्या जानना चाहते हैं?",
        };
        setMessages([welcome]);
      }
    });
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamBuffer]);

  /**
   * Send a message to Gemini with streaming.
   */
  const handleSend = useCallback(async (text) => {
    const userText = (text || input).trim();
    if (!userText || isLoading) return;

    // Add user message
    const userMsg = { role: 'user', content: userText };
    setMessages(prev => [...prev, userMsg]);
    historyRef.current = [...historyRef.current, userMsg];
    setInput('');
    setIsLoading(true);
    setStreamBuffer('');

    // Persist user message to Firebase
    await saveChatMessage(SESSION_ID, 'user', userText);

    let fullResponse = '';

    // Stream AI response
    await sendMessageToGemini(
      historyRef.current.slice(0, -1), // history without current msg
      userText,
      (chunk) => {
        fullResponse += chunk;
        setStreamBuffer(fullResponse);
      }
    );

    // Commit final AI message
    const aiMsg = { role: 'ai', content: fullResponse };
    setMessages(prev => [...prev, aiMsg]);
    historyRef.current = [...historyRef.current, aiMsg];
    setStreamBuffer('');
    setIsLoading(false);

    // Persist AI message to Firebase
    await saveChatMessage(SESSION_ID, 'ai', fullResponse);

    // Refocus input
    inputRef.current?.focus();
  }, [input, isLoading]);

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Clear chat
  const handleClear = () => {
    setMessages([]);
    historyRef.current = [];
    setInput('');
  };

  return (
    <div className="flex flex-col gap-4">
      {/* === Section Header === */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold gradient-text">
            {lang === 'en' ? '💬 Election AI Assistant' : '💬 चुनाव AI सहायक'}
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
            {lang === 'en'
              ? 'Ask anything about elections, voting, or civic education'
              : 'चुनाव, मतदान या नागरिक शिक्षा के बारे में कुछ भी पूछें'}
          </p>
        </div>
        {/* Clear chat button */}
        {messages.length > 1 && (
          <button
            onClick={handleClear}
            className="text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              color: '#f87171',
            }}
            aria-label="Clear chat history"
          >
            🗑️ {lang === 'en' ? 'Clear' : 'साफ करें'}
          </button>
        )}
      </div>

      {/* === Suggested Prompts === */}
      {messages.length <= 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" aria-label="Suggested questions">
          {SUGGESTED_PROMPTS[lang].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'rgba(59,130,246,0.08)',
                border: '1px solid rgba(59,130,246,0.2)',
                color: '#93c5fd',
              }}
              aria-label={`Ask: ${prompt}`}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* === Chat Message List === */}
      <div
        className="glass custom-scroll flex flex-col gap-3 overflow-y-auto p-4"
        style={{ minHeight: '380px', maxHeight: '500px' }}
        role="log"
        aria-live="polite"
        aria-label="Chat conversation"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`animate-fade-in-up flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {/* AI avatar */}
            {msg.role === 'ai' && (
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-1"
                style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
                aria-hidden="true"
              >
                🗳️
              </div>
            )}
            <div className={msg.role === 'user' ? 'message-user' : 'message-ai'}>
              {msg.role === 'ai' ? (
                <div className="ai-text text-sm">{renderAIText(msg.content)}</div>
              ) : (
                <span className="text-sm">{msg.content}</span>
              )}
            </div>
          </div>
        ))}

        {/* Streaming response in progress */}
        {isLoading && streamBuffer && (
          <div className="animate-fade-in-up flex justify-start">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-1"
              style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
              aria-hidden="true"
            >
              🗳️
            </div>
            <div className="message-ai">
              <div className="ai-text text-sm">{renderAIText(streamBuffer)}</div>
              {/* Cursor blink */}
              <span className="inline-block w-0.5 h-4 bg-blue-400 animate-pulse ml-0.5 align-middle" aria-hidden="true" />
            </div>
          </div>
        )}

        {/* Typing indicator (before first chunk) */}
        {isLoading && !streamBuffer && (
          <div className="flex justify-start" aria-label="AI is thinking">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs mr-2 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
              aria-hidden="true"
            >
              🗳️
            </div>
            <div className="message-ai flex items-center gap-1.5 py-3">
              <div className="typing-dot w-2 h-2 rounded-full" style={{ background: '#60a5fa' }} />
              <div className="typing-dot w-2 h-2 rounded-full" style={{ background: '#60a5fa' }} />
              <div className="typing-dot w-2 h-2 rounded-full" style={{ background: '#60a5fa' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* === Input Bar === */}
      <div
        className="glass flex items-end gap-2 p-3"
        role="form"
        aria-label="Message input"
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={lang === 'en'
            ? 'Ask about elections, voting, registration...'
            : 'चुनाव के बारे में कुछ भी पूछें...'}
          rows={2}
          className="flex-1 bg-transparent resize-none text-sm outline-none custom-scroll"
          style={{
            color: 'var(--color-text)',
            lineHeight: '1.5',
          }}
          aria-label="Type your message"
          disabled={isLoading}
          maxLength={1500}
        />
        <button
          onClick={() => handleSend()}
          disabled={isLoading || !input.trim()}
          className="btn-primary flex-shrink-0 flex items-center gap-2 text-sm"
          aria-label="Send message"
        >
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
          ) : (
            <span aria-hidden="true">➤</span>
          )}
          {lang === 'en' ? 'Send' : 'भेजें'}
        </button>
      </div>

      {/* Input hint */}
      <p className="text-xs text-center" style={{ color: 'var(--color-muted)' }}>
        {lang === 'en'
          ? 'Press Enter to send · Shift+Enter for new line · Responses powered by Gemini 1.5 Flash'
          : 'Enter दबाएं भेजने के लिए · Shift+Enter नई लाइन · Gemini 1.5 Flash द्वारा संचालित'}
      </p>
    </div>
  );
}
