'use client';

import React from 'react';
import {
  Target,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  CalendarDays,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Flame,
  Award,
  Download,
  Share2,
  Lightbulb,
} from 'lucide-react';
import { GapReport, TopicDiagnosis } from '@/types';

interface GapReportViewProps {
  gapReport: GapReport;
  onNavigateToPlan: () => void;
  onRetakeQuiz: () => void;
  onExplainTopic: (topicName: string) => void;
}

export const GapReportView: React.FC<GapReportViewProps> = ({
  gapReport,
  onNavigateToPlan,
  onRetakeQuiz,
  onExplainTopic,
}) => {
  const isCriticalRisk = gapReport.examRiskLevel === 'Critical';
  const isModerateRisk = gapReport.examRiskLevel === 'Moderate';

  const riskBadgeClasses = isCriticalRisk
    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
    : isModerateRisk
    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Hero Diagnosis Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                Comprehensive Diagnostic Report
              </span>

              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${riskBadgeClasses}`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Exam Risk: {gapReport.examRiskLevel}
              </span>

              <span className="text-xs text-slate-500">
                Generated: {gapReport.generatedAt}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Topic-Level Knowledge Diagnosis
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              {gapReport.summary}
            </p>
          </div>

          {/* Overall Diagnostic Score Gauge */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 text-center shrink-0 w-full md:w-56 space-y-2">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              Mastery Score
            </span>
            <div className="text-4xl font-black bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
              {gapReport.overallScore}%
            </div>
            <div className="text-[11px] text-slate-400">
              {gapReport.correctCount} of {gapReport.totalQuestions} questions correct
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex justify-center gap-3 text-[11px]">
              <span className="text-rose-400 font-bold">{gapReport.weakTopics.length} Weak</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400 font-bold">{gapReport.mediumTopics.length} Med</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-bold">{gapReport.strongTopics.length} Strong</span>
            </div>
          </div>
        </div>

        {/* CTA Banner to Revision Plan */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            Based on these diagnosed gaps, your adaptive study schedule is ready for execution.
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onRetakeQuiz}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Diagnostic
            </button>

            <button
              onClick={onNavigateToPlan}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <CalendarDays className="w-4 h-4" />
              View Adaptive Revision Plan
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* CONFIDENT MISCONCEPTIONS ALERT (High impact diagnostic feature!) */}
      {gapReport.confidentMisconceptions && gapReport.confidentMisconceptions.length > 0 && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-amber-950/40 border border-rose-500/40 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-rose-200">
                Critical Alert: Confident Misconception Detected
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                You marked <strong className="text-rose-300 font-bold">100% Certainty</strong> on question(s) that you answered incorrectly. In high-stakes exams, confident misconceptions are more dangerous than admitted gaps because students never review them voluntarily.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {gapReport.confidentMisconceptions.map((mis, idx) => (
              <div
                key={idx}
                className="bg-slate-950/80 p-4 rounded-xl border border-rose-500/30 text-xs space-y-2.5"
              >
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-semibold text-rose-300">Topic: {mis.topicName}</span>
                  <span className="text-[10px] bg-rose-500/20 text-rose-200 px-2 py-0.5 rounded border border-rose-500/40 font-bold">
                    High Risk Trap
                  </span>
                </div>

                <p className="font-medium text-slate-200">{mis.questionPrompt}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/30">
                    <span className="text-rose-400 font-bold block mb-0.5">Your Confident Answer:</span>
                    <span className="text-slate-300">{mis.studentAnswer}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30">
                    <span className="text-emerald-400 font-bold block mb-0.5">Course Material Ground Truth:</span>
                    <span className="text-slate-300">{mis.correctAnswer}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-slate-300">
                  <span className="text-indigo-300 font-bold">Diagnostic Insight: </span>
                  {mis.whyItMatters}
                </div>

                {mis.citation && (
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Citing: </span>
                    <span className="text-slate-200 font-medium">{mis.citation.docTitle}</span>
                    <span>({mis.citation.section})</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WEAK TOPICS SECTION (<50%) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <h2 className="text-lg font-bold text-white">Weak Topics (&lt;50% Mastery)</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
              {gapReport.weakTopics.length} Topics
            </span>
          </div>
          <span className="text-xs text-rose-400 font-medium hidden sm:inline">
            Directly targeted in Phase 1 of Revision Plan
          </span>
        </div>

        {gapReport.weakTopics.length === 0 ? (
          <div className="glass-panel p-6 rounded-xl border border-slate-800 text-center text-xs text-slate-400">
            No weak topics detected! Your fundamentals are sound across all assessed areas.
          </div>
        ) : (
          <div className="space-y-4">
            {gapReport.weakTopics.map((wt) => (
              <TopicDiagnosisCard
                key={wt.topicId}
                diagnosis={wt}
                type="weak"
                onExplain={() => onExplainTopic(wt.topicName)}
              />
            ))}
          </div>
        )}
      </div>

      {/* MEDIUM TOPICS SECTION (50-75%) */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <h2 className="text-lg font-bold text-white">Medium Topics (50-75% Mastery)</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
              {gapReport.mediumTopics.length} Topics
            </span>
          </div>
          <span className="text-xs text-amber-400 font-medium hidden sm:inline">
            Requires boundary testing and edge case drills
          </span>
        </div>

        {gapReport.mediumTopics.length === 0 ? (
          <div className="glass-panel p-6 rounded-xl border border-slate-800 text-center text-xs text-slate-400">
            No medium topics diagnosed.
          </div>
        ) : (
          <div className="space-y-4">
            {gapReport.mediumTopics.map((mt) => (
              <TopicDiagnosisCard
                key={mt.topicId}
                diagnosis={mt}
                type="medium"
                onExplain={() => onExplainTopic(mt.topicName)}
              />
            ))}
          </div>
        )}
      </div>

      {/* STRONG TOPICS SECTION (>75%) */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <h2 className="text-lg font-bold text-white">Strong Topics (&gt;75% Mastery)</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              {gapReport.strongTopics.length} Topics
            </span>
          </div>
          <span className="text-xs text-emerald-400 font-medium hidden sm:inline">
            Exam ready. Retain with light spaced repetition.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gapReport.strongTopics.map((st) => (
            <div
              key={st.topicId}
              className="glass-panel p-5 rounded-xl border border-emerald-500/30 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400">{st.unitName}</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    {st.masteryScore}% Mastery
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{st.topicName}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">{st.reason}</p>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Exam Weight: {st.examWeight}%</span>
                <span className="text-emerald-400">No immediate revision required</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface TopicDiagnosisCardProps {
  diagnosis: TopicDiagnosis;
  type: 'weak' | 'medium';
  onExplain: () => void;
}

const TopicDiagnosisCard: React.FC<TopicDiagnosisCardProps> = ({
  diagnosis,
  type,
  onExplain,
}) => {
  const isWeak = type === 'weak';
  const borderClass = isWeak
    ? 'border-rose-500/40 bg-gradient-to-br from-rose-950/20 via-slate-900 to-slate-950'
    : 'border-amber-500/40 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-950';

  return (
    <div className={`p-5 rounded-2xl border ${borderClass} space-y-4`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                isWeak
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}
            >
              {diagnosis.status} ({diagnosis.masteryScore}%)
            </span>
            <span className="text-xs text-slate-400">{diagnosis.unitName}</span>
          </div>

          <h3 className="text-base font-bold text-white">{diagnosis.topicName}</h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">Syllabus Weight</span>
            <span className="text-xs font-bold text-amber-400">{diagnosis.examWeight}% of Exam</span>
          </div>
          <button
            onClick={onExplain}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1 transition cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5 text-cyan-300" />
            Explain Topic
          </button>
        </div>
      </div>

      {/* WHY RATING REASON (Mandatory requirement!) */}
      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
        <span className="font-bold text-slate-200 block">Diagnostic Reason for Rating:</span>
        <p className="text-slate-300 leading-relaxed">{diagnosis.reason}</p>
      </div>

      {/* Missed Concepts & Recommended Focus */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {diagnosis.missedConcepts.length > 0 && (
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
            <span className="font-semibold text-rose-300 block">Diagnosed Missed Concepts:</span>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              {diagnosis.missedConcepts.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
          <span className="font-semibold text-cyan-300 block">Prescribed Revision Focus:</span>
          <p className="text-slate-300 leading-relaxed">{diagnosis.recommendedFocus}</p>
        </div>
      </div>

      {/* Source Citation Badges */}
      {diagnosis.citations.length > 0 && (
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
          <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="text-slate-500">Source Grounding:</span>
          {diagnosis.citations.map((c, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded bg-slate-800 text-indigo-200 border border-slate-700/80 truncate max-w-xs"
              title={`${c.docTitle} - ${c.section}`}
            >
              {c.docTitle} § {c.section}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
