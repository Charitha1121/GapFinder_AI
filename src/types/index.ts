export type DocumentType = 'syllabus' | 'notes' | 'past_paper';

export interface DocumentSource {
  id: string;
  title: string;
  type: DocumentType;
  content: string;
  uploadedAt: string;
  fileSize: string;
  pageCount?: number;
  chunksCount?: number;
  description?: string;
}

export interface DocumentChunk {
  id: string;
  docId: string;
  docTitle: string;
  docType: DocumentType;
  section: string;
  page?: number;
  chunkIndex: number;
  text: string;
  keywords: string[];
}

export type MasteryStatus = 'unassessed' | 'weak' | 'medium' | 'strong';

export interface Topic {
  id: string;
  unitId: string;
  unitName: string;
  name: string;
  description: string;
  examWeight: number; // e.g. 25% weightage
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  status: MasteryStatus;
  masteryScore: number; // 0 to 100
  assessedQuestionsCount: number;
  citationsCount: number;
}

export interface Citation {
  docTitle: string;
  docType: DocumentType;
  section: string;
  pageSnippet: string;
  chunkId?: string;
  pageNumber?: number;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  topicId: string;
  topicName: string;
  unitName: string;
  type: 'mcq' | 'scenario' | 'code_analysis';
  difficulty: 'easy' | 'medium' | 'hard';
  prompt: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
  citation: Citation;
  pastPaperRef?: string;
}

export interface QuizSubmission {
  questionId: string;
  selectedOptionId: string;
  confidence: 'low' | 'medium' | 'high';
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface TopicDiagnosis {
  topicId: string;
  topicName: string;
  unitName: string;
  masteryScore: number;
  status: 'weak' | 'medium' | 'strong';
  reason: string;
  missedConcepts: string[];
  recommendedFocus: string;
  examWeight: number;
  citations: Citation[];
}

export interface ConfidentMisconception {
  questionPrompt: string;
  studentAnswer: string;
  correctAnswer: string;
  topicName: string;
  whyItMatters: string;
  citation: Citation;
}

export interface GapReport {
  id: string;
  overallScore: number;
  examRiskLevel: 'Low' | 'Moderate' | 'Critical';
  totalQuestions: number;
  correctCount: number;
  weakTopics: TopicDiagnosis[];
  mediumTopics: TopicDiagnosis[];
  strongTopics: TopicDiagnosis[];
  confidentMisconceptions: ConfidentMisconception[];
  summary: string;
  generatedAt: string;
}

export type StudyTechnique =
  | 'Active Recall'
  | 'Feynman Technique'
  | 'Past Paper Drill'
  | 'Concept Mapping'
  | 'Error Log Review'
  | 'Chunk Review';

export interface RevisionTask {
  id: string;
  topicId: string;
  topicName: string;
  unitName: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  studyTechnique: StudyTechnique;
  durationMinutes: number;
  completed: boolean;
  citation: {
    docTitle: string;
    section: string;
    docType?: DocumentType;
  };
}

export interface RevisionDay {
  dayNumber: number;
  dateStr: string;
  focusTheme: string;
  totalMinutes: number;
  tasks: RevisionTask[];
}

export interface RevisionPlan {
  id: string;
  title: string;
  targetExamDate: string;
  daysRemaining: number;
  dailyAvailableHours: number;
  totalHoursPlanned: number;
  days: RevisionDay[];
  generatedAt: string;
  lastUpdated: string;
}

export interface RetrievedChunkMatch {
  chunk: DocumentChunk;
  similarityScore: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  retrievedChunks?: RetrievedChunkMatch[];
  suggestedFollowUp?: string[];
  checkQuestion?: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface ProgressHistoryEntry {
  attemptNumber: number;
  date: string;
  overallScore: number;
  weakCount: number;
  mediumCount: number;
  strongCount: number;
  notes: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'judge';
  courseName: string;
  examDate: string;
  dailyStudyHours: number;
}
