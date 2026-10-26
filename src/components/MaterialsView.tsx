'use client';

import React, { useState } from 'react';
import {
  FolderArchive,
  Upload,
  Layers,
  RotateCcw,
  Plus,
  Trash2,
  Eye,
} from 'lucide-react';
import { DocumentSource, DocumentChunk, DocumentType } from '@/types';

interface MaterialsViewProps {
  documents: DocumentSource[];
  chunks: DocumentChunk[];
  onAddDocument: (doc: DocumentSource) => void;
  onRemoveDocument: (docId: string) => void;
  onReloadSample: () => void;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({
  documents,
  chunks,
  onAddDocument,
  onRemoveDocument,
  onReloadSample,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState<DocumentType>('notes');
  const [docContent, setDocContent] = useState('');
  const [docDescription, setDocDescription] = useState('');
  const [docPageCount, setDocPageCount] = useState<number | undefined>();
  const [isExtracting, setIsExtracting] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [inspectDocId, setInspectDocId] = useState<string | null>(null);

  const handleFileSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setDocTitle(file.name);
    setDocPageCount(undefined);

    if (file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf') {
      setIsExtracting(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('/api/documents/extract', { method: 'POST', body: formData });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'PDF text extraction failed.');
        setDocContent(result.content);
        setDocPageCount(result.pageCount);
      } catch (error) {
        setUploadError(error instanceof Error ? error.message : 'Could not read this file.');
      } finally {
        setIsExtracting(false);
      }
      return;
    }

    if (file.name.toLowerCase().endsWith('.txt') || file.type === 'text/plain') {
      try {
        setDocContent(await file.text());
      } catch {
        setUploadError('Could not read this text file.');
      }
      return;
    }

    setUploadError('Choose a PDF or plain-text file.');
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || !docContent.trim() || isExtracting) return;

    const newDoc: DocumentSource = {
      id: `doc-${Date.now()}`,
      title: docTitle.endsWith('.pdf') || docTitle.endsWith('.txt') ? docTitle : `${docTitle}.pdf`,
      type: docType,
      content: docContent,
      fileSize: `${Math.round(docContent.length / 1024) || 1} KB`,
      pageCount: docPageCount || Math.max(1, Math.floor(docContent.length / 1200) + 1),
      uploadedAt: new Date().toLocaleString(),
      description: docDescription || `Uploaded ${docType} document with student notes and content.`,
    };

    onAddDocument(newDoc);
    setDocTitle('');
    setDocContent('');
    setDocDescription('');
    setDocPageCount(undefined);
    setUploadError('');
    setIsUploading(false);
  };

  const inspectedDoc = documents.find((d) => d.id === inspectDocId);
  const inspectedChunks = chunks.filter((c) => c.docId === inspectDocId);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-xs font-semibold text-cyan-300">
              <FolderArchive className="w-3.5 h-3.5" />
              Course Knowledge Base
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Uploaded Study Materials
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Upload your official syllabus, lecture slides, textbooks, and past papers. GapFinder AI chunks each document, indexes keywords, and grounds all quizzes and explanations in this material.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => setIsUploading(!isUploading)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-900/40 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Upload New Material
            </button>
            <button
              onClick={onReloadSample}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
              title="Reloads complete preloaded CS 204 syllabus, notes, and past exams for judging"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              Reload Judge Demo Files
            </button>
          </div>
        </div>

        {/* Quick Material Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-800/80 text-center">
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">Total Documents</span>
            <p className="text-xl font-bold text-white mt-0.5">{documents.length}</p>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">Vectorized Chunks</span>
            <p className="text-xl font-bold text-cyan-300 mt-0.5">{chunks.length}</p>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">Grounding Ready</span>
            <p className="text-xl font-bold text-emerald-300 mt-0.5">100%</p>
          </div>
        </div>
      </div>

      {/* Upload Form Modal / Drawer */}
      {isUploading && (
        <div className="glass-panel p-6 rounded-2xl border border-indigo-500/40 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Add Document to Course Repository</span>
            </h2>
            <button
              onClick={() => setIsUploading(false)}
              className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium" htmlFor="material-file">Upload PDF or text file:</label>
              <input
                accept=".pdf,.txt,application/pdf,text/plain"
                className="block w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-200"
                disabled={isExtracting}
                id="material-file"
                onChange={handleFileSelection}
                type="file"
              />
              {isExtracting && <p className="text-emerald-300">Extracting PDF text…</p>}
              {uploadError && <p className="text-rose-300" role="alert">{uploadError}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Document Title:</label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. Operating_Systems_Virtual_Memory_Notes.pdf"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Document Category:</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as DocumentType)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="syllabus">Syllabus (Knowledge Graph &amp; Topics)</option>
                  <option value="notes">Textbook / Notes (Explanations &amp; Grounding)</option>
                  <option value="past_paper">Past Question Paper (Exam Weightage &amp; Traps)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Description (Optional):</label>
              <input
                type="text"
                value={docDescription}
                onChange={(e) => setDocDescription(e.target.value)}
                placeholder="e.g. Chapter 7 paging, TLB hit rates, and page fault replacement algorithms"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">
                Document Content / Text Extract:
              </label>
              <textarea
                required
                rows={6}
                value={docContent}
                onChange={(e) => setDocContent(e.target.value)}
                placeholder="Paste the extracted syllabus topics, chapter text, or exam questions here. GapFinder AI will split this into semantic chunks with keyword indexing..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 placeholder-slate-600 font-mono text-[11px] focus:outline-none focus:border-indigo-500 leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsUploading(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isExtracting}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:cursor-wait disabled:opacity-60 text-white font-semibold cursor-pointer shadow-md shadow-indigo-900/40"
              >
                {isExtracting ? 'Extracting text…' : 'Process &amp; Vectorize Chunks'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Documents List */}
      <div className="space-y-3">
        {documents.map((doc) => {
          const docChunks = chunks.filter((c) => c.docId === doc.id);
          const isSyllabus = doc.type === 'syllabus';
          const isPastPaper = doc.type === 'past_paper';

          const typePill = isSyllabus
            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
            : isPastPaper
            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
            : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';

          return (
            <div
              key={doc.id}
              className="glass-panel p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${typePill}`}
                  >
                    {doc.type.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Uploaded: {doc.uploadedAt}
                  </span>
                  <span className="text-[11px] text-slate-500">• {doc.fileSize}</span>
                </div>

                <h3 className="text-sm font-bold text-white truncate">{doc.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-1">{doc.description}</p>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1 text-cyan-400">
                    <Layers className="w-3.5 h-3.5" />
                    {docChunks.length} Chunks Indexed
                  </span>
                  {doc.pageCount && <span>• ~{doc.pageCount} Pages</span>}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setInspectDocId(inspectDocId === doc.id ? null : doc.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{inspectDocId === doc.id ? 'Close Chunks' : 'Inspect Chunks'}</span>
                </button>

                <button
                  onClick={() => onRemoveDocument(doc.id)}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-rose-950/60 text-slate-500 hover:text-rose-400 border border-slate-800 transition cursor-pointer"
                  title="Remove document"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chunk Inspector Modal / Drawer */}
      {inspectedDoc && (
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/40 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>RAG Chunk Inspector: {inspectedDoc.title}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Showing {inspectedChunks.length} semantic chunks with keyword vectors used for diagnostic retrieval
              </p>
            </div>
            <button
              onClick={() => setInspectDocId(null)}
              className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Close
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {inspectedChunks.map((chunk, idx) => (
              <div
                key={chunk.id}
                className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs space-y-2"
              >
                <div className="flex items-center justify-between text-indigo-300 font-bold">
                  <span>
                    Chunk #{idx + 1}: {chunk.section}
                  </span>
                  <span className="text-[10px] text-slate-500">Page {chunk.page || 1}</span>
                </div>

                <p className="text-slate-300 leading-relaxed font-mono text-[11px] bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  {chunk.text}
                </p>

                {chunk.keywords.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1 text-[10px] text-slate-400 pt-1">
                    <span className="text-slate-500">Extracted Keywords:</span>
                    {chunk.keywords.map((kw, kIdx) => (
                      <span
                        key={kIdx}
                        className="px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 border border-slate-700/60"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
