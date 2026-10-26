import { NextRequest, NextResponse } from 'next/server';
import { analyzeDiagnosticQuiz } from '@/lib/gapEngine';
import { generateAdaptiveRevisionPlan } from '@/lib/planEngine';
import { Question, QuizSubmission, Topic } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { questions, submissions, topics, dailyAvailableHours = 2.5, daysUntilExam = 7 } = body as {
      questions: Question[];
      submissions: Record<string, QuizSubmission>;
      topics: Topic[];
      dailyAvailableHours?: number;
      daysUntilExam?: number;
    };

    if (!questions || !submissions || !topics) {
      return NextResponse.json({ error: 'Missing questions, submissions, or topics' }, { status: 400 });
    }

    const { report, updatedTopics } = analyzeDiagnosticQuiz(questions, submissions, topics);
    const plan = generateAdaptiveRevisionPlan(report, dailyAvailableHours, daysUntilExam);

    return NextResponse.json({
      report,
      updatedTopics,
      plan,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Evaluation failed' }, { status: 500 });
  }
}
