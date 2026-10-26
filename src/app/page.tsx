'use client';

import React, { useState, useEffect } from 'react';
import {
  Navbar,
  ActiveTab,
} from '@/components/Navbar';
import { TopicMap } from '@/components/TopicMap';
import { DiagnosticQuiz } from '@/components/DiagnosticQuiz';
import { GapReportView } from '@/components/GapReportView';
import { RevisionPlanView } from '@/components/RevisionPlanView';
import { ExplainAssistant } from '@/components/ExplainAssistant';
import { ProgressDashboard } from '@/components/ProgressDashboard';
import { MaterialsView } from '@/components/MaterialsView';
import { ArchitectureModal } from '@/components/ArchitectureModal';
import { AuthModal } from '@/components/AuthModal';
import { ApiKeyModal } from '@/components/ApiKeyModal';

import {
  Topic,
  Question,
  QuizSubmission,
  GapReport,
  RevisionPlan,
  ProgressHistoryEntry,
  UserProfile,
  DocumentSource,
  DocumentChunk,
} from '@/types';
import {
  loadInitialState,
  saveState,
  resetToDemoJudge,
  resetToFreshStudent,
} from '@/lib/storage';
import { analyzeDiagnosticQuiz } from '@/lib/gapEngine';
import { generateAdaptiveRevisionPlan } from '@/lib/planEngine';
import { chunkDocument } from '@/lib/ragEngine';
import {
  Compass,
  FileQuestion,
  Target,
  CalendarDays,
  MessageSquareCode,
  LineChart,
  FolderArchive,
  GraduationCap,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('topic-map');

  // Application State
  const [user, setUser] = useState<UserProfile>(loadInitialState().user);
  const [documents, setDocuments] = useState<DocumentSource[]>([]);
  const [chunks, setChunks] = useState<DocumentChunk[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [gapReport, setGapReport] = useState<GapReport | null>(null);
  const [revisionPlan, setRevisionPlan] = useState<RevisionPlan | null>(null);
  const [history, setHistory] = useState<ProgressHistoryEntry[]>([]);
  const [geminiApiKey, setGeminiApiKey] = useState<string>('');

  // Modals state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showArchModal, setShowArchModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  // Active quiz filter (if targeted topic selected)
  const [activeQuizTopicId, setActiveQuizTopicId] = useState<string | null>(null);
  const [explainInitialQuery, setExplainInitialQuery] = useState<string>('');

  // Load state on client mount
  useEffect(() => {
    const state = loadInitialState();
    setUser(state.user);
    setDocuments(state.documents);
    setChunks(state.chunks);
    setTopics(state.topics);
    setQuestions(state.questions);
    setGapReport(state.gapReport);
    setRevisionPlan(state.revisionPlan);
    setHistory(state.history);
    setGeminiApiKey(state.geminiApiKey);
    setIsLoaded(true);
  }, []);

  // Save changes to storage
  useEffect(() => {
    if (!isLoaded) return;
    saveState({
      user,
      documents,
      chunks,
      topics,
      questions,
      gapReport,
      revisionPlan,
      history,
      geminiApiKey,
    });
  }, [
    isLoaded,
    user,
    documents,
    chunks,
    topics,
    questions,
    gapReport,
    revisionPlan,
    history,
    geminiApiKey,
  ]);

  // Quiz questions filtered by active topic if targeted
  const activeQuizQuestions = activeQuizTopicId
    ? questions.filter((q) => q.topicId === activeQuizTopicId)
    : questions;

  const activeTopic = topics.find((t) => t.id === activeQuizTopicId);

  // Handlers
  const handleStartQuiz = (topicId?: string) => {
    if (topicId) {
      setActiveQuizTopicId(topicId);
    } else {
      setActiveQuizTopicId(null);
    }
    setActiveTab('diagnostic-quiz');
  };

  const handleExplainTopic = (topicName: string) => {
    setExplainInitialQuery(`Explain the key concepts, invariants and exam pitfalls for: ${topicName}`);
    setActiveTab('explain-assistant');
  };

  const handleCompleteQuiz = (submissions: Record<string, QuizSubmission>) => {
    // 1. Run Diagnostic Gap Engine
    const { report, updatedTopics } = analyzeDiagnosticQuiz(activeQuizQuestions, submissions, topics);

    // 2. Generate Adaptive Revision Plan
    const newPlan = generateAdaptiveRevisionPlan(
      report,
      user.dailyStudyHours || 2.5,
      revisionPlan?.daysRemaining || 7
    );

    // 3. Update Progress History
    const newHistoryEntry: ProgressHistoryEntry = {
      attemptNumber: history.length + 1,
      date: new Date().toISOString().split('T')[0],
      overallScore: report.overallScore,
      weakCount: report.weakTopics.length,
      mediumCount: report.mediumTopics.length,
      strongCount: report.strongTopics.length,
      notes: activeQuizTopicId
        ? `Targeted drill on "${activeTopic?.name || 'Topic'}" completed.`
        : `Full diagnostic quiz attempt #${history.length + 1} completed.`,
    };

    setTopics(updatedTopics);
    setGapReport(report);
    setRevisionPlan(newPlan);
    setHistory((prev) => [...prev, newHistoryEntry]);
    setActiveQuizTopicId(null);

    // Navigate to Gap Report
    setActiveTab('gap-report');
  };

  const handleUpdatePlanHours = (hours: number, days: number) => {
    if (!gapReport) return;
    const updatedPlan = generateAdaptiveRevisionPlan(gapReport, hours, days);
    setRevisionPlan(updatedPlan);
    setUser((prev) => ({ ...prev, dailyStudyHours: hours }));
  };

  const handleToggleTaskComplete = (taskId: string) => {
    if (!revisionPlan) return;

    let targetTopicId = '';
    const updatedDays = revisionPlan.days.map((day) => {
      const updatedTasks = day.tasks.map((task) => {
        if (task.id === taskId) {
          targetTopicId = task.topicId;
          return { ...task, completed: !task.completed };
        }
        return task;
      });
      return { ...day, tasks: updatedTasks };
    });

    setRevisionPlan({
      ...revisionPlan,
      days: updatedDays,
      lastUpdated: new Date().toLocaleString(),
    });

    // Check if tasks for a weak topic are now done, grant mastery boost!
    if (targetTopicId && targetTopicId !== 'all') {
      const allTopicTasks = updatedDays.flatMap((d) => d.tasks).filter((t) => t.topicId === targetTopicId);
      const isAllDone = allTopicTasks.length > 0 && allTopicTasks.every((t) => t.completed);

      if (isAllDone) {
        setTopics((prev) =>
          prev.map((t) => {
            if (t.id === targetTopicId && t.status === 'weak') {
              return { ...t, status: 'medium', masteryScore: Math.min(72, t.masteryScore + 30) };
            }
            return t;
          })
        );
      }
    }
  };

  const handleSimulateImprovement = () => {
    // Elevate first weak topic to strong
    const weakTopic = topics.find((t) => t.status === 'weak');
    if (!weakTopic && topics.length > 0) return;

    const targetTopic = weakTopic || topics[0];
    const updatedTopics = topics.map((t) => {
      if (t.id === targetTopic.id) {
        return {
          ...t,
          status: 'strong' as const,
          masteryScore: 88,
        };
      }
      return t;
    });

    setTopics(updatedTopics);

    // Re-evaluate gap report & revision plan
    if (gapReport) {
      const newWeak = gapReport.weakTopics.filter((w) => w.topicId !== targetTopic.id);
      const updatedReport: GapReport = {
        ...gapReport,
        overallScore: Math.min(95, gapReport.overallScore + 14),
        examRiskLevel: newWeak.length === 0 ? 'Low' : 'Moderate',
        weakTopics: newWeak,
        strongTopics: [
          ...gapReport.strongTopics,
          {
            topicId: targetTopic.id,
            topicName: targetTopic.name,
            unitName: targetTopic.unitName,
            masteryScore: 88,
            status: 'strong',
            reason: 'Simulated post-revision diagnostic confirmed 88% retention.',
            missedConcepts: [],
            recommendedFocus: 'Maintain retention with periodic active recall.',
            examWeight: targetTopic.examWeight,
            citations: [],
          },
        ],
      };
      setGapReport(updatedReport);

      const newPlan = generateAdaptiveRevisionPlan(
        updatedReport,
        user.dailyStudyHours || 2.5,
        revisionPlan?.daysRemaining || 7
      );
      setRevisionPlan(newPlan);

      const entry: ProgressHistoryEntry = {
        attemptNumber: history.length + 1,
        date: new Date().toISOString().split('T')[0],
        overallScore: updatedReport.overallScore,
        weakCount: newWeak.length,
        mediumCount: updatedReport.mediumTopics.length,
        strongCount: updatedReport.strongTopics.length,
        notes: `Simulated mastery boost on "${targetTopic.name}" (+14% score delta).`,
      };
      setHistory((prev) => [...prev, entry]);
    }
  };

  const handleAddDocument = (newDoc: DocumentSource) => {
    const newChunks = chunkDocument(newDoc);
    setDocuments((prev) => [newDoc, ...prev]);
    setChunks((prev) => [...newChunks, ...prev]);
  };

  const handleRemoveDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    setChunks((prev) => prev.filter((c) => c.docId !== docId));
  };

  const handleResetToJudgeDemo = () => {
    const state = resetToDemoJudge();
    setUser(state.user);
    setDocuments(state.documents);
    setChunks(state.chunks);
    setTopics(state.topics);
    setQuestions(state.questions);
    setGapReport(state.gapReport);
    setRevisionPlan(state.revisionPlan);
    setHistory(state.history);
    setActiveQuizTopicId(null);
    setActiveTab('topic-map');
  };

  const handleResetToFreshStudent = () => {
    const state = resetToFreshStudent();
    setUser(state.user);
    setDocuments(state.documents);
    setChunks(state.chunks);
    setTopics(state.topics);
    setQuestions(state.questions);
    setGapReport(state.gapReport);
    setRevisionPlan(state.revisionPlan);
    setHistory(state.history);
    setActiveQuizTopicId(null);
    setActiveTab('materials');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-indigo-400 animate-spin" />
          <span className="text-sm font-semibold text-slate-200">
            Initializing GapFinder AI Knowledge Store...
          </span>
        </div>
      </div>
    );
  }

  const weakCount = topics.filter((t) => t.status === 'weak').length;

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Top Sticky Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        weakCount={weakCount}
        docsCount={documents.length}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenArchitecture={() => setShowArchModal(true)}
        onOpenApiKey={() => setShowApiKeyModal(true)}
        hasApiKey={!!geminiApiKey}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 w-full">
        {activeTab === 'topic-map' && (
          <TopicMap
            topics={topics}
            onStartQuiz={handleStartQuiz}
            onExplainTopic={handleExplainTopic}
            onUploadClick={() => setActiveTab('materials')}
          />
        )}

        {activeTab === 'diagnostic-quiz' && (
          <DiagnosticQuiz
            questions={activeQuizQuestions}
            onCompleteQuiz={handleCompleteQuiz}
            selectedTopicName={activeTopic?.name}
            onResetToAll={() => setActiveQuizTopicId(null)}
          />
        )}

        {activeTab === 'gap-report' && gapReport && (
          <GapReportView
            gapReport={gapReport}
            onNavigateToPlan={() => setActiveTab('revision-plan')}
            onRetakeQuiz={() => handleStartQuiz()}
            onExplainTopic={handleExplainTopic}
          />
        )}

        {activeTab === 'revision-plan' && (
          <RevisionPlanView
            plan={revisionPlan}
            onUpdatePlanHours={handleUpdatePlanHours}
            onToggleTaskComplete={handleToggleTaskComplete}
            onExplainTopic={handleExplainTopic}
          />
        )}

        {activeTab === 'explain-assistant' && (
          <ExplainAssistant
            chunks={chunks}
            geminiApiKey={geminiApiKey}
            initialQuery={explainInitialQuery}
          />
        )}

        {activeTab === 'progress-dashboard' && (
          <ProgressDashboard
            history={history}
            topics={topics}
            onSimulateImprovement={handleSimulateImprovement}
            onRetakeQuiz={() => handleStartQuiz()}
          />
        )}

        {activeTab === 'materials' && (
          <MaterialsView
            documents={documents}
            chunks={chunks}
            onAddDocument={handleAddDocument}
            onRemoveDocument={handleRemoveDocument}
            onReloadSample={handleResetToJudgeDemo}
          />
        )}
      </main>

      {/* Global Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 px-4 text-xs text-slate-500 text-center space-y-2">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <strong>GapFinder AI</strong> — Precision Diagnostic Study &amp; Adaptive Revision
          </span>
          <span className="text-slate-700">•</span>
          <button
            onClick={() => setShowArchModal(true)}
            className="hover:text-indigo-400 transition cursor-pointer"
          >
            AI Architecture Overview
          </button>
          <span className="text-slate-700">•</span>
          <button
            onClick={() => setShowAuthModal(true)}
            className="hover:text-indigo-400 transition cursor-pointer"
          >
            Demo Credentials &amp; Profiles
          </button>
        </div>
        <p className="text-[11px] text-slate-600">
          Strict Retrieval-Augmented Generation • Zero-Hallucination Question Grounding • Personalized Spaced Revision Plans
        </p>
      </footer>

      {/* Architecture Inspector Modal */}
      <ArchitectureModal
        isOpen={showArchModal}
        onClose={() => setShowArchModal(false)}
      />

      {/* Authentication / Demo Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        currentUser={user}
        onSelectJudgeMode={handleResetToJudgeDemo}
        onSelectStudentMode={handleResetToFreshStudent}
        onCustomLogin={(newUser) => setUser(newUser)}
      />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        currentKey={geminiApiKey}
        onSaveKey={(key) => setGeminiApiKey(key)}
      />
    </div>
  );
}
