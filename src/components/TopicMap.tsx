'use client';

import React, { useState } from 'react';
import {
  Compass,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Flame,
  ArrowRight,
  BookOpen,
  Sparkles,
  Search,
  Filter,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { Topic, MasteryStatus } from '@/types';

interface TopicMapProps {
  topics: Topic[];
  onStartQuiz: (topicId?: string) => void;
  onExplainTopic: (topicName: string) => void;
  onUploadClick: () => void;
}

export const TopicMap: React.FC<TopicMapProps> = ({
  topics,
  onStartQuiz,
  onExplainTopic,
  onUploadClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | MasteryStatus>('all');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');

  // Group topics by Unit
  const units = Array.from(new Set(topics.map((t) => t.unitName)));

  const filteredTopics = topics.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.unitName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchesUnit = selectedUnit === 'all' || t.unitName === selectedUnit;
    return matchesSearch && matchesStatus && matchesUnit;
  });

  // Calculate metrics
  const totalAssessed = topics.filter((t) => t.status !== 'unassessed').length;
  const weakCount = topics.filter((t) => t.status === 'weak').length;
  const mediumCount = topics.filter((t) => t.status === 'medium').length;
  const strongCount = topics.filter((t) => t.status === 'strong').length;
  const averageMastery =
    topics.length > 0
      ? Math.round(topics.reduce((acc, t) => acc + t.masteryScore, 0) / topics.length)
      : 0;

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              Syllabus Knowledge Graph
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Syllabus Topic Map & Diagnosis
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Mapped from your uploaded syllabus, lecture notes, and past exam papers. Every topic is weighted by official exam importance and color-coded by your diagnosed mastery.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onStartQuiz()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Run Full Diagnostic Quiz
            </button>
            <button
              onClick={onUploadClick}
              className="px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-medium transition cursor-pointer flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              Upload Materials
            </button>
          </div>
        </div>

        {/* Quick Diagnostic Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/60">
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Overall Average</span>
              <GraduationCap className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-xl font-bold text-white mt-1">{averageMastery}%</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Across {topics.length} topics</p>
          </div>

          <div className="bg-rose-950/20 p-3.5 rounded-xl border border-rose-500/30">
            <div className="flex items-center justify-between text-xs text-rose-300">
              <span>Weak Topics (&lt;50%)</span>
              <AlertCircle className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-xl font-bold text-rose-200 mt-1">{weakCount}</p>
            <p className="text-[11px] text-rose-400/80 mt-0.5">Urgent revision required</p>
          </div>

          <div className="bg-amber-950/20 p-3.5 rounded-xl border border-amber-500/30">
            <div className="flex items-center justify-between text-xs text-amber-300">
              <span>Medium (50-75%)</span>
              <HelpCircle className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xl font-bold text-amber-200 mt-1">{mediumCount}</p>
            <p className="text-[11px] text-amber-400/80 mt-0.5">Nuanced boundary gaps</p>
          </div>

          <div className="bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-500/30">
            <div className="flex items-center justify-between text-xs text-emerald-300">
              <span>Strong (&gt;75%)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xl font-bold text-emerald-200 mt-1">{strongCount}</p>
            <p className="text-[11px] text-emerald-400/80 mt-0.5">Exam-ready retention</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics, units, keywords..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                filterStatus === 'all' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('weak')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                filterStatus === 'weak' ? 'bg-rose-500/30 text-rose-300 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Weak
            </button>
            <button
              onClick={() => setFilterStatus('medium')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                filterStatus === 'medium' ? 'bg-amber-500/30 text-amber-300 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Medium
            </button>
            <button
              onClick={() => setFilterStatus('strong')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                filterStatus === 'strong' ? 'bg-emerald-500/30 text-emerald-300 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Strong
            </button>
          </div>

          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Units</option>
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Topics by Unit Layout */}
      {units.map((unitName) => {
        const unitTopics = filteredTopics.filter((t) => t.unitName === unitName);
        if (unitTopics.length === 0) return null;

        const unitExamWeight = unitTopics.reduce((acc, t) => acc + t.examWeight, 0);
        const unitAvgScore = Math.round(
          unitTopics.reduce((acc, t) => acc + t.masteryScore, 0) / unitTopics.length
        );

        return (
          <div key={unitName} className="space-y-3">
            {/* Unit Header Banner */}
            <div className="flex items-center justify-between bg-slate-900/50 px-4 py-2.5 rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-bold text-slate-100">{unitName}</h2>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  {unitExamWeight}% Total Exam Weight
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-400">Unit Mastery:</span>
                <span
                  className={`font-bold ${
                    unitAvgScore >= 75
                      ? 'text-emerald-400'
                      : unitAvgScore >= 50
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {unitAvgScore}%
                </span>
              </div>
            </div>

            {/* Topic Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unitTopics.map((topic) => {
                const isWeak = topic.status === 'weak';
                const isMedium = topic.status === 'medium';
                const isStrong = topic.status === 'strong';

                const borderClasses = isWeak
                  ? 'border-rose-500/40 hover:border-rose-500/70 shadow-rose-950/20'
                  : isMedium
                  ? 'border-amber-500/40 hover:border-amber-500/70 shadow-amber-950/20'
                  : isStrong
                  ? 'border-emerald-500/40 hover:border-emerald-500/70 shadow-emerald-950/20'
                  : 'border-slate-800 hover:border-slate-700';

                return (
                  <div
                    key={topic.id}
                    className={`glass-panel p-5 rounded-xl border transition-all duration-200 flex flex-col justify-between ${borderClasses}`}
                  >
                    <div>
                      {/* Topic Header & Status Pill */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${
                              isWeak
                                ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                                : isMedium
                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                : isStrong
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}
                          >
                            {isWeak ? (
                              <AlertCircle className="w-3 h-3 text-rose-400" />
                            ) : isMedium ? (
                              <HelpCircle className="w-3 h-3 text-amber-400" />
                            ) : isStrong ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            ) : null}
                            {topic.status} ({topic.masteryScore}%)
                          </span>

                          <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                            <Flame className="w-3 h-3 text-amber-500" />
                            {topic.examWeight}% Weight
                          </span>
                        </div>

                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                          {topic.difficulty}
                        </span>
                      </div>

                      {/* Topic Title & Description */}
                      <h3 className="text-base font-bold text-white mb-1.5 leading-snug">
                        {topic.name}
                      </h3>
                      <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                        {topic.description}
                      </p>

                      {/* Mastery Progress Bar */}
                      <div className="space-y-1 mb-4">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Diagnostic Mastery</span>
                          <span
                            className={`font-bold ${
                              isWeak ? 'text-rose-400' : isMedium ? 'text-amber-400' : 'text-emerald-400'
                            }`}
                          >
                            {topic.masteryScore}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isWeak ? 'bg-rose-500' : isMedium ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${topic.masteryScore}%` }}
                          />
                        </div>
                      </div>

                      {/* Prerequisites & Citations info */}
                      {topic.prerequisites.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400 mb-4">
                          <span className="text-slate-500">Prereqs:</span>
                          {topic.prerequisites.map((p, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 text-[10px] border border-slate-700/60"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onExplainTopic(topic.name)}
                        className="text-xs text-indigo-300 hover:text-indigo-200 font-medium flex items-center gap-1 transition cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        Explain Concept
                      </button>

                      <button
                        onClick={() => onStartQuiz(topic.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                          isWeak
                            ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-sm shadow-rose-950'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        }`}
                      >
                        <span>{isWeak ? 'Targeted Drill' : 'Test Topic'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {filteredTopics.length === 0 && (
        <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800">
          <Compass className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No matching topics found</h3>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your search terms or filters.</p>
        </div>
      )}
    </div>
  );
};
