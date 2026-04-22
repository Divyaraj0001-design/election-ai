/**
 * TimelineSection.test.jsx
 * Tests for the Election Timeline component.
 * Covers: steps render, expand/collapse, step count, Hindi.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TimelineSection from './TimelineSection';

// Mock analytics
jest.mock('../analytics.js', () => ({
  logPageView: jest.fn(),
  logTimelineView: jest.fn(),
}));

const EXPECTED_STEP_COUNT = 9; // Total timeline steps defined in component

describe('TimelineSection – Render', () => {
  test('renders the section heading', () => {
    render(<TimelineSection lang="en" />);
    expect(screen.getByText(/Election Timeline/i)).toBeInTheDocument();
  });

  test(`renders all ${EXPECTED_STEP_COUNT} timeline steps`, () => {
    render(<TimelineSection lang="en" />);
    // Each step has aria-label "Step N: ..."
    const stepButtons = screen.getAllByRole('button', { name: /^Step \d+:/i });
    expect(stepButtons.length).toBe(EXPECTED_STEP_COUNT);
  });

  test('renders Step 1: Announcement', () => {
    render(<TimelineSection lang="en" />);
    expect(screen.getByRole('button', { name: /Step 1:.*Election Schedule Announced/i })).toBeInTheDocument();
  });

  test('renders Step 7: Polling Day', () => {
    render(<TimelineSection lang="en" />);
    expect(screen.getByRole('button', { name: /Step 7:.*Voting Day/i })).toBeInTheDocument();
  });

  test('renders Step 9: Oath Taking (last step)', () => {
    render(<TimelineSection lang="en" />);
    expect(screen.getByRole('button', { name: /Step 9:.*Elected Members Take Oath/i })).toBeInTheDocument();
  });

  test('shows bottom tip about clicking steps', () => {
    render(<TimelineSection lang="en" />);
    expect(screen.getByText(/Click any step to expand details/i)).toBeInTheDocument();
  });
});

describe('TimelineSection – Expand/Collapse', () => {
  test('step details are initially hidden', () => {
    render(<TimelineSection lang="en" />);
    // "ECI holds press conference" is a detail, should not be visible initially
    expect(screen.queryByText(/ECI holds press conference/i)).not.toBeInTheDocument();
  });

  test('clicking a step expands its details', () => {
    render(<TimelineSection lang="en" />);
    const step1 = screen.getByRole('button', { name: /Step 1:.*Election Schedule Announced/i });
    fireEvent.click(step1);
    // Step 1 details should now be visible
    expect(screen.getByText(/ECI holds press conference/i)).toBeInTheDocument();
  });

  test('clicking an expanded step collapses it', () => {
    render(<TimelineSection lang="en" />);
    const step1 = screen.getByRole('button', { name: /Step 1:.*Election Schedule Announced/i });
    fireEvent.click(step1); // expand
    fireEvent.click(step1); // collapse
    expect(screen.queryByText(/ECI holds press conference/i)).not.toBeInTheDocument();
  });

  test('expanding one step collapses another', () => {
    render(<TimelineSection lang="en" />);
    const step1 = screen.getByRole('button', { name: /Step 1:.*Election Schedule Announced/i });
    const step2 = screen.getByRole('button', { name: /Step 2:.*Electoral Rolls Finalized/i });

    fireEvent.click(step1);
    expect(screen.getByText(/ECI holds press conference/i)).toBeInTheDocument();

    fireEvent.click(step2);
    // Step 1 details should collapse, step 2 details appear
    expect(screen.queryByText(/ECI holds press conference/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Final voter lists published/i)).toBeInTheDocument();
  });
});

describe('TimelineSection – Hindi Language', () => {
  test('renders Hindi heading when lang=hi', () => {
    render(<TimelineSection lang="hi" />);
    expect(screen.getByText(/चुनाव समयरेखा/i)).toBeInTheDocument();
  });

  test(`renders all ${EXPECTED_STEP_COUNT} steps in Hindi`, () => {
    render(<TimelineSection lang="hi" />);
    const stepButtons = screen.getAllByRole('button', { name: /चरण \d+:/i });
    expect(stepButtons.length).toBe(EXPECTED_STEP_COUNT);
  });
});
