/**
 * QuizSection.test.jsx
 * Tests for the Quiz component.
 * Covers: ready state, start, answer selection, scoring, results.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuizSection from './QuizSection';

// Mock analytics
jest.mock('../analytics.js', () => ({
  logQuizCompletion: jest.fn(),
  logPageView: jest.fn(),
}));

describe('QuizSection – Ready State', () => {
  test('renders quiz heading', () => {
    render(<QuizSection lang="en" />);
    expect(screen.getByText(/Election Knowledge Quiz/i)).toBeInTheDocument();
  });

  test('renders Start Quiz button', () => {
    render(<QuizSection lang="en" />);
    expect(screen.getByRole('button', { name: /start the quiz/i })).toBeInTheDocument();
  });

  test('shows question count stat', () => {
    render(<QuizSection lang="en" />);
    expect(screen.getByText('Questions')).toBeInTheDocument();
  });
});

describe('QuizSection – Playing State', () => {
  beforeEach(() => {
    render(<QuizSection lang="en" />);
    // Start the quiz
    fireEvent.click(screen.getByRole('button', { name: /start the quiz/i }));
  });

  test('shows Question 1 after starting', () => {
    expect(screen.getByText(/Question 1/i)).toBeInTheDocument();
  });

  test('renders 4 answer option buttons', () => {
    const options = screen.getAllByRole('radio');
    expect(options.length).toBe(4);
  });

  test('shows question counter "1 / N"', () => {
    expect(screen.getByText(/1\s*\/\s*\d+/)).toBeInTheDocument();
  });

  test('selecting an option disables all other options', () => {
    const options = screen.getAllByRole('radio');
    fireEvent.click(options[0]);
    // After answering, all options should be disabled
    screen.getAllByRole('radio').forEach(opt => {
      expect(opt).toBeDisabled();
    });
  });

  test('shows Next Question button after answering', () => {
    const options = screen.getAllByRole('radio');
    fireEvent.click(options[0]);
    expect(screen.getByRole('button', { name: /next question/i })).toBeInTheDocument();
  });

  test('score badge starts at 0', () => {
    // Score badge shows "✓ 0"
    expect(screen.getByText(/✓\s*0/i)).toBeInTheDocument();
  });

  test('score increases when correct answer is selected', () => {
    // Import the quiz data to know which is correct
    const { quizQuestionsEnglish } = require('../quizData.js');
    const correctIdx = quizQuestionsEnglish[0].correct;
    const options = screen.getAllByRole('radio');
    fireEvent.click(options[correctIdx]);
    expect(screen.getByText(/✓\s*1/i)).toBeInTheDocument();
  });

  test('Quit Quiz button returns to ready screen', () => {
    fireEvent.click(screen.getByRole('button', { name: /quit quiz/i }));
    expect(screen.getByRole('button', { name: /start the quiz/i })).toBeInTheDocument();
  });
});

describe('QuizSection – Completion', () => {
  test('shows results after answering all questions', () => {
    const { quizQuestionsEnglish } = require('../quizData.js');
    render(<QuizSection lang="en" />);
    fireEvent.click(screen.getByRole('button', { name: /start the quiz/i }));

    quizQuestionsEnglish.forEach((q, i) => {
      const options = screen.getAllByRole('radio');
      fireEvent.click(options[0]); // pick first option each time
      const nextBtn = screen.queryByRole('button', { name: /next question|see results/i });
      if (nextBtn) fireEvent.click(nextBtn);
    });

    // Results screen should show
    expect(screen.getByText(/Quiz Results/i)).toBeInTheDocument();
  });

  test('Try Again button resets to ready state', () => {
    const { quizQuestionsEnglish } = require('../quizData.js');
    render(<QuizSection lang="en" />);
    fireEvent.click(screen.getByRole('button', { name: /start the quiz/i }));

    quizQuestionsEnglish.forEach(() => {
      const options = screen.getAllByRole('radio');
      fireEvent.click(options[0]);
      const nextBtn = screen.queryByRole('button', { name: /next question|see results/i });
      if (nextBtn) fireEvent.click(nextBtn);
    });

    fireEvent.click(screen.getByRole('button', { name: /restart quiz/i }));
    expect(screen.getByRole('button', { name: /start the quiz/i })).toBeInTheDocument();
  });
});

describe('QuizSection – Hindi Language', () => {
  test('renders Hindi heading when lang=hi', () => {
    render(<QuizSection lang="hi" />);
    expect(screen.getByText(/चुनाव ज्ञान क्विज़/i)).toBeInTheDocument();
  });
});
