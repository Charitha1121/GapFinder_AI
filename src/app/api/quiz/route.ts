import { NextRequest, NextResponse } from 'next/server';
import { generateQuestionFromChunk } from '@/lib/aiService';
import { searchChunks } from '@/lib/ragEngine';
import { DocumentChunk, Topic } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, chunks, count = 3 } = body as {
      topic: Topic;
      chunks: DocumentChunk[];
      count?: number;
    };

    if (!topic || !chunks || chunks.length === 0) {
      return NextResponse.json({ error: 'Topic and chunks are required' }, { status: 400 });
    }

    const relevantMatches = searchChunks(topic.name + ' ' + topic.description, chunks, 5);
    const generated = relevantMatches.slice(0, count).map((m, idx) => {
      return generateQuestionFromChunk(topic, m.chunk, idx + 1);
    });

    return NextResponse.json({
      topicId: topic.id,
      questions: generated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Quiz generation failed' }, { status: 500 });
  }
}
