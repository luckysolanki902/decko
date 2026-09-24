'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, X, RotateCcw, Trophy, ChevronLeft, PanelLeftOpen, PanelLeftClose, Trash2 } from 'lucide-react';
import {
  QuizData,
  getLocalQuizIndex,
  setLocalQuizIndex,
  getLocalQuizAnswers,
  setLocalQuizAnswers,
  clearLocalQuizState,
  saveQuizResult,
  syncQuizAnswer,
  loadServerQuizAnswers,
  clearQuizProgress,
} from '@/lib/quiz';

interface QuizClientProps {
  quizData: QuizData;
  section: 'daml' | 'webd';
  phaseId: string;
  phaseNumber: number;
  backPath: string;
  variant: 'rose' | 'blue';
}

export default function QuizClient({ quizData, section, phaseId, phaseNumber, backPath, variant }: QuizClientProps) {
  const questions = quizData.questions;
  const total = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Load saved state: local first, then merge with server
  useEffect(() => {
    const savedIndex = getLocalQuizIndex(section, phaseId);
    const savedAnswers = getLocalQuizAnswers(section, phaseId);
    setCurrentIndex(Math.min(savedIndex, total - 1));
    setAnswers(savedAnswers);
    setMounted(true);

    // Hydrate from server (merge — server answers fill in gaps)
    loadServerQuizAnswers(section, phaseId).then(serverAnswers => {
      if (serverAnswers) {
        setAnswers(prev => {
          const merged = { ...serverAnswers, ...prev };
          setLocalQuizAnswers(section, phaseId, merged);
          return merged;
        });
      }
    });
  }, [section, phaseId, total]);

  // Persist current index
  useEffect(() => {
    if (mounted) setLocalQuizIndex(section, phaseId, currentIndex);
  }, [currentIndex, section, phaseId, mounted]);

  // Persist answers
  useEffect(() => {
    if (mounted) setLocalQuizAnswers(section, phaseId, answers);
  }, [answers, section, phaseId, mounted]);

  const question = questions[currentIndex];
  const selectedOption = answers[String(question.id)];
  const hasAnswered = selectedOption !== undefined;
  const isCorrect = hasAnswered && selectedOption === question.correct;
  const answeredCount = Object.keys(answers).length;
  const score = questions.filter(q => answers[String(q.id)] === q.correct).length;
  const progress = (answeredCount / total) * 100;

  const handleSelect = useCallback((optionIndex: number) => {
    if (hasAnswered) return;
    const newAnswers = { ...answers, [String(question.id)]: optionIndex };
    setAnswers(newAnswers);
    setShowExplanation(true);
    // Sync to server in background
    syncQuizAnswer(section, phaseId, newAnswers, questions, total);
  }, [answers, hasAnswered, question.id, section, phaseId, questions, total]);

  const goNext = useCallback(() => {
    if (currentIndex < total - 1) {
      setCurrentIndex(i => i + 1);
      setShowExplanation(false);
    }
  }, [currentIndex, total]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setShowExplanation(false);
    }
  }, [currentIndex]);

  const handleSubmit = useCallback(async () => {
    setIsSaving(true);
    try {
      await saveQuizResult(section, phaseId, answers, score, total);
      setIsSubmitted(true);
      clearLocalQuizState(section, phaseId);
    } catch (e) {
      console.error('Failed to save quiz:', e);
    } finally {
      setIsSaving(false);
    }
  }, [section, phaseId, answers, score, total]);

  const handleRetake = useCallback(() => {
    clearLocalQuizState(section, phaseId);
    setAnswers({});
    setCurrentIndex(0);
    setShowExplanation(false);
    setIsSubmitted(false);
  }, [section, phaseId]);

  const handleClearProgress = useCallback(async () => {
    setIsClearing(true);
    try {
      await clearQuizProgress(section, phaseId);
      setAnswers({});
      setCurrentIndex(0);
      setShowExplanation(false);
      setIsSubmitted(false);
      setShowClearDialog(false);
      setSidebarOpen(false);
    } catch (e) {
      console.error('Failed to clear quiz progress:', e);
    } finally {
      setIsClearing(false);
    }
  }, [section, phaseId]);

  // When navigating back to an already-answered question, show explanation
  useEffect(() => {
    if (mounted && answers[String(question.id)] !== undefined) {
      setShowExplanation(true);
    } else {
      setShowExplanation(false);
    }
  }, [currentIndex, mounted, answers, question.id]);

  const jumpToQuestion = useCallback((idx: number) => {
    setCurrentIndex(idx);
    setShowExplanation(false);
    setSidebarOpen(false);
  }, []);

  const accentBg = variant === 'rose' ? 'bg-[#FDFBF9] dark:bg-[#2A2018]' : 'bg-[#F6F9FB] dark:bg-[#182228]';
  const accentText = variant === 'rose' ? 'text-[#8A4D3B] dark:text-[#E8C0B2]' : 'text-[#3E5C77] dark:text-[#A7C8E3]';
  const accentBorder = variant === 'rose' ? 'border-[#8A4D3B] dark:border-[#E8C0B2]' : 'border-[#3E5C77] dark:border-[#A7C8E3]';
  const btnPrimary = variant === 'rose'
    ? 'bg-gradient-to-r from-[#B87D6C] to-[#A06A5A] hover:from-[#A06A5A] hover:to-[#8B5A4A] dark:from-[#D4A090] dark:to-[#B87D6C] dark:hover:from-[#B87D6C] dark:hover:to-[#A06A5A] text-white shadow-md hover:shadow-lg'
    : 'bg-gradient-to-r from-[#507290] to-[#3E5C77] hover:from-[#3E5C77] hover:to-[#2D4559] dark:from-[#8AAAC4] dark:to-[#6889A6] dark:hover:from-[#6889A6] dark:hover:to-[#507290] text-white shadow-md hover:shadow-lg';

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E5E4DF] dark:border-[#2C2B28] border-t-[#B87D6C] dark:border-t-[#D4A090] rounded-full animate-spin" />
      </div>
    );
  }

  // ─── Results Screen ───
  if (isSubmitted) {
    const pct = Math.round((score / total) * 100);
    const emoji = pct >= 90 ? '🏆' : pct >= 70 ? '🎉' : pct >= 50 ? '👍' : '📚';
    const message = pct >= 90 ? 'Outstanding!' : pct >= 70 ? 'Great job!' : pct >= 50 ? 'Good effort!' : 'Keep studying!';

    return (
      <div className="max-w-lg mx-auto text-center py-8">
        <div className="bg-white dark:bg-[#1A1A18] rounded-xl border border-[#E5E4DF] dark:border-[#2C2B28] p-8 md:p-10">
          <div className="text-5xl mb-4">{emoji}</div>
          <h2 className="text-2xl font-semibold text-[#1A1A1A] dark:text-[#E8E7E4] mb-2">{message}</h2>
          <p className="text-[#52524E] dark:text-[#9E9C98] mb-6">
            You scored <span className="font-semibold text-[#1A1A1A] dark:text-[#E8E7E4]">{score}</span> out of <span className="font-semibold text-[#1A1A1A] dark:text-[#E8E7E4]">{total}</span> ({pct}%)
          </p>

          <div className="w-full h-3 rounded-full bg-[#F2F1EE] dark:bg-[#232321] mb-8 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${pct >= 70 ? 'bg-[#7AAE8E]' : pct >= 50 ? 'bg-[#E8C87A]' : 'bg-[#B87D6C]'}`}
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRetake}
              className="cursor-pointer inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[#E5E4DF] dark:border-[#2C2B28] text-sm font-medium text-[#52524E] dark:text-[#9E9C98] hover:bg-[#F2F1EE] dark:hover:bg-[#232321] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </button>
            <Link
              href={backPath}
              className={`cursor-pointer inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium ${btnPrimary} transition-colors`}
            >
              Back to Phase
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Sidebar Content ───
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="p-5 border-b border-[#E5E4DF] dark:border-[#2C2B28]">
        <div className="flex items-center justify-between mb-4">
          <span className={`text-[11px] font-medium ${accentText} ${accentBg} px-2.5 py-1 rounded-md`}>
            Phase {phaseNumber} Revision
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="cursor-pointer p-1.5 rounded-lg hover:bg-[#F2F1EE] dark:hover:bg-[#232321] transition-colors"
          >
            <PanelLeftClose className="w-4 h-4 text-[#8A8A86] dark:text-[#686664]" />
          </button>
        </div>
        <h2 className="text-sm font-semibold text-[#1A1A1A] dark:text-[#E8E7E4] mb-1 leading-tight">
          {quizData.title}
        </h2>
        <p className="text-xs text-[#8A8A86] dark:text-[#686664]">
          {total} questions · MCQ
        </p>
      </div>

      {/* Stats */}
      <div className="px-5 py-4 border-b border-[#E5E4DF] dark:border-[#2C2B28]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-[#8A8A86] dark:text-[#686664]">Progress</span>
          <span className="text-xs font-medium text-[#1A1A1A] dark:text-[#E8E7E4] tabular-nums">{answeredCount}/{total}</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-[#F2F1EE] dark:bg-[#232321] mb-4 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${variant === 'rose' ? 'bg-[#B87D6C]' : 'bg-[#6889A6]'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-[#7AAE8E]" />
            <span className="text-xs font-medium text-[#1A1A1A] dark:text-[#E8E7E4] tabular-nums">{score} correct</span>
          </div>
          {answeredCount > 0 && (
            <span className="text-xs text-[#8A8A86] dark:text-[#686664] tabular-nums">
              {Math.round((score / answeredCount) * 100)}% accuracy
            </span>
          )}
        </div>
      </div>

      {/* Question Grid */}
      <div className="flex-1 overflow-y-auto p-5">
        <p className="text-[10px] font-medium uppercase tracking-wider text-[#8A8A86] dark:text-[#686664] mb-3">Questions</p>
        <div className="grid grid-cols-5 gap-2">
          {questions.map((q, idx) => {
            const answered = answers[String(q.id)] !== undefined;
            const correct = answered && answers[String(q.id)] === q.correct;
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={q.id}
                onClick={() => jumpToQuestion(idx)}
                className={`cursor-pointer w-full aspect-square rounded-lg text-[11px] font-medium transition-colors duration-150 ${
                  isCurrent
                    ? `ring-2 ${variant === 'rose' ? 'ring-[#B87D6C] dark:ring-[#D4A090]' : 'ring-[#6889A6] dark:ring-[#8AAAC4]'} ring-offset-1 ring-offset-white dark:ring-offset-[#111110]`
                    : ''
                } ${
                  answered
                    ? correct
                      ? 'bg-[#7AAE8E] dark:bg-[#3A7A55] text-white'
                      : 'bg-[#B87D6C] dark:bg-[#8B5A4A] text-white'
                    : 'bg-[#F2F1EE] dark:bg-[#232321] text-[#8A8A86] dark:text-[#686664] hover:bg-[#E5E4DF] dark:hover:bg-[#2C2B28]'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-5 pt-4 border-t border-[#E5E4DF] dark:border-[#2C2B28] space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#7AAE8E] dark:bg-[#3A7A55]" />
            <span className="text-[10px] text-[#8A8A86] dark:text-[#686664]">Correct</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#B87D6C] dark:bg-[#8B5A4A]" />
            <span className="text-[10px] text-[#8A8A86] dark:text-[#686664]">Incorrect</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#F2F1EE] dark:bg-[#232321]" />
            <span className="text-[10px] text-[#8A8A86] dark:text-[#686664]">Unanswered</span>
          </div>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-5 border-t border-[#E5E4DF] dark:border-[#2C2B28] space-y-3">
        <button
          onClick={() => setShowClearDialog(true)}
          className="cursor-pointer w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[#B87D6C] dark:text-[#D4A090] hover:bg-[#F0E5E0] dark:hover:bg-[#2A2018] border border-[#E5E4DF] dark:border-[#2C2B28] transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Quiz Progress
        </button>
        <Link
          href={backPath}
          className="cursor-pointer inline-flex items-center gap-1.5 text-xs text-[#8A8A86] dark:text-[#686664] hover:text-[#52524E] dark:hover:text-[#9E9C98] transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Back to Phase {phaseNumber}
        </Link>
      </div>
    </div>
  );

  // ─── Quiz Screen ───
  return (
    <div className="relative">
      {/* Clear Progress Confirmation Dialog */}
      {showClearDialog && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 z-60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1A1A18] rounded-xl border border-[#E5E4DF] dark:border-[#2C2B28] p-6 max-w-sm w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#F0E5E0] dark:bg-[#2A2018] flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-[#B87D6C] dark:text-[#D4A090]" />
              </div>
              <h3 className="text-base font-semibold text-[#1A1A1A] dark:text-[#E8E7E4]">
                Clear Quiz Progress
              </h3>
            </div>
            <p className="text-sm text-[#52524E] dark:text-[#9E9C98] mb-6 leading-relaxed">
              This will remove all progress for this quiz for <span className="font-medium text-[#1A1A1A] dark:text-[#E8E7E4]">all users</span>. Everyone will need to retake it from scratch.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearDialog(false)}
                disabled={isClearing}
                className="cursor-pointer flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-[#52524E] dark:text-[#9E9C98] border border-[#E5E4DF] dark:border-[#2C2B28] hover:bg-[#F2F1EE] dark:hover:bg-[#232321] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearProgress}
                disabled={isClearing}
                className="cursor-pointer flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-[#B87D6C] hover:bg-[#A06A5A] dark:bg-[#B87D6C] dark:hover:bg-[#A06A5A] text-white transition-colors disabled:opacity-60"
              >
                {isClearing ? (
                  <span className="inline-flex items-center gap-2 justify-center">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Clearing...
                  </span>
                ) : (
                  'Clear Progress'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 dark:bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-[#111110] border-r border-[#E5E4DF] dark:border-[#2C2B28] z-50 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {sidebarContent}
      </aside>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto">
        {/* Toggle Button */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[#8A8A86] dark:text-[#686664] hover:text-[#52524E] dark:hover:text-[#9E9C98] hover:bg-[#F2F1EE] dark:hover:bg-[#232321] transition-colors border border-[#E5E4DF] dark:border-[#2C2B28]"
          >
            <PanelLeftOpen className="w-4 h-4" />
            <span className="hidden sm:inline">{answeredCount}/{total} answered</span>
          </button>
          <div className="flex items-center gap-1.5 ml-auto">
            <Trophy className="w-3.5 h-3.5 text-[#7AAE8E]" />
            <span className="text-xs font-medium text-[#1A1A1A] dark:text-[#E8E7E4] tabular-nums">{score}</span>
          </div>
        </div>

        {/* Question Number */}
        <div className="mb-4">
          <span className={`text-[11px] font-medium ${accentText} ${accentBg} px-2.5 py-1 rounded-md`}>
            Question {currentIndex + 1} of {total}
          </span>
        </div>

        {/* Question Text */}
        <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A] dark:text-[#E8E7E4] leading-relaxed mb-8">
          {question.question}
        </h2>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {question.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectOption = idx === question.correct;
            let optionClasses = 'border border-[#E5E4DF] dark:border-[#2C2B28] bg-white dark:bg-[#161614] hover:border-[#C0BEB8] dark:hover:border-[#403E3B] shadow-sm hover:shadow-md';

            if (hasAnswered) {
              if (isCorrectOption) {
                optionClasses = 'border-2 border-[#528A6A] dark:border-[#528A6A] bg-[#EEF5F1] dark:bg-[#1A261E] shadow-sm';
              } else if (isSelected && !isCorrect) {
                optionClasses = 'border-2 border-[#C06D5E] dark:border-[#C06D5E] bg-[#FDF5F4] dark:bg-[#291A18] shadow-sm';
              } else {
                optionClasses = 'border border-[#E5E4DF] dark:border-[#2C2B28] bg-white dark:bg-[#161614] opacity-50';
              }
            } else if (isSelected) {
              optionClasses = `border-2 ${accentBorder} ${accentBg} shadow-md scale-[1.01]`;
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={hasAnswered}
                className={`cursor-pointer w-full text-left px-5 py-4 rounded-xl transition-colors duration-200 ${optionClasses}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm font-bold shadow-sm ${
                    hasAnswered && isCorrectOption
                      ? 'bg-[#528A6A] text-white'
                      : hasAnswered && isSelected && !isCorrect
                        ? 'bg-[#C06D5E] text-white'
                        : isSelected
                          ? `${variant === 'rose' ? 'bg-[#8A4D3B]' : 'bg-[#3E5C77]'} text-white`
                          : 'bg-[#F2F1EE] dark:bg-[#232321] text-[#686664] dark:text-[#A8A6A2]'
                  }`}>
                    {hasAnswered && isCorrectOption ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : hasAnswered && isSelected && !isCorrect ? (
                      <X className="w-3.5 h-3.5" />
                    ) : (
                      String.fromCharCode(65 + idx)
                    )}
                  </div>
                  <span className={`text-[15px] leading-relaxed pt-0.5 ${
                    hasAnswered && isCorrectOption
                      ? 'text-[#2D6A4F] dark:text-[#A7D7BC] font-semibold'
                      : hasAnswered && isSelected && !isCorrect
                        ? 'text-[#9C382A] dark:text-[#E8A095] font-semibold'
                        : isSelected
                          ? `${accentText} font-semibold`
                          : 'text-[#1A1A1A] dark:text-[#E8E7E4] font-medium'
                  }`}>
                    {option}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && hasAnswered && (
          <div className={`mb-8 p-6 rounded-2xl shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300 ${
            isCorrect
              ? 'bg-[#EEF5F1] dark:bg-[#1A261E] border border-[#B3D6C2] dark:border-[#2A5A3A]'
              : 'bg-[#FFF8F0] dark:bg-[#251D14] border border-[#E2CDAE] dark:border-[#604E35]'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                isCorrect ? 'bg-[#528A6A] text-white' : 'bg-[#C08C2B] text-white'
              }`}>
                {isCorrect ? <Check className="w-4 h-4" /> : <span className="text-sm">💡</span>}
              </div>
              <div>
                <p className={`text-sm font-bold mb-1.5 uppercase tracking-wider ${
                  isCorrect ? 'text-[#2D6A4F] dark:text-[#A7D7BC]' : 'text-[#A07018] dark:text-[#E2CDAE]'
                }`}>
                  {isCorrect ? 'Correct!' : 'Explanation'}
                </p>
                <p className="text-sm text-[#52524E] dark:text-[#9E9C98] leading-relaxed">
                  {question.explanation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pb-8">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-[#52524E] dark:text-[#9E9C98] hover:bg-[#F2F1EE] dark:hover:bg-[#232321] border border-[#E5E4DF] dark:border-[#2C2B28] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          {currentIndex === total - 1 && answeredCount === total ? (
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className={`cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium ${btnPrimary} transition-colors disabled:opacity-60`}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Trophy className="w-4 h-4" />
                  Submit Quiz
                </>
              )}
            </button>
          ) : (
            <button
              onClick={goNext}
              disabled={currentIndex === total - 1}
              className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium ${btnPrimary} transition-colors disabled:opacity-30 disabled:cursor-not-allowed`}
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
