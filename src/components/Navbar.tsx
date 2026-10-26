'use client';

import React, { useState } from 'react';
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
  GraduationCap,
  Menu,
  X,
  ChevronDown,
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
  showHero?: boolean;
  onToggleHero?: () => void;
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
  showHero,
  onToggleHero,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navTabs = [
    { id: 'topic-map', label: 'Syllabus Map', icon: Compass },
    { id: 'diagnostic-quiz', label: 'Diagnostic Quiz', icon: FileQuestion },
    {
      id: 'gap-report',
      label: 'Gap Report',
      icon: Target,
      badge: weakCount > 0 ? `${weakCount} Weak` : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    },
    { id: 'revision-plan', label: 'Revision Plan', icon: CalendarDays },
    { id: 'explain-assistant', label: 'Explain RAG', icon: MessageSquareCode },
    { id: 'progress-dashboard', label: 'Progress', icon: LineChart },
    {
      id: 'materials',
      label: 'Materials',
      icon: FolderArchive,
      badge: `${docsCount}`,
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#111714]/95 backdrop-blur-xl">
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Left: Brand Identity & Active Course */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('topic-map')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
              title="iGebra - Home"
            >
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-lg bg-emerald-700 flex items-center justify-center border border-emerald-600/40 group-hover:bg-emerald-600 transition-colors duration-200">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold tracking-tight text-slate-100 group-hover:text-emerald-300 transition">
                    iGebra
                  </span>
                </div>
              </div>
            </button>

            {/* Course Badge Chip */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-semibold text-slate-200 truncate max-w-[140px] lg:max-w-[200px]" title={user.courseName}>
                {user.courseName.split(':')[0]}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                Exam {user.examDate.slice(5)}
              </span>
            </div>
          </div>

          {/* Center: Desktop Segmented Navigation Dock */}
          <nav className="hidden 2xl:flex items-center p-1 rounded-lg bg-slate-900/90 border border-slate-800/80">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'nav-pill-active font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border leading-tight ${
                        isActive
                          ? 'bg-white/20 text-white border-white/30'
                          : tab.badgeColor
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Quick Action Controls & User Profile */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Showcase Toggle Button */}
            {onToggleHero && (
              <button
                onClick={onToggleHero}
                className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer border ${
                  showHero
                    ? 'bg-indigo-500/20 text-indigo-200 border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
                }`}
                title="Toggle Google DeepMind AI Flagship Showcase"
              >
                <Sparkles className={`w-3.5 h-3.5 ${showHero ? 'text-cyan-400 animate-pulse' : 'text-indigo-400'}`} />
                <span>Showcase</span>
              </button>
            )}

            {/* Architecture Modal Button */}
            <button
              onClick={onOpenArchitecture}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800 hover:border-indigo-500/40 text-xs font-medium transition cursor-pointer"
              title="Inspect RAG Chunking, Embeddings & Grounding Pipeline"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Architecture</span>
            </button>

            {/* API Key Modal Button */}
            <button
              onClick={onOpenApiKey}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer border ${
                hasApiKey
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800'
              }`}
              title={hasApiKey ? 'Gemini API Key Active' : 'Configure Optional Gemini API Key'}
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{hasApiKey ? 'Gemini Active' : 'API Key'}</span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  hasApiKey ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                }`}
              />
            </button>

            {/* User Profile Pill */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition cursor-pointer text-left group"
              title="Account & Demo Mode Settings"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white shadow-sm ring-1 ring-white/20">
                {user.name.charAt(0)}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-semibold text-slate-200 leading-none group-hover:text-cyan-300 transition">
                  {user.name.split(' ')[0]}
                </p>
                <p className="text-[10px] text-cyan-400/90 leading-none mt-0.5 capitalize font-medium flex items-center gap-1">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  {user.role}
                </p>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-500 group-hover:text-slate-300 transition hidden sm:block" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="2xl:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Secondary Tablet/Laptop Tab Bar (below xl breakpoint) */}
        <div className="hidden sm:flex 2xl:hidden overflow-x-auto py-2 border-t border-slate-800/60 gap-1 no-scrollbar items-center">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'nav-pill-active font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${
                      isActive ? 'bg-white/20 text-white border-white/30' : tab.badgeColor
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile Dropdown Menu (on mobile screens) */}
        {mobileMenuOpen && (
          <div className="sm:hidden py-3 border-t border-slate-800/80 space-y-2">
            <div className="px-2 py-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Navigation
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as ActiveTab);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer text-left ${
                      isActive
                        ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40'
                        : 'text-slate-400 hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{tab.label}</span>
                    {tab.badge && (
                      <span className={`ml-auto text-[9px] px-1 rounded-full border ${tab.badgeColor}`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 px-1">
              <button
                onClick={() => {
                  onOpenArchitecture();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Architecture</span>
              </button>

              {onToggleHero && (
                <button
                  onClick={() => {
                    onToggleHero();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-indigo-300 font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{showHero ? 'Hide Showcase' : 'Show Showcase'}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
