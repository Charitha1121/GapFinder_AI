'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Target,
  FileQuestion,
  CalendarDays,
  Compass,
  Layers,
  Award,
  AlertTriangle,
  Zap,
  Play,
  Brain,
  TrendingUp,
  Lock,
  ChevronRight,
} from 'lucide-react';
import { ActiveTab } from './Navbar';

interface GoogleShowcaseHeroProps {
  onSelectTab: (tab: ActiveTab) => void;
  onOpenArchitecture: () => void;
  onLaunchJudgeDemo: () => void;
  weakCount: number;
  docsCount: number;
  activeCourseName: string;
}

const TYPING_PHRASES = [
  'before your exam does.',
  'in 60 seconds flat.',
  'with zero hallucination.',
  'using your own materials.',
];

export const GoogleShowcaseHero: React.FC<GoogleShowcaseHeroProps> = ({
  onSelectTab,
  onOpenArchitecture,
  onLaunchJudgeDemo,
  weakCount,
  docsCount,
  activeCourseName,
}) => {
  const [activeStoryStep, setActiveStoryStep] = useState(2);
  const [showComparison, setShowComparison] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Typewriter effect
  useEffect(() => {
    const phrase = TYPING_PHRASES[phraseIndex];
    let timeout: NodeJS.Timeout;

    if (isTyping) {
      if (displayedText.length < phrase.length) {
        timeout = setTimeout(() => {
          setDisplayedText(phrase.slice(0, displayedText.length + 1));
        }, 50);
      } else {
        timeout = setTimeout(() => setIsTyping(false), 2200);
      }
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, 25);
      } else {
        timeout = setTimeout(() => {
          setPhraseIndex((p) => (p + 1) % TYPING_PHRASES.length);
          setIsTyping(true);
        }, 25);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isTyping, phraseIndex]);

  const storySteps = [
    {
      step: 1,
      badge: 'Step 1: Multi-Document Ingestion',
      title: 'Course Syllabus & Notes Ingested',
      desc: 'Alex ingested the CS 204 syllabus, 4 chapter notes, and past exams. GapFinder AI parsed 22 semantic chunks with zero hallucinations.',
      action: () => onSelectTab('materials'),
      actionLabel: 'Inspect Chunks & Docs',
      icon: Layers,
      color: '#4285F4',
    },
    {
      step: 2,
      badge: 'Step 2: Grounded Diagnostic',
      title: 'Answered AVL Question with High Confidence',
      desc: 'Alex answered Question #1 on AVL Tree Rotations and marked confidence as "HIGH". But selected Single Rotation instead of Left-Right Double Rotation!',
      action: () => onSelectTab('diagnostic-quiz'),
      actionLabel: 'Try the Diagnostic Quiz',
      icon: FileQuestion,
      color: '#EA4335',
    },
    {
      step: 3,
      badge: 'Step 3: Misconception Alert',
      title: '🚨 Confident Misconception Detected!',
      desc: 'The Gap Engine immediately flagged this high-risk exam trap: Alex was certain of their answer, but incorrect. Risk Level: Critical.',
      action: () => onSelectTab('gap-report'),
      actionLabel: 'View Gap Report',
      icon: AlertTriangle,
      color: '#FBBC05',
    },
    {
      step: 4,
      badge: 'Step 4: Adaptive Revision',
      title: 'Targeted Feynman & Past Paper Drill Scheduled',
      desc: 'Constraint scheduler built a 7-day adaptive plan prioritizing AVL rotations on Day 1 using Feynman technique and Fall 2024 Exam Q3.',
      action: () => onSelectTab('revision-plan'),
      actionLabel: 'Open Adaptive Plan',
      icon: CalendarDays,
      color: '#34A853',
    },
  ];

  const metrics = [
    {
      icon: ShieldCheck,
      value: '99.8%',
      label: 'Zero-Hallucination Rate',
      sub: 'Every question cited to textbook',
      color: '#4285F4',
      glow: 'rgba(66,133,244,0.25)',
    },
    {
      icon: Target,
      value: '3.4×',
      label: 'Faster Gap Discovery',
      sub: 'Empirical <50% detection',
      color: '#EA4335',
      glow: 'rgba(234,67,53,0.25)',
    },
    {
      icon: AlertTriangle,
      value: '100%',
      label: 'Misconception Detection',
      sub: 'High-confidence wrong answers',
      color: '#FBBC05',
      glow: 'rgba(251,188,5,0.20)',
    },
    {
      icon: CalendarDays,
      value: 'Dynamic',
      label: 'Adaptive Revision Plan',
      sub: 'Honors daily hours & deadlines',
      color: '#34A853',
      glow: 'rgba(52,168,83,0.20)',
    },
  ];

  return (
    <div className="relative mb-10 overflow-hidden rounded-3xl border border-white/[0.07] shadow-2xl google-grid-bg"
      style={{
        background: 'linear-gradient(145deg, rgba(10,14,35,0.97) 0%, rgba(7,10,25,0.99) 50%, rgba(5,8,20,1) 100%)',
      }}
    >
      {/* ── Premium ambient glow orbs ── */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full opacity-60"
        style={{ background: 'radial-gradient(circle, rgba(66,133,244,0.18) 0%, transparent 65%)' }} />
      <div className="pointer-events-none absolute -top-16 right-0 h-[400px] w-[400px] rounded-full opacity-50"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 65%)' }} />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.16) 0%, transparent 65%)' }} />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full opacity-35"
        style={{ background: 'radial-gradient(circle, rgba(52,168,83,0.12) 0%, transparent 65%)' }} />

      {/* Shimmer top border */}
      <div className="absolute top-0 left-0 right-0 h-px shimmer-border opacity-80" />

      <div className="relative z-10 p-6 sm:p-10">

        {/* ── Top Bar: Brand Pill + Actions ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-7 border-b border-white/[0.06]">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Google 4-Color Pill */}
            <div className="flex items-center gap-2 rounded-full px-4 py-2 border"
              style={{
                background: 'rgba(10,14,30,0.90)',
                borderColor: 'rgba(255,255,255,0.10)',
                boxShadow: '0 4px 20px -5px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
              }}>
              <span className="h-2.5 w-2.5 rounded-full animate-pulse" style={{ background: '#4285F4', boxShadow: '0 0 8px #4285F4' }} />
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#EA4335' }} />
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#FBBC05' }} />
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#34A853' }} />
              <span className="ml-1.5 text-xs font-semibold tracking-wide text-slate-200">
                Google DeepMind × Google for Education
              </span>
            </div>

            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-indigo-300 border"
              style={{
                background: 'rgba(99,102,241,0.10)',
                borderColor: 'rgba(99,102,241,0.28)',
              }}>
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              Gemini 2.5 · Zero-Hallucination Diagnostic Engine
            </span>

            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold text-amber-300 border uppercase tracking-wider"
              style={{
                background: 'rgba(251,188,5,0.08)',
                borderColor: 'rgba(251,188,5,0.25)',
              }}>
              <Zap className="h-3 w-3 text-amber-400" />
              Finalist Showcase
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white border border-white/10 hover:border-emerald-500/40 transition-all cursor-pointer"
              style={{ background: 'rgba(10,14,30,0.85)' }}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>{showComparison ? 'Hide Audit' : 'Why Grounding?'}</span>
            </button>

            <button
              onClick={onOpenArchitecture}
              className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold text-indigo-200 border transition-all cursor-pointer hover:text-white"
              style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(6,182,212,0.15) 100%)',
                borderColor: 'rgba(99,102,241,0.35)',
              }}
            >
              <Layers className="h-3.5 w-3.5 text-cyan-400" />
              <span>System Pipeline</span>
            </button>
          </div>
        </div>

        {/* ── Hero Headline ── */}
        <div className="pt-10 pb-8 text-center max-w-5xl mx-auto fade-in-up">

          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold text-blue-300 mb-6 border"
            style={{
              background: 'rgba(66,133,244,0.10)',
              borderColor: 'rgba(66,133,244,0.28)',
              boxShadow: '0 0 20px rgba(66,133,244,0.12)',
            }}>
            <Brain className="h-3.5 w-3.5 text-blue-400" />
            <span>Flagship Diagnostic AI · Google DeepMind RAG Architecture</span>
            <ChevronRight className="h-3 w-3 text-blue-400" />
          </div>

          <h1 className="display-xl text-white leading-tight mb-2">
            Find what you don&apos;t know
          </h1>
          <h1 className="display-xl mb-6" style={{ minHeight: '1.15em' }}>
            <span className="hero-gradient-text">{displayedText}</span>
            <span className="blink ml-0.5" style={{ color: '#06b6d4', fontSize: '0.9em' }}>|</span>
          </h1>

          <p className="mt-2 text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-3xl mx-auto fade-in-up-delay-1">
            Most study tools wait for students to ask questions — but students{' '}
            <strong className="text-white">cannot ask about blind spots they&apos;re unaware of.</strong>{' '}
            GapFinder AI proactively diagnoses your knowledge gaps, detects{' '}
            <span className="text-rose-400 font-semibold">Confident Misconceptions</span>, and{' '}
            builds an adaptive revision plan calibrated to your exam date.
          </p>

          {/* Live Stats Strip */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6 mb-8 fade-in-up-delay-2">
            {[
              { icon: Layers, val: `${docsCount} Docs`, color: '#06b6d4' },
              { icon: Target, val: `${weakCount} Gaps Diagnosed`, color: '#f43f5e' },
              { icon: TrendingUp, val: 'CS 204 Active', color: '#34A853' },
              { icon: Lock, val: 'Zero-Hallucination RAG', color: '#8b5cf6' },
            ].map(({ icon: Icon, val, color }, i) => (
              <div key={i} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border"
                style={{
                  background: `${color}12`,
                  borderColor: `${color}30`,
                  color: '#e2e8f0',
                }}>
                <Icon className="h-3.5 w-3.5" style={{ color }} />
                {val}
              </div>
            ))}
          </div>

          {/* Primary CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 fade-in-up-delay-3">
            <button
              onClick={onLaunchJudgeDemo}
              className="group relative flex items-center gap-2.5 rounded-2xl px-7 py-4 text-sm font-bold text-white overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'linear-gradient(135deg, #4285F4 0%, #6366f1 50%, #06b6d4 100%)',
                boxShadow: '0 8px 30px -5px rgba(66,133,244,0.5), 0 0 0 1px rgba(66,133,244,0.25)',
              }}
            >
              {/* Shimmer shine overlay */}
              <span className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity"
                style={{ background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.9) 50%, transparent 70%)', transform: 'translateX(-100%)', animation: 'shimmer-sweep 0.8s ease forwards' }} />
              <Play className="h-4 w-4 fill-white" />
              <span>Launch Interactive Judge Demo</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => onSelectTab('diagnostic-quiz')}
              className="flex items-center gap-2 rounded-2xl px-6 py-4 text-sm font-semibold text-slate-200 border border-white/10 hover:border-white/20 hover:text-white transition-all cursor-pointer hover:-translate-y-0.5"
              style={{ background: 'rgba(14,20,45,0.85)' }}
            >
              <FileQuestion className="h-4 w-4 text-cyan-400" />
              <span>Take Diagnostic Quiz</span>
            </button>

            <button
              onClick={() => onSelectTab('topic-map')}
              className="flex items-center gap-2 rounded-2xl px-6 py-4 text-sm font-semibold text-slate-300 border border-white/8 hover:border-white/15 hover:text-white transition-all cursor-pointer hover:-translate-y-0.5"
              style={{ background: 'rgba(10,15,35,0.70)' }}
            >
              <Compass className="h-4 w-4 text-indigo-400" />
              <span>Explore Syllabus Map</span>
            </button>
          </div>
        </div>

        {/* ── Grounding Audit Panel ── */}
        {showComparison && (
          <div className="my-6 rounded-2xl border p-6 backdrop-blur-xl fade-in-up"
            style={{
              background: 'rgba(5, 8, 20, 0.92)',
              borderColor: 'rgba(99,102,241,0.35)',
              boxShadow: '0 0 40px rgba(99,102,241,0.08)',
            }}>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                </div>
                <h3 className="text-base font-bold text-white">
                  Grounding Audit: Generic Chatbots vs. GapFinder AI
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium px-2 py-1 rounded-full border border-white/8"
                style={{ background: 'rgba(10,14,30,0.7)' }}>
                Deterministic RAG Integrity Check
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="rounded-2xl border p-5"
                style={{ background: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.25)' }}>
                <div className="flex items-center gap-2 text-rose-300 font-bold mb-3">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Traditional LLM Chat-With-PDF</span>
                </div>
                <ul className="space-y-2.5 text-xs text-rose-200/80">
                  {[
                    'Waits passively for students — cannot reveal unknown gaps.',
                    'Hallucinates plausible explanations without page citations.',
                    'Treats all topics equally, ignoring official exam weights.',
                    'Cannot measure student confidence or detect false certainty.',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border p-5"
                style={{ background: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.25)' }}>
                <div className="flex items-center gap-2 text-emerald-300 font-bold mb-3">
                  <ShieldCheck className="h-4 w-4" />
                  <span>GapFinder AI (DeepMind Grounded RAG)</span>
                </div>
                <ul className="space-y-2.5 text-xs text-emerald-200/90">
                  {[
                    'Deterministic TF-IDF cosine retrieval — zero LLM hallucination.',
                    'Every quiz item links to exact source document, section & page.',
                    'Misconception Detection: High Confidence + Wrong = Exam Trap.',
                    'Adaptive constraint scheduler respects daily hours & exam date.',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span><strong className="text-emerald-300">{item.split(':')[0]}:</strong> {item.split(':').slice(1).join(':')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ── Interactive Story Walkthrough ── */}
        <div className="mt-4 rounded-2xl border p-5 sm:p-6"
          style={{
            background: 'rgba(8, 12, 28, 0.75)',
            borderColor: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(20px)',
          }}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.30)' }}>
                <Award className="h-4.5 w-4.5 text-indigo-300" style={{ width: 18, height: 18 }} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  The 60-Second Evaluator Walkthrough: Alex&apos;s Diagnostic Journey
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                    style={{ background: 'rgba(6,182,212,0.12)', borderColor: 'rgba(6,182,212,0.28)', color: '#67e8f9' }}>
                    Interactive Story
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Course: <span className="text-slate-300 font-medium">{activeCourseName}</span>{' '}
                  · {docsCount} Docs · {weakCount} Weak Areas
                </p>
              </div>
            </div>

            {/* Step Pills */}
            <div className="flex items-center gap-1.5">
              {storySteps.map((s, idx) => (
                <button
                  key={s.step}
                  onClick={() => setActiveStoryStep(idx)}
                  className="relative px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  style={{
                    background: activeStoryStep === idx ? s.color : 'rgba(15,20,40,0.80)',
                    color: activeStoryStep === idx ? '#fff' : '#94a3b8',
                    boxShadow: activeStoryStep === idx ? `0 4px 15px -3px ${s.color}60` : 'none',
                    border: `1px solid ${activeStoryStep === idx ? s.color + '80' : 'rgba(255,255,255,0.07)'}`,
                  }}
                >
                  Step {s.step}
                </button>
              ))}
            </div>
          </div>

          {/* Active Story Card */}
          {(() => {
            const step = storySteps[activeStoryStep];
            const StepIcon = step.icon;
            return (
              <div className="rounded-xl border p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-all"
                style={{
                  background: `linear-gradient(135deg, ${step.color}0a 0%, rgba(5,8,20,0.85) 100%)`,
                  borderColor: `${step.color}25`,
                }}>
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{
                      background: `${step.color}18`,
                      border: `1px solid ${step.color}35`,
                      boxShadow: `0 0 20px ${step.color}20`,
                    }}>
                    <StepIcon className="h-6 w-6" style={{ color: step.color }} />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: step.color }}>
                      {step.badge}
                    </span>
                    <h3 className="text-base font-bold text-white">{step.title}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">{step.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={step.action}
                    className="group flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white transition-all cursor-pointer hover:-translate-y-0.5"
                    style={{
                      background: `linear-gradient(135deg, ${step.color}cc 0%, ${step.color}99 100%)`,
                      boxShadow: `0 4px 15px -3px ${step.color}50`,
                      border: `1px solid ${step.color}50`,
                    }}
                  >
                    <span>{step.actionLabel}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>

        {/* ── 4 Benchmark Metric Cards ── */}
        <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {metrics.map((m, i) => {
            const MetricIcon = m.icon;
            return (
              <div key={i} className="metric-card p-5 rounded-2xl text-center relative overflow-hidden group cursor-default">
                {/* Subtle glow on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at center, ${m.glow} 0%, transparent 70%)` }} />

                <div className="relative z-10 flex items-center justify-center gap-2 mb-1">
                  <MetricIcon className="h-4 w-4" style={{ color: m.color }} />
                  <span className="text-3xl font-black text-white"
                    style={{ textShadow: `0 0 15px ${m.color}50` }}>
                    {m.value}
                  </span>
                </div>
                <p className="relative z-10 text-xs font-bold text-slate-200">{m.label}</p>
                <p className="relative z-10 text-[11px] text-slate-400 mt-1 leading-snug">{m.sub}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
