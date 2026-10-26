'use client';

import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  Circle,
  BookOpen,
  Sparkles,
  Sliders,
  Check,
} from 'lucide-react';
import { RevisionPlan, RevisionTask, StudyTechnique } from '@/types';

interface RevisionPlanViewProps {
  plan: RevisionPlan | null;
  onUpdatePlanHours: (hours: number, days: number) => void;
  onToggleTaskComplete: (taskId: string) => void;
  onExplainTopic: (topicName: string) => void;
}

export const RevisionPlanView: React.FC<RevisionPlanViewProps> = ({
  plan,
  onUpdatePlanHours,
  onToggleTaskComplete,
  onExplainTopic,
}) => {
  const [dailyHours, setDailyHours] = useState(plan?.dailyAvailableHours || 2.5);
  const [daysRemaining, setDaysRemaining] = useState(plan?.daysRemaining || 7);
  const [activeDayFilter, setActiveDayFilter] = useState<number | 'all'>('all');

  if (!plan) {
    return (
      <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800">
        <CalendarDays className="w-12 h-12 text-slate-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">No Revision Plan Generated Yet</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          Complete your Diagnostic Quiz first so GapFinder AI can diagnose your weak topics and construct your personalized study schedule.
        </p>
      </div>
    );
  }

  // Calculate task completion stats
  const allTasks = plan.days.flatMap((d) => d.tasks);
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((t) => t.completed).length;
  const completionPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleApplyConstraints = () => {
    onUpdatePlanHours(dailyHours, daysRemaining);
  };

  const visibleDays =
    activeDayFilter === 'all'
      ? plan.days
      : plan.days.filter((d) => d.dayNumber === activeDayFilter);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner & Control Deck */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-xs font-semibold text-cyan-300">
              <Sparkles className="w-3.5 h-3.5" />
              Adaptive Study Optimization Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Personalized Revision Plan
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Dynamically prioritized based on your diagnosed gaps. High-stakes weak topics are scheduled first with deliberate active recall blocks, source chunk reviews, and past paper drills.
            </p>
          </div>

          {/* Quick Metrics Card */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 text-center shrink-0 w-full md:w-56 space-y-2">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              Plan Progress
            </span>
            <div className="text-3xl font-black text-white">
              {completionPercent}%
            </div>
            <div className="text-[11px] text-slate-400">
              {completedTasks} of {totalTasks} tasks completed
            </div>

            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-300"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Student Constraints Configurator (Hours / Day & Days to Exam) */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Daily Available Study Time:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.5"
                value={dailyHours}
                onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <span className="text-xs font-bold text-white bg-slate-800 px-2 py-1 rounded min-w-[54px] text-center border border-slate-700">
                {dailyHours} hrs
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-cyan-400" />
              Days Until Exam:
            </label>
            <select
              value={daysRemaining}
              onChange={(e) => setDaysRemaining(parseInt(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value={3}>3 Days (Emergency Sprint)</option>
              <option value={7}>7 Days (Targeted Revision)</option>
              <option value={10}>10 Days (Comprehensive Prep)</option>
              <option value={14}>14 Days (Full Cycle Spacing)</option>
            </select>
          </div>

          <div>
            <button
              onClick={handleApplyConstraints}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-indigo-900/30"
            >
              <Sliders className="w-3.5 h-3.5" />
              Recalculate &amp; Adapt Plan
            </button>
          </div>
        </div>
      </div>

      {/* Day Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveDayFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer whitespace-nowrap border ${
            activeDayFilter === 'all'
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
              : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          All Days ({plan.days.length})
        </button>

        {plan.days.map((day) => {
          const dayCompleted = day.tasks.every((t) => t.completed);
          return (
            <button
              key={day.dayNumber}
              onClick={() => setActiveDayFilter(day.dayNumber)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer whitespace-nowrap border flex items-center gap-1.5 ${
                activeDayFilter === day.dayNumber
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {dayCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              <span>Day {day.dayNumber}</span>
            </button>
          );
        })}
      </div>

      {/* Days Timeline */}
      <div className="space-y-6">
        {visibleDays.map((day) => {
          const dayCompletedCount = day.tasks.filter((t) => t.completed).length;
          const isAllDone = day.tasks.length > 0 && dayCompletedCount === day.tasks.length;

          return (
            <div
              key={day.dayNumber}
              className={`glass-panel p-6 rounded-2xl border transition-all ${
                isAllDone
                  ? 'border-emerald-500/40 bg-emerald-950/10'
                  : 'border-slate-800'
              }`}
            >
              {/* Day Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Day {day.dayNumber}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      {day.totalMinutes} minutes total
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white">{day.focusTheme}</h2>
                </div>

                <div className="text-right flex items-center sm:flex-col sm:items-end justify-between gap-2">
                  <span className="text-xs text-slate-400">
                    {dayCompletedCount} of {day.tasks.length} tasks done
                  </span>
                  {isAllDone && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      <Check className="w-3 h-3" /> Day Complete!
                    </span>
                  )}
                </div>
              </div>

              {/* Task Items */}
              <div className="mt-4 space-y-3">
                {day.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={() => onToggleTaskComplete(task.id)}
                    onExplainTopic={() => onExplainTopic(task.topicName)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface TaskCardProps {
  task: RevisionTask;
  onToggleComplete: () => void;
  onExplainTopic: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onExplainTopic,
}) => {
  const isHighPriority = task.priority === 'high';
  const isMediumPriority = task.priority === 'medium';

  const techniqueColorMap: Record<StudyTechnique, string> = {
    'Active Recall': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    'Feynman Technique': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    'Past Paper Drill': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    'Chunk Review': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'Concept Mapping': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    'Error Log Review': 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  };

  return (
    <div
      className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
        task.completed
          ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={onToggleComplete}
        className={`mt-0.5 shrink-0 transition cursor-pointer ${
          task.completed ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
        }`}
      >
        {task.completed ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : (
          <Circle className="w-5 h-5" />
        )}
      </button>

      {/* Task Details */}
      <div className="flex-1 space-y-1.5 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                isHighPriority
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : isMediumPriority
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {task.priority} Priority
            </span>

            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                techniqueColorMap[task.studyTechnique] || 'bg-slate-800 text-slate-300'
              }`}
            >
              {task.studyTechnique}
            </span>

            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              {task.durationMinutes} min
            </span>
          </div>

          <button
            onClick={onExplainTopic}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium transition cursor-pointer"
          >
            Explain Topic
          </button>
        </div>

        <h4
          className={`text-sm font-bold leading-snug ${
            task.completed ? 'line-through text-slate-400' : 'text-white'
          }`}
        >
          {task.title}
        </h4>

        <p className="text-xs text-slate-300 leading-relaxed">{task.description}</p>

        {/* Source citation */}
        {task.citation && (
          <div className="pt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="text-slate-500">Source:</span>
            <span className="text-indigo-200 font-medium">{task.citation.docTitle}</span>
            <span>§ {task.citation.section}</span>
          </div>
        )}
      </div>
    </div>
  );
};
