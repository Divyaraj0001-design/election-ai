/**
 * FAQSection.test.jsx
 * Tests for the FAQ accordion component.
 * Covers: render, accordion open/close, categories, Hindi.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FAQSection from './FAQSection';

// Mock analytics
jest.mock('../analytics.js', () => ({
  logPageView: jest.fn(),
}));

describe('FAQSection – Render', () => {
  test('renders the FAQ heading', () => {
    render(<FAQSection lang="en" />);
    expect(screen.getByText(/Frequently Asked Questions/i)).toBeInTheDocument();
  });

  test('renders all 4 category sections', () => {
    render(<FAQSection lang="en" />);
    expect(screen.getByText('Voting Basics')).toBeInTheDocument();
    expect(screen.getByText('EVMs & Technology')).toBeInTheDocument();
    expect(screen.getByText('Election Rules')).toBeInTheDocument();
    expect(screen.getByText('Voter Rights')).toBeInTheDocument();
  });

  test('renders FAQ question buttons', () => {
    render(<FAQSection lang="en" />);
    expect(screen.getByText(/Who is eligible to vote in India\?/i)).toBeInTheDocument();
  });

  test('shows bottom CTA asking users to use AI chat', () => {
    render(<FAQSection lang="en" />);
    expect(screen.getByText(/Have more questions\?/i)).toBeInTheDocument();
  });
});

describe('FAQSection – Accordion Open/Close', () => {
  test('answers are hidden by default', () => {
    render(<FAQSection lang="en" />);
    // An answer text should not be visible initially
    expect(
      screen.queryByText(/Any Indian citizen who is 18 years or older/i)
    ).not.toBeInTheDocument();
  });

  test('clicking a question opens its answer', () => {
    render(<FAQSection lang="en" />);
    const questionBtn = screen.getByText(/Who is eligible to vote in India\?/i)
      .closest('button');
    fireEvent.click(questionBtn);
    expect(
      screen.getByText(/Any Indian citizen who is 18 years or older/i)
    ).toBeInTheDocument();
  });

  test('clicking an open question closes it', () => {
    render(<FAQSection lang="en" />);
    const questionBtn = screen.getByText(/Who is eligible to vote in India\?/i)
      .closest('button');
    fireEvent.click(questionBtn); // open
    fireEvent.click(questionBtn); // close
    expect(
      screen.queryByText(/Any Indian citizen who is 18 years or older/i)
    ).not.toBeInTheDocument();
  });

  test('aria-expanded is false when accordion is closed', () => {
    render(<FAQSection lang="en" />);
    const questionBtn = screen.getByText(/Who is eligible to vote in India\?/i)
      .closest('button');
    expect(questionBtn).toHaveAttribute('aria-expanded', 'false');
  });

  test('aria-expanded is true when accordion is open', () => {
    render(<FAQSection lang="en" />);
    const questionBtn = screen.getByText(/Who is eligible to vote in India\?/i)
      .closest('button');
    fireEvent.click(questionBtn);
    expect(questionBtn).toHaveAttribute('aria-expanded', 'true');
  });

  test('opening one accordion closes the previously open one', () => {
    render(<FAQSection lang="en" />);
    const q1 = screen.getByText(/Who is eligible to vote in India\?/i).closest('button');
    const q2 = screen.getByText(/What ID do I need to vote\?/i).closest('button');

    fireEvent.click(q1);
    expect(screen.getByText(/Any Indian citizen who is 18 years or older/i)).toBeInTheDocument();

    fireEvent.click(q2);
    // First answer should close
    expect(
      screen.queryByText(/Any Indian citizen who is 18 years or older/i)
    ).not.toBeInTheDocument();
    // Second answer should be visible
    expect(screen.getByText(/EPIC \(Voter ID card\) is primary/i)).toBeInTheDocument();
  });

  test('FAQ about EVMs renders correctly', () => {
    render(<FAQSection lang="en" />);
    const evmQ = screen.getByText(/How does an EVM work\?/i).closest('button');
    fireEvent.click(evmQ);
    expect(screen.getByText(/Ballot Unit \(BU\)/i)).toBeInTheDocument();
  });
});

describe('FAQSection – Hindi Language', () => {
  test('renders Hindi heading when lang=hi', () => {
    render(<FAQSection lang="hi" />);
    expect(screen.getByText(/अक्सर पूछे जाने वाले सवाल/i)).toBeInTheDocument();
  });

  test('renders Hindi category when lang=hi', () => {
    render(<FAQSection lang="hi" />);
    expect(screen.getByText(/मतदान की मूल बातें/i)).toBeInTheDocument();
  });
});
