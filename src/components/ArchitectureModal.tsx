'use client';

import React from 'react';
import {
  Layers,
  X,
  Database,
  Search,
  Sparkles,
  Target,
  CalendarDays,
  ShieldCheck,
} from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-indigo-500/40 p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Architecture &amp; RAG Pipeline</h2>
              <p className="text-xs text-slate-400">
                Separation of Retrieval, Grounded Generation &amp; Diagnostic Classification
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Core Architectural Distinction: Retrieval vs Generation */}
        <div className="p-5 rounded-xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-cyan-950/40 border border-indigo-500/30 space-y-3">
          <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Strict Separation: Retrieval vs. Generation</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Generic &quot;chat with your PDF&quot; apps feed raw user prompts to an LLM, leading to hallucinations and passive Q&amp;A.
            <strong> GapFinder AI strictly isolates retrieval from generation:</strong>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="font-bold text-cyan-400 block">1. The Retrieval Layer (Deterministic)</span>
              <p className="text-slate-400 leading-relaxed">
                Extracts chunks, computes term frequency vectors, normalizes length, and retrieves top-k matches with source metadata (Doc Title, Section, Page). The LLM is <em>never</em> used to search or guess what exists.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="font-bold text-indigo-400 block">2. The Generation Layer (Constrained)</span>
              <p className="text-slate-400 leading-relaxed">
                The generator operates under an immutable system prompt: synthesize answers and questions <em>only</em> from the retrieved passages. Every claim must cite <code className="text-indigo-300">[Source X §Section]</code>.
              </p>
            </div>
          </div>
        </div>

        {/* 5-Stage Pipeline Overview */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">
            End-to-End Diagnostic Pipeline
          </h3>

          <div className="space-y-3 text-xs">
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-indigo-300 font-bold">
                <span className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  Stage 1: Multi-Document Ingestion &amp; Semantic Chunking
                </span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                  Sliding Window + Section Boundaries
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Documents are categorized as <em>Syllabus</em>, <em>Textbook/Notes</em>, or <em>Past Exam Papers</em>. Regex section parsers identify chapters and sections, creating 400-word chunks with 80-word overlap, annotated with keywords and page estimates.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-indigo-300 font-bold">
                <span className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-cyan-400" />
                  Stage 2: Vector Embedding &amp; Cosine Retrieval
                </span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                  Top-k Semantic Matching
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Queries (diagnostic topics or student questions) are tokenized against the corpus IDF matrix. Chunks matching keywords and section titles receive similarity boosts. The top-k highest scoring chunks are assembled into a structured Grounding Context.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-indigo-300 font-bold">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Stage 3: Grounded Diagnostic Question Generation
                </span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                  Zero Generic Memory
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Diagnostic questions are generated directly from the student&apos;s retrieved notes and past exam papers. Every question carries a mandatory Citation badge linking to the source section, preventing abstract or out-of-syllabus questions.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-indigo-300 font-bold">
                <span className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-cyan-400" />
                  Stage 4: Diagnostic Evaluation &amp; Misconception Engine
                </span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                  Weak / Medium / Strong Matrix
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Student responses are mapped to syllabus topics. If score is &lt;50%, the topic is diagnosed as <strong>Weak</strong>; 50-75% is <strong>Medium</strong>; &gt;75% is <strong>Strong</strong>. If a student answers incorrectly with <em>High Confidence</em>, the system triggers a <strong>Confident Misconception Alert</strong>.
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-indigo-300 font-bold">
                <span className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-cyan-400" />
                  Stage 5: Adaptive Revision Plan Optimization
                </span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                  Constraint-Based Scheduling
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Takes student available hours and days until exam. Schedules weak topics weighted by syllabus exam impact first, assigning evidence-based study techniques: Chunk Review, Feynman Technique, and Past Paper Drills. Dynamically updates when tasks or re-tests are logged.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition cursor-pointer"
          >
            Close Architecture Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
