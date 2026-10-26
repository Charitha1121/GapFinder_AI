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
import { CourseSettingsModal } from '@/components/CourseSettingsModal';

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
import { chunkDocument, searchChunks } from '@/lib/ragEngine';
import { buildGroundedQuestions, extractTopicsAndQuestionsFromDoc, inferCourseNameFromSyllabus } from '@/lib/collegeIngestion';
import { Pencil, Sparkles } from 'lucide-react';

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
  const [showCourseSettings, setShowCourseSettings] = useState(false);
  // Active quiz filter (if targeted topic selected)
  const [activeQuizTopicId, setActiveQuizTopicId] = useState<string | null>(null);
  const [explainInitialQuery, setExplainInitialQuery] = useState<string>('');

  // Load state on client mount
  useEffect(() => {
    const state = loadInitialState();
    let loadedUser = state.user;
    let loadedChunks = [...state.chunks];
    const loadedTopics = [...state.topics];
    const loadedQuestions = [...state.questions];

    const savedSyllabus = state.documents.find((document) => document.type === 'syllabus');
    if (state.user.role === 'student' && state.user.courseName.startsWith('CS 204:') && savedSyllabus) {
      loadedUser = {
        ...state.user,
        courseName: inferCourseNameFromSyllabus(savedSyllabus),
      };
    }

    if (state.user.role === 'student') {
      state.documents.forEach((document) => {
        let documentChunks = loadedChunks.filter((chunk) => chunk.docId === document.id);
        if (documentChunks.length === 0) {
          documentChunks = chunkDocument(document);
          loadedChunks = [...loadedChunks, ...documentChunks];
        }

        const extracted = extractTopicsAndQuestionsFromDoc(document, documentChunks);
        extracted.newTopics.forEach((topic) => {
          if (!loadedTopics.some((existingTopic) => existingTopic.id === topic.id)) {
            loadedTopics.push(topic);
          }

          const existingQuestionCount = loadedQuestions.filter((question) => question.topicId === topic.id).length;
          if (existingQuestionCount < 5) {
            const topicQuestions = extracted.newQuestions.filter((question) => question.topicId === topic.id);
            loadedQuestions.push(...topicQuestions.slice(0, 5 - existingQuestionCount));
          }
        });
      });
    }

    loadedTopics.forEach((topic) => {
      const existingQuestions = loadedQuestions.filter((question) => question.topicId === topic.id);
      if (existingQuestions.length >= 5) return;

      const citedDocTitle = existingQuestions[0]?.citation.docTitle;
      const candidateChunks = citedDocTitle
        ? loadedChunks.filter((chunk) => chunk.docTitle === citedDocTitle)
        : loadedChunks;
      const matchingChunks = searchChunks(
        `${topic.name} ${topic.unitName}`,
        candidateChunks,
        5,
        0.01
      ).map((match) => match.chunk);
      const sourceDoc = state.documents.find((document) => document.title === matchingChunks[0]?.docTitle);
      if (!sourceDoc || matchingChunks.length === 0) return;

      const generatedQuestions = buildGroundedQuestions(sourceDoc, topic, matchingChunks);
      const existingQuestionIds = new Set(loadedQuestions.map((question) => question.id));
      loadedQuestions.push(
        ...generatedQuestions
          .filter((question) => !existingQuestionIds.has(question.id))
          .slice(0, 5 - existingQuestions.length)
      );
    });

    React.startTransition(() => {
      setUser(loadedUser);
      setDocuments(state.documents);
      setChunks(loadedChunks);
      setTopics(loadedTopics);
      setQuestions(loadedQuestions);
      setGapReport(state.gapReport);
      setRevisionPlan(state.revisionPlan);
      setHistory(state.history);
      setGeminiApiKey(state.geminiApiKey);
      setIsLoaded(true);
    });
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
    const extracted = extractTopicsAndQuestionsFromDoc(newDoc, newChunks);
    setDocuments((prev) => [newDoc, ...prev]);
    setChunks((prev) => [...newChunks, ...prev]);
    setTopics((prev) => [...prev, ...extracted.newTopics]);
    setQuestions((prev) => [...prev, ...extracted.newQuestions]);
    if (newDoc.type === 'syllabus') {
      setUser((prev) => ({ ...prev, courseName: inferCourseNameFromSyllabus(newDoc) }));
    }
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
            Preparing your iGebra workspace...
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-7 sm:py-9 flex-1 w-full">
        <section className="dashboard-intro mb-7 rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-7">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-emerald-400 mb-2">Your learning workspace</p>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-50">
                Make your next study session count.
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                Find the topics that need attention, then build a study plan around your exam.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab('diagnostic-quiz')}
                className="btn-primary px-4 py-2.5 text-sm font-semibold rounded-lg cursor-pointer"
              >
                Start a diagnostic
              </button>
              <button
                onClick={() => setActiveTab('materials')}
                className="px-4 py-2.5 text-sm font-semibold rounded-lg border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 transition cursor-pointer"
              >
                Manage materials
              </button>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-px overflow-hidden rounded-lg border border-slate-800 bg-slate-800">
            <div className="bg-slate-950/60 px-4 py-3.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-slate-500">Active course</p>
                <button
                  aria-label="Edit active course"
                  className="rounded p-1 text-slate-500 transition hover:bg-slate-800 hover:text-emerald-300"
                  onClick={() => setShowCourseSettings(true)}
                  title="Edit active course"
                  type="button"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-100 truncate" title={user.courseName}>{user.courseName}</p>
            </div>
            <div className="bg-slate-950/60 px-4 py-3.5">
              <p className="text-xs text-slate-500">Study materials</p>
              <p className="mt-1 text-sm font-semibold text-slate-100">{documents.length} uploaded</p>
            </div>
            <div className="bg-slate-950/60 px-4 py-3.5">
              <p className="text-xs text-slate-500">Topics to revisit</p>
              <p className="mt-1 text-sm font-semibold text-slate-100">{weakCount} identified</p>
            </div>
          </div>
        </section>

        <div className="mb-5 flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-semibold text-slate-100">Study overview</h2>
            <p className="mt-0.5 text-xs text-slate-500">Choose a topic or continue with a focused activity.</p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-2 text-xs font-medium text-slate-400 capitalize">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {activeTab.replace('-', ' ')}
          </span>
        </div>

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
      <footer className="border-t border-slate-800 bg-slate-950/70 py-6 px-4 text-xs text-slate-400 text-center space-y-3">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-200">
            <span className="font-semibold">iGebra</span>
          </div>
          <span className="text-slate-700 hidden sm:inline">&bull;</span>
          <span className="text-slate-500 font-medium">Personalized study workspace</span>
        </div>

        <div className="flex items-center justify-center gap-4 flex-wrap text-slate-400">
          <button
            onClick={() => setShowArchModal(true)}
            className="hover:text-emerald-300 transition cursor-pointer"
          >
            AI Architecture &amp; RAG Pipeline
          </button>
          <span className="text-slate-700">&bull;</span>
          <button
            onClick={() => setShowAuthModal(true)}
            className="hover:text-emerald-300 transition cursor-pointer"
          >
            Judge Demo Profiles
          </button>
          <span className="text-slate-700">&bull;</span>
          <button
            onClick={() => setShowApiKeyModal(true)}
            className="hover:text-emerald-300 transition cursor-pointer"
          >
            Google Gemini API Key
          </button>
          <span className="text-slate-700">&bull;</span>
          <button
            onClick={() => {
              setActiveTab('diagnostic-quiz');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-emerald-300 transition cursor-pointer text-emerald-400"
          >
            Take Diagnostic Drill &rarr;
          </button>
        </div>

        <p className="text-[11px] text-slate-500 max-w-2xl mx-auto">
          Grounded explanations from your course materials, with study recommendations shaped by diagnostic results.
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

      <CourseSettingsModal
        isOpen={showCourseSettings}
        courseName={user.courseName}
        onClose={() => setShowCourseSettings(false)}
        onSave={(courseName) => setUser((prev) => ({ ...prev, courseName }))}
      />
    </div>
  );
}
