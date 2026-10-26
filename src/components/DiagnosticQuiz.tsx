'use client';

import React, { useState } from 'react';
import {
  FileQuestion,
  CheckCircle2,
  XCircle,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ShieldAlert,
  Flame,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Question, QuizSubmission } from '@/types';

interface DiagnosticQuizProps {
  questions: Question[];
  onCompleteQuiz: (submissions: Record<string, QuizSubmission>) => void;
  selectedTopicName?: string;
  onResetToAll?: () => void;
}

export const DiagnosticQuiz: React.FC<DiagnosticQuizProps> = ({
  questions,
  onCompleteQuiz,
  selectedTopicName,
  onResetToAll,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [confidences, setConfidences] = useState<Record<string, 'low' | 'medium' | 'high'>>({});
  const [showCitationSnippet, setShowCitationSnippet] = useState(false);
  const [showImmediateExplanation, setShowImmediateExplanation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (questions.length === 0) {
    return (
      <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800">
        <FileQuestion className="w-12 h-12 text-slate-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">No Diagnostic Questions Available</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          Upload course syllabus and notes, or select a topic from the Topic Map to generate grounded diagnostic questions.
        </p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const selectedOptionId = selectedAnswers[currentQ.id];
  const currentConfidence = confidences[currentQ.id] || 'medium';
  const isAnswered = !!selectedOptionId;
  const isCorrect = selectedOptionId === currentQ.correctOptionId;

  const handleSelectOption = (optId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: optId }));
    if (!confidences[currentQ.id]) {
      setConfidences((prev) => ({ ...prev, [currentQ.id]: 'medium' }));
    }
  };

  const handleConfidenceChange = (conf: 'low' | 'medium' | 'high') => {
    setConfidences((prev) => ({ ...prev, [currentQ.id]: conf }));
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  const handleNext = () => {
    setShowCitationSnippet(false);
    setShowImmediateExplanation(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setShowCitationSnippet(false);
    setShowImmediateExplanation(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setIsSubmitting(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // canvas-confetti fallback
    }

    const submissions: Record<string, QuizSubmission> = {};
    for (const q of questions) {
      const chosen = selectedAnswers[q.id];
      const conf = confidences[q.id] || 'medium';
      submissions[q.id] = {
        questionId: q.id,
        selectedOptionId: chosen || '',
        confidence: conf,
        isCorrect: chosen === q.correctOptionId,
        timeSpentSeconds: 45,
      };
    }

    setTimeout(() => {
      onCompleteQuiz(submissions);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Quiz Progress & Topic Header */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                Grounded Diagnostic Evaluation
              </span>
              {selectedTopicName && (
                <span className="text-xs text-cyan-400 font-semibold flex items-center gap-1">
                  Topic: {selectedTopicName}
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              Diagnostic Assessment
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {selectedTopicName && onResetToAll && (
              <button
                onClick={onResetToAll}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Switch to Full Syllabus
              </button>
            )}

            <div className="text-right">
              <span className="text-xs font-bold text-slate-300">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-[11px] text-slate-500 block">
                {answeredCount} of {questions.length} answered
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
        {/* Unit and Difficulty Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
              {currentQ.unitName}
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              {currentQ.topicName}
            </span>
          </div>

          {currentQ.pastPaperRef && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" />
              {currentQ.pastPaperRef}
            </span>
          )}
        </div>

        {/* Grounding Source Citation Badge */}
        <div className="bg-indigo-950/30 border border-indigo-500/30 p-3.5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              Grounded in Student Material:
            </span>
            <button
              onClick={() => setShowCitationSnippet(!showCitationSnippet)}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 cursor-pointer font-medium"
            >
              <span>{showCitationSnippet ? 'Hide Source Snippet' : 'Inspect Source Snippet'}</span>
              {showCitationSnippet ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="text-xs text-slate-300 flex flex-wrap items-center gap-2">
            <span className="font-medium text-white">{currentQ.citation.docTitle}</span>
            <span className="text-slate-500">•</span>
            <span className="text-indigo-200">{currentQ.citation.section}</span>
            {currentQ.citation.pageNumber && (
              <>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">Page {currentQ.citation.pageNumber}</span>
              </>
            )}
          </div>

          {showCitationSnippet && (
            <div className="mt-2 pt-2 border-t border-indigo-500/20 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800 leading-relaxed italic">
              &quot;{currentQ.citation.pageSnippet}&quot;
            </div>
          )}
        </div>

        {/* Question Prompt */}
        <div className="space-y-2">
          <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
            {currentQ.prompt}
          </p>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {currentQ.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                className={`w-full text-left p-4 rounded-xl text-xs sm:text-sm transition-all duration-150 flex items-start gap-3 cursor-pointer border ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-950/40 ring-1 ring-indigo-500/40'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-200'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border text-xs font-bold ${
                    isSelected
                      ? 'border-indigo-400 bg-indigo-500 text-white'
                      : 'border-slate-700 text-slate-400'
                  }`}
                >
                  {option.id.replace('opt-', '').toUpperCase()}
                </div>
                <div className="flex-1 leading-snug">{option.text}</div>
              </button>
            );
          })}
        </div>

        {/* Confidence Selector (Crucial for Misconception Detection) */}
        {isAnswered && (
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                How confident are you in this answer?
              </span>
              <span className="text-[11px] text-slate-500">
                Used to diagnose false confidence &amp; misconceptions
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleConfidenceChange('low')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                  currentConfidence === 'low'
                    ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                Low (Guessing)
              </button>
              <button
                onClick={() => handleConfidenceChange('medium')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                  currentConfidence === 'medium'
                    ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                Medium (Fairly Sure)
              </button>
              <button
                onClick={() => handleConfidenceChange('high')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                  currentConfidence === 'high'
                    ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                High (100% Certain)
              </button>
            </div>
          </div>
        )}

        {/* Instant Study Check Mode Toggle */}
        {isAnswered && (
          <div>
            <button
              onClick={() => setShowImmediateExplanation(!showImmediateExplanation)}
              className="text-xs text-indigo-300 hover:text-indigo-200 font-medium flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{showImmediateExplanation ? 'Hide Answer Check' : 'Instant Diagnostic Feedback'}</span>
            </button>

            {showImmediateExplanation && (
              <div
                className={`mt-3 p-4 rounded-xl border text-xs leading-relaxed space-y-2 ${
                  isCorrect
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Correct Diagnosis!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span>Conceptual Gap Detected</span>
                    </>
                  )}
                </div>
                <p className="text-slate-300">{currentQ.explanation}</p>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
              currentIndex === 0
                ? 'opacity-40 cursor-not-allowed bg-slate-900 text-slate-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-indigo-900/30"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmitQuiz}
              disabled={answeredCount === 0 || isSubmitting}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg ${
                answeredCount === 0 || isSubmitting
                  ? 'opacity-50 cursor-not-allowed bg-slate-800 text-slate-400'
                  : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-emerald-950/40'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>{isSubmitting ? 'Synthesizing Gap Report...' : 'Submit & Generate Diagnosis'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
