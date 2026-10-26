import { NextRequest, NextResponse } from 'next/server';
import { searchChunks } from '@/lib/ragEngine';
import { askExplainTopic } from '@/lib/aiService';
import { DocumentChunk } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, chunks, apiKey } = body as {
      query: string;
      chunks: DocumentChunk[];
      apiKey?: string;
    };

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const matches = searchChunks(query, chunks || [], 4);
    const result = await askExplainTopic(query, matches, { apiKey });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Chat synthesis failed' }, { status: 500 });
  }
}
