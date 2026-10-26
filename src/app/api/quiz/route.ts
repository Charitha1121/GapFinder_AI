import { NextRequest, NextResponse } from 'next/server';
import { generateQuestionFromChunk } from '@/lib/aiService';
import { searchChunks } from '@/lib/ragEngine';
import { DocumentChunk, Topic } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, chunks, count = 5 } = body as {
      topic: Topic;
      chunks: DocumentChunk[];
      count?: number;
    };

    if (!topic || !chunks || chunks.length === 0) {
      return NextResponse.json({ error: 'Topic and chunks are required' }, { status: 400 });
    }

    const questionCount = Math.max(5, Math.min(10, Math.floor(Number(count) || 5)));
    const relevantMatches = searchChunks(topic.name + ' ' + topic.description, chunks, 5);
    if (relevantMatches.length === 0) {
      return NextResponse.json({ error: 'No relevant course material was found for this topic.' }, { status: 422 });
    }

    const generated = Array.from({ length: questionCount }, (_, index) => {
      const match = relevantMatches[index % relevantMatches.length];
      return generateQuestionFromChunk(topic, match.chunk, index + 1);
    });

    return NextResponse.json({
      topicId: topic.id,
      questions: generated,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Quiz generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
