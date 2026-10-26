import {
  DocumentSource,
  Topic,
  Question,
  GapReport,
  RevisionPlan,
  ProgressHistoryEntry,
  UserProfile,
  DocumentChunk,
} from '@/types';
import {
  DEMO_USER,
  FRESH_STUDENT,
  SAMPLE_DOCUMENTS,
  SAMPLE_TOPICS,
  SAMPLE_QUESTIONS,
  INITIAL_PRELOADED_GAP_REPORT,
  INITIAL_REVISION_PLAN,
  SAMPLE_PROGRESS_HISTORY,
} from './sampleData';
import { chunkDocument } from './ragEngine';

const STORAGE_KEYS = {
  USER: 'gapfinder_user',
  DOCUMENTS: 'gapfinder_docs',
  CHUNKS: 'gapfinder_chunks',
  TOPICS: 'gapfinder_topics',
  QUESTIONS: 'gapfinder_questions',
  GAP_REPORT: 'gapfinder_gap_report',
  REVISION_PLAN: 'gapfinder_revision_plan',
  HISTORY: 'gapfinder_history',
  GEMINI_KEY: 'gapfinder_gemini_key',
};

export interface AppState {
  user: UserProfile;
  documents: DocumentSource[];
  chunks: DocumentChunk[];
  topics: Topic[];
  questions: Question[];
  gapReport: GapReport | null;
  revisionPlan: RevisionPlan | null;
  history: ProgressHistoryEntry[];
  geminiApiKey: string;
}

export function loadInitialState(): AppState {
  if (typeof window === 'undefined') {
    return getPreloadedState();
  }

  try {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (!savedUser) {
      // First time loading - initialize with preloaded rich judge demo state
      const initial = getPreloadedState();
      saveState(initial);
      return initial;
    }

    const user = JSON.parse(savedUser);
    const docsStr = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    const documents: DocumentSource[] = docsStr ? JSON.parse(docsStr) : SAMPLE_DOCUMENTS;

    const chunksStr = localStorage.getItem(STORAGE_KEYS.CHUNKS);
    let chunks: DocumentChunk[] = chunksStr ? JSON.parse(chunksStr) : [];
    if (chunks.length === 0) {
      chunks = documents.flatMap((d) => chunkDocument(d));
    }

    const topicsStr = localStorage.getItem(STORAGE_KEYS.TOPICS);
    const topics: Topic[] = topicsStr ? JSON.parse(topicsStr) : SAMPLE_TOPICS;

    const questionsStr = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    const questions: Question[] = questionsStr ? JSON.parse(questionsStr) : SAMPLE_QUESTIONS;

    const gapReportStr = localStorage.getItem(STORAGE_KEYS.GAP_REPORT);
    const gapReport: GapReport | null = gapReportStr ? JSON.parse(gapReportStr) : INITIAL_PRELOADED_GAP_REPORT;

    const planStr = localStorage.getItem(STORAGE_KEYS.REVISION_PLAN);
    const revisionPlan: RevisionPlan | null = planStr ? JSON.parse(planStr) : INITIAL_REVISION_PLAN;

    const historyStr = localStorage.getItem(STORAGE_KEYS.HISTORY);
    const history: ProgressHistoryEntry[] = historyStr ? JSON.parse(historyStr) : SAMPLE_PROGRESS_HISTORY;

    const geminiApiKey = localStorage.getItem(STORAGE_KEYS.GEMINI_KEY) || '';

    return {
      user,
      documents,
      chunks,
      topics,
      questions,
      gapReport,
      revisionPlan,
      history,
      geminiApiKey,
    };
  } catch (e) {
    console.error('Error loading state from localStorage:', e);
    return getPreloadedState();
  }
}

export function saveState(state: Partial<AppState>): void {
  if (typeof window === 'undefined') return;

  try {
    if (state.user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(state.user));
    if (state.documents) localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(state.documents));
    if (state.chunks) localStorage.setItem(STORAGE_KEYS.CHUNKS, JSON.stringify(state.chunks));
    if (state.topics) localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(state.topics));
    if (state.questions) localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(state.questions));
    if (state.gapReport) localStorage.setItem(STORAGE_KEYS.GAP_REPORT, JSON.stringify(state.gapReport));
    if (state.revisionPlan) localStorage.setItem(STORAGE_KEYS.REVISION_PLAN, JSON.stringify(state.revisionPlan));
    if (state.history) localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(state.history));
    if (state.geminiApiKey !== undefined) localStorage.setItem(STORAGE_KEYS.GEMINI_KEY, state.geminiApiKey);
  } catch (e) {
    console.error('Error saving state to localStorage:', e);
  }
}

export function getPreloadedState(): AppState {
  const documents = SAMPLE_DOCUMENTS;
  const chunks = documents.flatMap((d) => chunkDocument(d));
  return {
    user: DEMO_USER,
    documents,
    chunks,
    topics: SAMPLE_TOPICS,
    questions: SAMPLE_QUESTIONS,
    gapReport: INITIAL_PRELOADED_GAP_REPORT,
    revisionPlan: INITIAL_REVISION_PLAN,
    history: SAMPLE_PROGRESS_HISTORY,
    geminiApiKey: '',
  };
}

export function getFreshStudentState(): AppState {
  return {
    user: FRESH_STUDENT,
    documents: [],
    chunks: [],
    topics: [],
    questions: [],
    gapReport: null,
    revisionPlan: null,
    history: [],
    geminiApiKey: '',
  };
}

export function resetToDemoJudge(): AppState {
  const demo = getPreloadedState();
  saveState(demo);
  return demo;
}

export function resetToFreshStudent(): AppState {
  const fresh = getFreshStudentState();
  saveState(fresh);
  return fresh;
}
