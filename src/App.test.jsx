/**
 * App.test.jsx
 * Tests for App routing / tab navigation.
 * Covers: all 5 tabs load the correct component.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// ── Mocks ──────────────────────────────────────────────────────────────────

jest.mock('./components/ChatSection.jsx', () =>
  function MockChat() { return <div data-testid="section-chat">Chat Section</div>; }
);
jest.mock('./components/TimelineSection.jsx', () =>
  function MockTimeline() { return <div data-testid="section-timeline">Timeline Section</div>; }
);
jest.mock('./components/RegistrationSection.jsx', () =>
  function MockRegister() { return <div data-testid="section-register">Register Section</div>; }
);
jest.mock('./components/FAQSection.jsx', () =>
  function MockFAQ() { return <div data-testid="section-faq">FAQ Section</div>; }
);
jest.mock('./components/QuizSection.jsx', () =>
  function MockQuiz() { return <div data-testid="section-quiz">Quiz Section</div>; }
);
jest.mock('./components/Header.jsx', () =>
  function MockHeader() { return <header data-testid="app-header">Header</header>; }
);
jest.mock('./components/Footer.jsx', () =>
  function MockFooter() { return <footer data-testid="app-footer">Footer</footer>; }
);
jest.mock('./analytics.js', () => ({
  initAnalytics: jest.fn(),
  logPageView: jest.fn(),
}));
jest.mock('./firebase.js', () => ({
  signInAnonymousUser: jest.fn().mockResolvedValue({ uid: 'test-uid' }),
  saveChatMessage: jest.fn().mockResolvedValue(undefined),
  loadChatHistory: jest.fn().mockResolvedValue([]),
  db: {},
}));

// ────────────────────────────────────────────────────────────────────────────

describe('App – Initial Load', () => {
  test('renders the header', () => {
    render(<App />);
    expect(screen.getByTestId('app-header')).toBeInTheDocument();
  });

  test('renders the footer', () => {
    render(<App />);
    expect(screen.getByTestId('app-footer')).toBeInTheDocument();
  });

  test('renders the navigation tablist', () => {
    render(<App />);
    expect(screen.getByRole('tablist', { name: /main navigation/i })).toBeInTheDocument();
  });

  test('renders all 5 tab buttons', () => {
    render(<App />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBe(5);
  });

  test('AI Chat tab is active by default', () => {
    render(<App />);
    expect(screen.getByTestId('section-chat')).toBeInTheDocument();
  });
});

describe('App – Tab Navigation', () => {
  let tabButtons;

  beforeEach(() => {
    render(<App />);
    tabButtons = screen.getAllByRole('tab');
  });

  test('clicking Timeline tab shows Timeline section', () => {
    const timelineTab = tabButtons.find(t => t.getAttribute('id') === 'tab-timeline');
    fireEvent.click(timelineTab);
    expect(screen.getByTestId('section-timeline')).toBeInTheDocument();
    expect(screen.queryByTestId('section-chat')).not.toBeInTheDocument();
  });

  test('clicking Register tab shows Registration section', () => {
    const registerTab = tabButtons.find(t => t.getAttribute('id') === 'tab-register');
    fireEvent.click(registerTab);
    expect(screen.getByTestId('section-register')).toBeInTheDocument();
  });

  test('clicking FAQ tab shows FAQ section', () => {
    const faqTab = tabButtons.find(t => t.getAttribute('id') === 'tab-faq');
    fireEvent.click(faqTab);
    expect(screen.getByTestId('section-faq')).toBeInTheDocument();
  });

  test('clicking Quiz tab shows Quiz section', () => {
    const quizTab = tabButtons.find(t => t.getAttribute('id') === 'tab-quiz');
    fireEvent.click(quizTab);
    expect(screen.getByTestId('section-quiz')).toBeInTheDocument();
  });

  test('active tab has aria-selected=true', () => {
    const timelineTab = tabButtons.find(t => t.getAttribute('id') === 'tab-timeline');
    fireEvent.click(timelineTab);
    expect(timelineTab).toHaveAttribute('aria-selected', 'true');
  });

  test('inactive tabs have aria-selected=false', () => {
    const faqTab = tabButtons.find(t => t.getAttribute('id') === 'tab-faq');
    fireEvent.click(faqTab);
    const chatTab = tabButtons.find(t => t.getAttribute('id') === 'tab-chat');
    expect(chatTab).toHaveAttribute('aria-selected', 'false');
  });

  test('can cycle through all 5 tabs without errors', () => {
    const ids = ['tab-chat', 'tab-timeline', 'tab-register', 'tab-faq', 'tab-quiz'];
    ids.forEach(id => {
      const tab = tabButtons.find(t => t.getAttribute('id') === id);
      fireEvent.click(tab);
      expect(tab).toHaveAttribute('aria-selected', 'true');
    });
  });
});
