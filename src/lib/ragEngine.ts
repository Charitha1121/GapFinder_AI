import { DocumentSource, DocumentChunk, RetrievedChunkMatch, Citation } from '@/types';

/**
 * Intelligent Document Chunker
 * Splits document content into structured chunks by sections or paragraphs with overlap
 */
export function chunkDocument(doc: DocumentSource, chunkSize = 400, overlap = 80): DocumentChunk[] {
  const content = doc.content;
  const chunks: DocumentChunk[] = [];

  // Match sections if present (e.g. "SECTION 4.1: ...", "UNIT 1: ...", "LECTURE ...", "CHAPTER ...")
  const sectionRegex = /(?:^|\n)((?:SECTION|UNIT|CHAPTER|LECTURE|QUESTION)\s+[^\n]+)/gi;
  const sections: { title: string; index: number }[] = [];
  let match: RegExpExecArray | null;

  while ((match = sectionRegex.exec(content)) !== null) {
    sections.push({
      title: match[1].trim(),
      index: match.index,
    });
  }

  // If structured sections exist, chunk within sections
  if (sections.length > 0) {
    for (let i = 0; i < sections.length; i++) {
      const currentSection = sections[i];
      const nextIndex = i < sections.length - 1 ? sections[i + 1].index : content.length;
      const sectionText = content.substring(currentSection.index, nextIndex).trim();

      const words = sectionText.split(/\s+/);
      let pageEstimate = Math.max(1, Math.floor(currentSection.index / 1200) + 1);

      if (words.length <= chunkSize) {
        chunks.push({
          id: `${doc.id}-chk-${chunks.length + 1}`,
          docId: doc.id,
          docTitle: doc.title,
          docType: doc.type,
          section: currentSection.title,
          page: pageEstimate,
          chunkIndex: chunks.length,
          text: sectionText,
          keywords: extractKeywords(sectionText),
        });
      } else {
        // Slide across larger section
        for (let w = 0; w < words.length; w += chunkSize - overlap) {
          const sliceWords = words.slice(w, w + chunkSize);
          const chunkText = sliceWords.join(' ');
          chunks.push({
            id: `${doc.id}-chk-${chunks.length + 1}`,
            docId: doc.id,
            docTitle: doc.title,
            docType: doc.type,
            section: `${currentSection.title} (Part ${Math.floor(w / (chunkSize - overlap)) + 1})`,
            page: pageEstimate,
            chunkIndex: chunks.length,
            text: chunkText,
            keywords: extractKeywords(chunkText),
          });
        }
      }
    }
  } else {
    // Fallback: sliding window across entire text
    const words = content.split(/\s+/);
    for (let w = 0; w < words.length; w += chunkSize - overlap) {
      const sliceWords = words.slice(w, w + chunkSize);
      const chunkText = sliceWords.join(' ');
      const pageEstimate = Math.max(1, Math.floor(w / 250) + 1);
      chunks.push({
        id: `${doc.id}-chk-${chunks.length + 1}`,
        docId: doc.id,
        docTitle: doc.title,
        docType: doc.type,
        section: `Section (p. ${pageEstimate})`,
        page: pageEstimate,
        chunkIndex: chunks.length,
        text: chunkText,
        keywords: extractKeywords(chunkText),
      });
    }
  }

  return chunks;
}

/**
 * Keyword & Term Frequency Extractor
 */
function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    'the', 'and', 'for', 'that', 'this', 'with', 'from', 'have', 'were', 'which',
    'what', 'will', 'there', 'their', 'when', 'then', 'into', 'some', 'more', 'also',
    'each', 'after', 'only', 'than', 'over', 'must', 'using', 'used', 'does', 'been',
  ]);

  const clean = text.toLowerCase().replace(/[^a-z0-9\s_-]/g, ' ');
  const words = clean.split(/\s+/).filter((w) => w.length > 3 && !stopWords.has(w));
  const counts: Record<string, number> = {};

  for (const w of words) {
    counts[w] = (counts[w] || 0) + 1;
  }

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([w]) => w);
}

/**
 * Build TF-IDF / Term Vector for Cosine Similarity Retrieval
 */
export function searchChunks(
  query: string,
  allChunks: DocumentChunk[],
  topK = 4,
  minThreshold = 0.08
): RetrievedChunkMatch[] {
  if (!query || allChunks.length === 0) return [];

  const queryTerms = query
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);

  if (queryTerms.length === 0) return [];

  // Calculate Document Frequency (DF) across chunks
  const df: Record<string, number> = {};
  for (const chunk of allChunks) {
    const chunkLower = chunk.text.toLowerCase();
    const seenInChunk = new Set<string>();
    for (const term of queryTerms) {
      if (!seenInChunk.has(term) && chunkLower.includes(term)) {
        df[term] = (df[term] || 0) + 1;
        seenInChunk.add(term);
      }
    }
  }

  const N = allChunks.length;
  const results: RetrievedChunkMatch[] = [];

  for (const chunk of allChunks) {
    const chunkLower = chunk.text.toLowerCase();
    const chunkKeywords = new Set(chunk.keywords.map((k) => k.toLowerCase()));
    let score = 0;

    for (const term of queryTerms) {
      const termDf = df[term] || 0;
      const idf = Math.log((N + 1) / (termDf + 1)) + 1;

      // Count term occurrences in chunk
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      const matches = chunkLower.match(regex);
      const tf = matches ? matches.length : 0;

      // Exact substring boost
      let termScore = tf * idf;

      // Bonus if keyword metadata matches
      if (chunkKeywords.has(term)) {
        termScore *= 1.5;
      }

      // Bonus if term appears in section title
      if (chunk.section.toLowerCase().includes(term)) {
        termScore *= 2.0;
      }

      score += termScore;
    }

    // Length normalization
    const normalizedScore = score / Math.sqrt(Math.max(1, chunk.text.length));

    if (normalizedScore >= minThreshold) {
      results.push({
        chunk,
        similarityScore: Math.min(0.99, Number((normalizedScore / 2.5).toFixed(3))),
      });
    }
  }

  // Sort descending by similarity score
  results.sort((a, b) => b.similarityScore - a.similarityScore);
  return results.slice(0, topK);
}

/**
 * Format retrieved chunks into a strict RAG grounding context
 */
export function buildGroundingPromptContext(matches: RetrievedChunkMatch[]): string {
  if (matches.length === 0) {
    return 'NO RELEVANT MATERIAL FOUND IN UPLOADED DOCUMENTS.';
  }

  return matches
    .map(
      (m, idx) =>
        `[SOURCE ${idx + 1}]
DOCUMENT: ${m.chunk.docTitle} (${m.chunk.docType.toUpperCase()})
SECTION: ${m.chunk.section}
PAGE: ${m.chunk.page || 1}
RELEVANCE SCORE: ${(m.similarityScore * 100).toFixed(1)}%
CONTENT:
"${m.chunk.text.trim()}"`
    )
    .join('\n\n----------------------------------------\n\n');
}

/**
 * Extract Citation Object from a Chunk
 */
export function chunkToCitation(chunk: DocumentChunk): Citation {
  return {
    docTitle: chunk.docTitle,
    docType: chunk.docType,
    section: chunk.section,
    pageSnippet: chunk.text.length > 220 ? chunk.text.substring(0, 220) + '...' : chunk.text,
    chunkId: chunk.id,
    pageNumber: chunk.page,
  };
}
