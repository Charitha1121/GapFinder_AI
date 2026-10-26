import { NextRequest, NextResponse } from 'next/server';
import { searchChunks, buildGroundingPromptContext } from '@/lib/ragEngine';
import { DocumentChunk } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, chunks, topK = 4 } = body as {
      query: string;
      chunks: DocumentChunk[];
      topK?: number;
    };

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const matches = searchChunks(query, chunks || [], topK);
    const contextPrompt = buildGroundingPromptContext(matches);

    return NextResponse.json({
      query,
      resultsCount: matches.length,
      matches,
      groundingContext: contextPrompt,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'RAG retrieval failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
