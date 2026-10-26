'use client';

import React from 'react';
import {
  Compass,
  FileQuestion,
  Target,
  CalendarDays,
  MessageSquareCode,
  LineChart,
  FolderArchive,
  Layers,
  Key,
  ShieldCheck,
  Sparkles,
  User,
  GraduationCap,
} from 'lucide-react';
import { UserProfile } from '@/types';

export type ActiveTab =
  | 'topic-map'
  | 'diagnostic-quiz'
  | 'gap-report'
  | 'revision-plan'
  | 'explain-assistant'
  | 'progress-dashboard'
  | 'materials';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: UserProfile;
  weakCount: number;
  docsCount: number;
  onOpenAuth: () => void;
  onOpenArchitecture: () => void;
  onOpenApiKey: () => void;
  hasApiKey: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  weakCount,
  docsCount,
  onOpenAuth,
  onOpenArchitecture,
  onOpenApiKey,
  hasApiKey,
}) => {
  const navTabs = [
    { id: 'topic-map', label: 'Syllabus Map', icon: Compass },
    { id: 'diagnostic-quiz', label: 'Diagnostic Quiz', icon: FileQuestion },
    {
      id: 'gap-report',
      label: 'Gap Report',
      icon: Target,
      badge: weakCount > 0 ? `${weakCount} Weak` : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
    { id: 'revision-plan', label: 'Revision Plan', icon: CalendarDays },
    { id: 'explain-assistant', label: 'Explain RAG', icon: MessageSquareCode },
    { id: 'progress-dashboard', label: 'Progress', icon: LineChart },
    {
      id: 'materials',
      label: 'Materials',
      icon: FolderArchive,
      badge: `${docsCount} Docs`,
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      {/* Top Banner: Judge Credentials & Course Indicator */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-cyan-950/60 border-b border-slate-800/60 px-4 py-1.5 text-xs text-slate-300 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 font-medium text-indigo-300">
            <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
            Active Course:
          </span>
          <span className="text-slate-200 font-semibold truncate max-w-[280px] sm:max-w-md">
            {user.courseName}
          </span>
          <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
            Target Exam: {user.examDate}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenArchitecture}
            className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 border border-indigo-500/30 text-[11px] font-medium transition cursor-pointer"
            title="Inspect RAG Chunking, Embeddings & Evaluation Pipeline"
          >
            <Layers className="w-3 h-3 text-indigo-400" />
            <span>AI Architecture & RAG</span>
          </button>

          <button
            onClick={onOpenApiKey}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium transition cursor-pointer border ${
              hasApiKey
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border-slate-700'
            }`}
            title="Configure optional Gemini API key or use built-in offline engine"
          >
            <Key className="w-3 h-3 text-amber-400" />
            <span>{hasApiKey ? 'Gemini Key Active' : 'API Key (Optional)'}</span>
          </button>

          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-medium transition cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>{user.role === 'judge' ? 'Judge Demo Mode' : user.name}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('topic-map')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-indigo-400/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                  GapFinder AI
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  RAG Diagnostic
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Precision Gap Diagnosis & Adaptive Revision
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-200 border border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`ml-1 text-[10px] font-semibold px-1.5 py-0.2 rounded-full border ${tab.badgeColor}`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 transition cursor-pointer text-left"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                {user.name.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-200 leading-none">{user.name}</p>
                <p className="text-[10px] text-slate-400 leading-none mt-1 capitalize">{user.role} Account</p>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Tab Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 border-t border-slate-800/60 gap-1.5 no-scrollbar">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40'
                    : 'text-slate-400 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] px-1 rounded-full border ${tab.badgeColor}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
