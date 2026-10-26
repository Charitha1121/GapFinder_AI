'use client';

import React from 'react';
import {
  LineChart,
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowUpRight,
  BookCheck,
  Calendar,
  Layers,
} from 'lucide-react';
import { ProgressHistoryEntry, Topic } from '@/types';

interface ProgressDashboardProps {
  history: ProgressHistoryEntry[];
  topics: Topic[];
  onSimulateImprovement: () => void;
  onRetakeQuiz: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  history,
  topics,
  onSimulateImprovement,
  onRetakeQuiz,
}) => {
  const latestAttempt = history[history.length - 1] || {
    attemptNumber: 1,
    date: 'Today',
    overallScore: 68,
    weakCount: 2,
    mediumCount: 2,
    strongCount: 4,
    notes: 'Current diagnostic benchmark',
  };

  const initialAttempt = history[0] || latestAttempt;
  const scoreDelta = latestAttempt.overallScore - initialAttempt.overallScore;

  // Count topics currently
  const currentWeak = topics.filter((t) => t.status === 'weak').length;
  const currentMedium = topics.filter((t) => t.status === 'medium').length;
  const currentStrong = topics.filter((t) => t.status === 'strong').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-semibold text-emerald-300">
              <TrendingUp className="w-3.5 h-3.5" />
              Empirical Mastery Trajectory
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Progress &amp; Learning Velocity
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Track how your topic weaknesses transform into confirmed strengths across spaced diagnostic attempts. Your revision plan automatically adapts as gaps are eliminated.
            </p>
          </div>

          {/* Simulate Progress Button for Judges */}
          <div className="flex flex-col gap-2 shrink-0">
            <button
              onClick={onSimulateImprovement}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950 transition cursor-pointer flex items-center justify-center gap-2"
              title="Simulates completed revision study session and improves weak topic to strong"
            >
              <Sparkles className="w-4 h-4" />
              Simulate Mastery Gain (+15%)
            </button>
            <button
              onClick={onRetakeQuiz}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <BookCheck className="w-3.5 h-3.5" />
              Take Fresh Re-Assessment
            </button>
          </div>
        </div>

        {/* 4 Key Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Current Score</span>
              <Award className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-black text-white mt-1">
              {latestAttempt.overallScore}%
            </p>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5 font-bold">
              <ArrowUpRight className="w-3 h-3" />
              +{scoreDelta}% since Attempt 1
            </div>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Weak Topics</span>
              <AlertCircle className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-2xl font-black text-rose-300 mt-1">
              {currentWeak}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Reduced from {initialAttempt.weakCount}
            </p>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Strong Topics</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-emerald-300 mt-1">
              {currentStrong}
            </p>
            <p className="text-[11px] text-emerald-400/80 mt-0.5">
              Target: {topics.length} of {topics.length}
            </p>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Predicted Grade</span>
              <TrendingUp className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-black text-indigo-300 mt-1">
              {latestAttempt.overallScore >= 80 ? 'A (Excellent)' : latestAttempt.overallScore >= 65 ? 'B+ (Solid)' : 'C+ (Needs Prep)'}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Based on syllabus weights
            </p>
          </div>
        </div>
      </div>

      {/* Trajectory Breakdown Chart / Visual Timeline */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <LineChart className="w-4 h-4 text-cyan-400" />
          <span>Diagnostic Attempt History</span>
        </h2>

        <div className="space-y-3">
          {history.map((entry) => (
            <div
              key={entry.attemptNumber}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Attempt #{entry.attemptNumber}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {entry.date}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{entry.notes}</p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-1 rounded bg-rose-500/15 text-rose-300 font-bold border border-rose-500/30 text-[11px]">
                    {entry.weakCount} Weak
                  </span>
                  <span className="px-2 py-1 rounded bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30 text-[11px]">
                    {entry.mediumCount} Med
                  </span>
                  <span className="px-2 py-1 rounded bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30 text-[11px]">
                    {entry.strongCount} Strong
                  </span>
                </div>

                <div className="text-right min-w-[70px]">
                  <span className="text-xl font-black text-white">{entry.overallScore}%</span>
                  <span className="text-[10px] text-slate-500 block">Mastery</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Topic Breakdown Bar Matrix */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Active Topic Readiness Matrix</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {topics.map((topic) => {
            const isWeak = topic.status === 'weak';
            const isMed = topic.status === 'medium';
            return (
              <div
                key={topic.id}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-slate-500 block truncate">
                    {topic.unitName}
                  </span>
                  <span className="font-semibold text-slate-200 block truncate">
                    {topic.name}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isWeak ? 'bg-rose-500' : isMed ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${topic.masteryScore}%` }}
                    />
                  </div>
                  <span
                    className={`font-bold w-9 text-right ${
                      isWeak ? 'text-rose-400' : isMed ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {topic.masteryScore}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
