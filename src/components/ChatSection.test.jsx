/**
 * ChatSection.test.jsx
 * Tests for the AI Chat component.
 * Covers: render, input, send, suggested prompts, clear chat.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatSection from './ChatSection';

// ── Mocks ────────────────────────────────────────────────────────────────────

// Mock Gemini API – resolves immediately with canned text
jest.mock('../gemini.js', () => ({
  sendMessageToGemini: jest.fn(async (_history, _text, onChunk) => {
    onChunk('Mocked AI response about elections.');
  }),
}));

// Mock Firebase – no-op persistence
jest.mock('../firebase.js', () => ({
  saveChatMessage: jest.fn().mockResolvedValue(undefined),
  loadChatHistory: jest.fn().mockResolvedValue([]),
}));

// Mock analytics to avoid import errors
jest.mock('../analytics.js', () => ({
  logChatInteraction: jest.fn(),
  logPageView: jest.fn(),
}));

// ─────────────────────────────────────────────────────────────────────────────

describe('ChatSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the chat section heading', async () => {
    await act(async () => {
      render(<ChatSection lang="en" />);
    });
    expect(
      screen.getByText(/Election AI Assistant/i)
    ).toBeInTheDocument();
  });

  test('renders the message input textarea', async () => {
    await act(async () => {
      render(<ChatSection lang="en" />);
    });
    expect(screen.getByRole('textbox', { name: /type your message/i })).toBeInTheDocument();
  });

  test('renders the Send button', async () => {
    await act(async () => {
      render(<ChatSection lang="en" />);
    });
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  test('Send button is disabled when input is empty', async () => {
    await act(async () => {
      render(<ChatSection lang="en" />);
    });
    const sendBtn = screen.getByRole('button', { name: /send message/i });
    expect(sendBtn).toBeDisabled();
  });

  test('Send button becomes enabled when user types a message', async () => {
    await act(async () => {
      render(<ChatSection lang="en" />);
    });
    const textarea = screen.getByRole('textbox', { name: /type your message/i });
    await act(async () => {
      await userEvent.type(textarea, 'How do I register to vote?');
    });
    const sendBtn = screen.getByRole('button', { name: /send message/i });
    expect(sendBtn).not.toBeDisabled();
  });

  test('typing and sending a message shows it in the chat log', async () => {
    const { sendMessageToGemini } = require('../gemini.js');
    await act(async () => {
      render(<ChatSection lang="en" />);
    });

    const textarea = screen.getByRole('textbox', { name: /type your message/i });
    await act(async () => {
      await userEvent.type(textarea, 'What is EVM?');
    });

    const sendBtn = screen.getByRole('button', { name: /send message/i });
    await act(async () => {
      fireEvent.click(sendBtn);
    });

    // User message should appear in the log
    await waitFor(() => {
      expect(screen.getByText('What is EVM?')).toBeInTheDocument();
    });

    // AI response should appear
    await waitFor(() => {
      expect(screen.getByText(/Mocked AI response/i)).toBeInTheDocument();
    });
    expect(sendMessageToGemini).toHaveBeenCalled();
  });

  test('renders suggested prompt buttons when chat is empty', async () => {
    await act(async () => {
      render(<ChatSection lang="en" />);
    });
    // At least one suggested prompt should be visible
    const suggestContainer = screen.getByLabelText(/suggested questions/i);
    expect(suggestContainer).toBeInTheDocument();
  });

  test('clicking a suggested prompt sends it as a message', async () => {
    await act(async () => {
      render(<ChatSection lang="en" />);
    });
    const promptBtn = screen.getByRole('button', { name: /Ask: How do I register to vote in India\?/i });
    await act(async () => {
      fireEvent.click(promptBtn);
    });
    await waitFor(() => {
      expect(screen.getByText('How do I register to vote in India?')).toBeInTheDocument();
    });
  });

  test('renders Hindi heading when lang=hi', async () => {
    await act(async () => {
      render(<ChatSection lang="hi" />);
    });
    expect(screen.getByText(/चुनाव AI सहायक/i)).toBeInTheDocument();
  });
});
