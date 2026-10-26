import { Topic, Question, QuizSubmission, GapReport, TopicDiagnosis, ConfidentMisconception } from '@/types';

/**
 * Diagnostic Gap Analysis Engine
 * Evaluates student answers, identifies conceptual gaps, separates into Weak (<50%), Medium (50-75%), Strong (>75%)
 * and pinpoints Confident Misconceptions.
 */
export function analyzeDiagnosticQuiz(
  questions: Question[],
  submissions: Record<string, QuizSubmission>,
  topics: Topic[]
): {
  report: GapReport;
  updatedTopics: Topic[];
} {
  const answeredQuestionIds = Object.keys(submissions);
  const totalQuestions = answeredQuestionIds.length;
  let correctCount = 0;

  // Track per-topic performance
  const topicStats: Record<
    string,
    {
      topic: Topic;
      total: number;
      correct: number;
      incorrectQuestions: Question[];
      confidences: ('low' | 'medium' | 'high')[];
    }
  > = {};

  // Initialize stats for all topics
  for (const t of topics) {
    topicStats[t.id] = {
      topic: t,
      total: 0,
      correct: 0,
      incorrectQuestions: [],
      confidences: [],
    };
  }

  const confidentMisconceptions: ConfidentMisconception[] = [];

  for (const qId of answeredQuestionIds) {
    const sub = submissions[qId];
    const question = questions.find((q) => q.id === qId);
    if (!question) continue;

    if (sub.isCorrect) {
      correctCount++;
    }

    const tStat = topicStats[question.topicId];
    if (tStat) {
      tStat.total += 1;
      tStat.confidences.push(sub.confidence);

      if (sub.isCorrect) {
        tStat.correct += 1;
      } else {
        tStat.incorrectQuestions.push(question);

        // Check for Confident Misconception: student answered wrong with High confidence!
        if (sub.confidence === 'high') {
          const studentOpt = question.options.find((o) => o.id === sub.selectedOptionId);
          const correctOpt = question.options.find((o) => o.id === question.correctOptionId);

          confidentMisconceptions.push({
            questionPrompt: question.prompt,
            studentAnswer: studentOpt ? studentOpt.text : 'Selected incorrect choice',
            correctAnswer: correctOpt ? correctOpt.text : 'Correct choice',
            topicName: question.topicName,
            whyItMatters: `You selected this with HIGH confidence, but according to ${question.citation.docTitle} (${question.citation.section}), this is a common conceptual misconception that costs major marks in past exams.`,
            citation: question.citation,
          });
        }
      }
    }
  }

  const weakTopics: TopicDiagnosis[] = [];
  const mediumTopics: TopicDiagnosis[] = [];
  const strongTopics: TopicDiagnosis[] = [];

  const updatedTopics: Topic[] = topics.map((topic) => {
    const stat = topicStats[topic.id];
    let score = topic.masteryScore;
    let status = topic.status;

    if (stat && stat.total > 0) {
      score = Math.round((stat.correct / stat.total) * 100);
      if (score < 50) {
        status = 'weak';
      } else if (score < 75) {
        status = 'medium';
      } else {
        status = 'strong';
      }
    }

    const diagnosis: TopicDiagnosis = {
      topicId: topic.id,
      topicName: topic.name,
      unitName: topic.unitName,
      masteryScore: score,
      status: status === 'unassessed' ? 'weak' : status,
      examWeight: topic.examWeight,
      reason: generateDiagnosticReason(topic, stat, score, status),
      missedConcepts: stat && stat.incorrectQuestions.length > 0
        ? stat.incorrectQuestions.map((q) => q.explanation.substring(0, 110) + '...')
        : [],
      recommendedFocus: generateRecommendedFocus(topic, stat, status),
      citations: stat && stat.incorrectQuestions.length > 0
        ? stat.incorrectQuestions.map((q) => q.citation)
        : [],
    };

    if (status === 'weak' || status === 'unassessed') {
      weakTopics.push(diagnosis);
    } else if (status === 'medium') {
      mediumTopics.push(diagnosis);
    } else {
      strongTopics.push(diagnosis);
    }

    return {
      ...topic,
      status,
      masteryScore: score,
      assessedQuestionsCount: topic.assessedQuestionsCount + (stat ? stat.total : 0),
    };
  });

  const overallScore = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 65;

  // Calculate Weighted Exam Risk
  let weightedWeakScore = 0;
  for (const wt of weakTopics) {
    weightedWeakScore += wt.examWeight;
  }

  let examRiskLevel: 'Low' | 'Moderate' | 'Critical' = 'Low';
  if (weightedWeakScore >= 25 || overallScore < 55) {
    examRiskLevel = 'Critical';
  } else if (weightedWeakScore >= 12 || overallScore < 75) {
    examRiskLevel = 'Moderate';
  }

  const summary =
    weakTopics.length > 0
      ? `Identified ${weakTopics.length} high-priority gap topic${weakTopics.length > 1 ? 's' : ''} accounting for ${weightedWeakScore}% of exam weightage. Immediate targeted revision required.`
      : `Strong retention demonstrated across assessed units. Proceed with high-yield polish and time-trial questions.`;

  const report: GapReport = {
    id: `gap-rep-${Date.now()}`,
    overallScore,
    examRiskLevel,
    totalQuestions,
    correctCount,
    weakTopics,
    mediumTopics,
    strongTopics,
    confidentMisconceptions,
    summary,
    generatedAt: new Date().toLocaleString(),
  };

  return { report, updatedTopics };
}

function generateDiagnosticReason(
  topic: Topic,
  stat: { total: number; correct: number; incorrectQuestions: Question[]; confidences: string[] } | undefined,
  score: number,
  status: string
): string {
  if (!stat || stat.total === 0) {
    return 'Topic has not been evaluated in diagnostic quizzes yet. Prioritize an initial diagnostic check.';
  }

  if (status === 'weak') {
    return `Score of ${score}% (${stat.correct}/${stat.total} correct). Failed key diagnostic questions directly tied to core syllabus requirements. Demonstrates confusion in fundamental mechanisms.`;
  } else if (status === 'medium') {
    return `Score of ${score}% (${stat.correct}/${stat.total} correct). Demonstrated partial comprehension of main concept, but missed nuanced boundary conditions and edge cases.`;
  } else {
    return `Score of ${score}% (${stat.correct}/${stat.total} correct). Solid conceptual mastery demonstrated across tested questions with confident reasoning.`;
  }
}

function generateRecommendedFocus(
  topic: Topic,
  stat: { incorrectQuestions: Question[] } | undefined,
  status: string
): string {
  if (status === 'weak') {
    if (stat && stat.incorrectQuestions.length > 0) {
      const firstMissed = stat.incorrectQuestions[0];
      return `Study source section: "${firstMissed.citation.section}" in ${firstMissed.citation.docTitle}. Re-trace worked examples before attempting timed practice.`;
    }
    return `Review lecture notes and re-derive key invariants from scratch.`;
  } else if (status === 'medium') {
    return `Practice multi-step past exam questions to master subtle edge conditions.`;
  } else {
    return `Topic is stable. Schedule a lightweight 10-minute spaced repetition review 2 days before the exam.`;
  }
}
