/**
 * QuizSection.jsx
 * Interactive election knowledge quiz.
 * Features: multiple choice, instant feedback, score tracking,
 * explanations, language toggle, and results summary.
 */
import React, { useState, useCallback } from 'react';
import { quizQuestionsEnglish, quizQuestionsHindi } from '../quizData.js';
import { logQuizCompletion } from '../analytics.js';

// Quiz states
const STATE = { READY: 'ready', PLAYING: 'playing', ANSWERED: 'answered', DONE: 'done' };

export default function QuizSection({ lang }) {
  const [quizState, setQuizState] = useState(STATE.READY);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]); // track each answer

  // Pick questions based on language
  const questions = lang === 'en' ? quizQuestionsEnglish : quizQuestionsHindi;
  const currentQ = questions[currentIdx];
  const totalQ = questions.length;

  /**
   * Start the quiz.
   */
  const handleStart = () => {
    setQuizState(STATE.PLAYING);
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setAnswers([]);
  };

  /**
   * Handle option selection.
   */
  const handleSelect = useCallback((optionIdx) => {
    if (quizState !== STATE.PLAYING) return;
    setSelectedOption(optionIdx);
    setQuizState(STATE.ANSWERED);
    const isCorrect = optionIdx === currentQ.correct;
    if (isCorrect) setScore(s => s + 1);
    setAnswers(prev => [...prev, { questionIdx: currentIdx, selected: optionIdx, correct: isCorrect }]);
  }, [quizState, currentIdx, currentQ]);

  /**
   * Move to next question or show results.
   */
  const handleNext = () => {
    if (currentIdx + 1 >= totalQ) {
      setQuizState(STATE.DONE);
      // Log quiz completion to GA4 + Firebase Analytics
      logQuizCompletion(score, totalQ, lang);
    } else {
      setCurrentIdx(i => i + 1);
      setSelectedOption(null);
      setQuizState(STATE.PLAYING);
    }
  };

  /**
   * Restart quiz.
   */
  const handleRestart = () => {
    setQuizState(STATE.READY);
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setAnswers([]);
  };

  // ── Render: Ready state ──
  if (quizState === STATE.READY) {
    return (
      <div className="flex flex-col gap-5">
        <div>
          <h2 className="text-xl font-bold gradient-text">
            {lang === 'en' ? '🧠 Election Knowledge Quiz' : '🧠 चुनाव ज्ञान क्विज़'}
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
            {lang === 'en'
              ? `Test your knowledge of Indian elections with ${totalQ} questions!`
              : `${totalQ} सवालों के साथ भारतीय चुनाव के बारे में अपना ज्ञान जांचें!`}
          </p>
        </div>

        {/* Quiz intro card */}
        <div className="glass p-6 flex flex-col items-center text-center gap-5">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
            style={{ background: 'linear-gradient(135deg, #2563eb22, #7c3aed22)', border: '2px solid #3b82f640' }}
            aria-hidden="true"
          >
            🧠
          </div>

          <div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
              {lang === 'en' ? 'Are you election-ready?' : 'क्या आप चुनाव-तैयार हैं?'}
            </h3>
            <p className="text-sm mt-2" style={{ color: 'var(--color-muted)', maxWidth: '400px' }}>
              {lang === 'en'
                ? 'This quiz covers: voter eligibility, EVMs, election timeline, NOTA, voter ID, and more.'
                : 'इस क्विज़ में शामिल हैं: मतदाता पात्रता, EVM, चुनाव समयरेखा, NOTA, मतदाता पहचान पत्र और बहुत कुछ।'}
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            {[
              { label: lang === 'en' ? 'Questions' : 'प्रश्न', value: totalQ, color: '#60a5fa' },
              { label: lang === 'en' ? 'Topics' : 'विषय', value: 4, color: '#a78bfa' },
              { label: lang === 'en' ? 'Difficulty' : 'कठिनाई', value: lang === 'en' ? 'Mixed' : 'मिश्रित', color: '#34d399' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-xl font-bold" style={{ color: s.color }}>{s.value}</span>
                <span className="text-xs" style={{ color: 'var(--color-muted)' }}>{s.label}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleStart}
            className="btn-primary text-base px-8 py-3"
            aria-label={lang === 'en' ? 'Start the quiz' : 'क्विज़ शुरू करें'}
          >
            {lang === 'en' ? '🚀 Start Quiz' : '🚀 क्विज़ शुरू करें'}
          </button>
        </div>
      </div>
    );
  }

  // ── Render: Done / Results ──
  if (quizState === STATE.DONE) {
    const percentage = Math.round((score / totalQ) * 100);
    let grade, gradeColor, gradeMsg;
    if (percentage >= 90) {
      grade = '🏆'; gradeColor = '#f59e0b';
      gradeMsg = lang === 'en' ? 'Election Expert!' : 'चुनाव विशेषज्ञ!';
    } else if (percentage >= 70) {
      grade = '🌟'; gradeColor = '#22d3ee';
      gradeMsg = lang === 'en' ? 'Well Informed Citizen!' : 'जागरूक नागरिक!';
    } else if (percentage >= 50) {
      grade = '📚'; gradeColor = '#a78bfa';
      gradeMsg = lang === 'en' ? 'Keep Learning!' : 'सीखते रहें!';
    } else {
      grade = '💪'; gradeColor = '#f97316';
      gradeMsg = lang === 'en' ? 'Read & Try Again!' : 'पढ़ें और दोबारा कोशिश करें!';
    }

    return (
      <div className="flex flex-col gap-5">
        <h2 className="text-xl font-bold gradient-text">
          {lang === 'en' ? '🎯 Quiz Results' : '🎯 क्विज़ परिणाम'}
        </h2>

        <div className="glass p-6 flex flex-col items-center text-center gap-4">
          <div className="text-5xl" aria-hidden="true">{grade}</div>
          <div>
            <p className="text-2xl font-bold" style={{ color: gradeColor }}>{percentage}%</p>
            <p className="font-semibold mt-1" style={{ color: 'var(--color-text)' }}>{gradeMsg}</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
              {lang === 'en' ? `${score} out of ${totalQ} correct` : `${totalQ} में से ${score} सही`}
            </p>
          </div>

          {/* Score bar */}
          <div className="w-full max-w-xs">
            <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid var(--color-border)' }}>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${percentage}%`, background: `linear-gradient(90deg, ${gradeColor}, ${gradeColor}99)` }}
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Answer review */}
          <div className="w-full mt-2 flex flex-col gap-2 text-left">
            <p className="text-xs font-semibold" style={{ color: 'var(--color-muted)' }}>
              {lang === 'en' ? 'Answer Review:' : 'उत्तर समीक्षा:'}
            </p>
            {questions.map((q, i) => {
              const ans = answers[i];
              const isCorrect = ans?.correct;
              return (
                <div
                  key={i}
                  className="flex items-start gap-2 text-xs px-3 py-2 rounded-lg"
                  style={{
                    background: isCorrect ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                    border: `1px solid ${isCorrect ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                  }}
                >
                  <span style={{ color: isCorrect ? '#22c55e' : '#ef4444' }}>{isCorrect ? '✓' : '✗'}</span>
                  <div>
                    <p style={{ color: 'var(--color-text)' }}>{q.question}</p>
                    {!isCorrect && (
                      <p className="mt-0.5" style={{ color: '#86efac' }}>
                        {lang === 'en' ? 'Correct: ' : 'सही उत्तर: '}{q.options[q.correct]}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={handleRestart} className="btn-primary mt-2" aria-label="Restart quiz">
            🔄 {lang === 'en' ? 'Try Again' : 'दोबारा कोशिश करें'}
          </button>
        </div>
      </div>
    );
  }

  // ── Render: Playing / Answered ──
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold gradient-text">
          {lang === 'en' ? '🧠 Quiz' : '🧠 क्विज़'}
        </h2>
        <div className="flex items-center gap-3">
          {/* Score badge */}
          <span
            className="text-sm font-semibold px-3 py-1 rounded-full"
            style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}
          >
            ✓ {score}
          </span>
          {/* Question counter */}
          <span className="text-sm" style={{ color: 'var(--color-muted)' }}>
            {currentIdx + 1} / {totalQ}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-2)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${((currentIdx + (quizState === STATE.ANSWERED ? 1 : 0)) / totalQ) * 100}%`,
            background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Question card */}
      <div className="glass p-6 animate-fade-in-up">
        {/* Question number badge */}
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full mb-3 inline-block"
          style={{ background: 'rgba(59,130,246,0.2)', color: '#60a5fa' }}
        >
          {lang === 'en' ? `Question ${currentIdx + 1}` : `प्रश्न ${currentIdx + 1}`}
        </span>

        {/* Question text */}
        <h3 className="text-base font-semibold mb-5" style={{ color: 'var(--color-text)', lineHeight: 1.5 }}>
          {currentQ.question}
        </h3>

        {/* Options */}
        <div className="flex flex-col gap-2" role="radiogroup" aria-label="Answer options">
          {currentQ.options.map((option, optIdx) => {
            let optClass = 'quiz-option';
            if (quizState === STATE.ANSWERED) {
              if (optIdx === currentQ.correct) optClass += ' correct';
              else if (optIdx === selectedOption && optIdx !== currentQ.correct) optClass += ' wrong';
            }
            return (
              <button
                key={optIdx}
                onClick={() => handleSelect(optIdx)}
                disabled={quizState === STATE.ANSWERED}
                className={optClass}
                role="radio"
                aria-checked={selectedOption === optIdx}
                aria-label={`Option ${optIdx + 1}: ${option}`}
              >
                <span
                  className="inline-flex w-6 h-6 rounded-full items-center justify-center text-xs font-bold mr-3 flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                  aria-hidden="true"
                >
                  {['A','B','C','D'][optIdx]}
                </span>
                {option}
              </button>
            );
          })}
        </div>

        {/* Explanation (shown after answering) */}
        {quizState === STATE.ANSWERED && currentQ.explanation && (
          <div
            className="mt-4 p-3 rounded-xl text-sm animate-fade-in-up"
            style={{
              background: 'rgba(59,130,246,0.1)',
              border: '1px solid rgba(59,130,246,0.3)',
              color: '#93c5fd',
              lineHeight: 1.6,
            }}
            role="alert"
            aria-live="polite"
          >
            💡 <strong>{lang === 'en' ? 'Explanation: ' : 'व्याख्या: '}</strong>
            {currentQ.explanation}
          </div>
        )}

        {/* Next button */}
        {quizState === STATE.ANSWERED && (
          <button
            onClick={handleNext}
            className="btn-primary w-full mt-4 py-3 animate-fade-in-up"
            aria-label={currentIdx + 1 < totalQ
              ? (lang === 'en' ? 'Next question' : 'अगला प्रश्न')
              : (lang === 'en' ? 'See results' : 'परिणाम देखें')}
          >
            {currentIdx + 1 < totalQ
              ? (lang === 'en' ? 'Next Question →' : 'अगला प्रश्न →')
              : (lang === 'en' ? '🎯 See Results' : '🎯 परिणाम देखें')}
          </button>
        )}
      </div>

      {/* Quit button */}
      <button
        onClick={handleRestart}
        className="text-sm text-center transition-colors"
        style={{ color: 'var(--color-muted)' }}
        aria-label="Quit quiz and go back to start"
      >
        ← {lang === 'en' ? 'Quit Quiz' : 'क्विज़ छोड़ें'}
      </button>
    </div>
  );
}
