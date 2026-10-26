'use client';

import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  BookOpen,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Bot,
  User,
} from 'lucide-react';
import { ChatMessage, DocumentChunk } from '@/types';
import { searchChunks } from '@/lib/ragEngine';
import { askExplainTopic } from '@/lib/aiService';

interface ExplainAssistantProps {
  chunks: DocumentChunk[];
  geminiApiKey?: string;
  initialQuery?: string;
}

let nextMsgId = 1;
function generateMsgId(prefix: string): string {
  return `${prefix}-${nextMsgId++}`;
}

function getFormattedTime(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const ExplainAssistant: React.FC<ExplainAssistantProps> = ({
  chunks,
  geminiApiKey,
  initialQuery,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      content:
        'Hello! I am your strict RAG academic tutor. I answer questions **strictly and exclusively** using your uploaded syllabus, textbook chapters, and past exam papers. Ask about any concept, diagnosed gap, or exam problem.',
      timestamp: 'Just now',
      suggestedFollowUp: [
        'Why does an LR imbalance in an AVL tree require a double rotation?',
        'Under what condition does BFS fail to find the shortest path?',
        'Why does 0/1 knapsack 1D DP loop run backwards?',
        'What problem do Virtual Nodes solve in Consistent Hashing?',
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState(initialQuery || '');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedChunkMsgId, setExpandedChunkMsgId] = useState<string | null>(null);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<Record<string, number>>({});

  const handleSendMessage = async (queryText?: string) => {
    const q = (queryText || inputQuery).trim();
    if (!q || isLoading) return;

    setInputQuery('');
    const userMsgId = generateMsgId('usr');
    const newMessages: ChatMessage[] = [
      ...messages,
      {
        id: userMsgId,
        sender: 'user',
        content: q,
        timestamp: getFormattedTime(),
      },
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // 1. RAG Semantic Retrieval
      const matches = searchChunks(q, chunks, 3);

      // 2. RAG Synthesis
      const response = await askExplainTopic(q, matches, { apiKey: geminiApiKey });

      const assistantMsg: ChatMessage = {
        id: generateMsgId('asst'),
        sender: 'assistant',
        content: response.answer,
        timestamp: getFormattedTime(),
        retrievedChunks: matches,
        suggestedFollowUp: response.followUpSuggestions,
        checkQuestion: response.checkQuestion,
      };

      setMessages([...newMessages, assistantMsg]);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error communicating with RAG engine';
      setMessages([
        ...newMessages,
        {
          id: generateMsgId('err'),
          sender: 'assistant',
          content: `Unable to complete synthesis: ${errorMessage}.`,
          timestamp: getFormattedTime(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectQuiz = (msgId: string, optionIdx: number) => {
    setSelectedQuizAnswer((prev) => ({ ...prev, [msgId]: optionIdx }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              Strict Grounding Engine
            </span>
            <span className="text-xs text-slate-400">
              Grounded across {chunks.length} vectorized note passages
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            Explain-This-Topic Assistant
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Zero Hallucination Grounding</span>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isExpanded = expandedChunkMsgId === msg.id;
          const userChosenQuiz = selectedQuizAnswer[msg.id];

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-gradient-to-br from-indigo-500 to-cyan-500 text-white'
                    : 'bg-slate-800 border border-slate-700 text-cyan-400'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-2xl rounded-2xl p-4 sm:p-5 text-xs sm:text-sm space-y-3 ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'glass-panel border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                {/* Message Body */}
                <div className="whitespace-pre-wrap leading-relaxed space-y-2">
                  {msg.content}
                </div>

                {/* Retrieved Source Chunks Accordion */}
                {!isUser && msg.retrievedChunks && msg.retrievedChunks.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 space-y-2">
                    <button
                      onClick={() =>
                        setExpandedChunkMsgId(isExpanded ? null : msg.id)
                      }
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>
                        {isExpanded ? 'Hide' : 'Inspect'} {msg.retrievedChunks.length} Retrieved Source Passages
                      </span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="space-y-2 mt-2">
                        {msg.retrievedChunks.map((m, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-[11px] space-y-1"
                          >
                            <div className="flex items-center justify-between text-indigo-300 font-bold">
                              <span>
                                [Source {idx + 1}] {m.chunk.docTitle}
                              </span>
                              <span className="text-[10px] text-cyan-400">
                                Match: {(m.similarityScore * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div className="text-slate-400 text-[10px]">
                              Section: {m.chunk.section} • Est. Page: {m.chunk.page || 1}
                            </div>
                            <p className="text-slate-300 italic pt-1 border-t border-slate-800/60 leading-relaxed">
                              &quot;{m.chunk.text}&quot;
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Mini Check Question (Active Recall Test!) */}
                {!isUser && msg.checkQuestion && (
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-indigo-500/30 space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-indigo-300">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Check Your Understanding</span>
                    </div>

                    <p className="text-slate-200">{msg.checkQuestion.prompt}</p>

                    <div className="space-y-1.5 pt-1">
                      {msg.checkQuestion.options.map((opt, optIdx) => {
                        const isChosen = userChosenQuiz === optIdx;
                        const isCorrectOpt = optIdx === msg.checkQuestion!.correctIndex;
                        const showResult = userChosenQuiz !== undefined;

                        let optClasses = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';
                        if (showResult) {
                          if (isCorrectOpt) {
                            optClasses = 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200';
                          } else if (isChosen) {
                            optClasses = 'bg-rose-950/40 border-rose-500/60 text-rose-200';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectQuiz(msg.id, optIdx)}
                            disabled={showResult}
                            className={`w-full text-left p-2.5 rounded-lg border text-xs transition flex items-center justify-between cursor-pointer ${optClasses}`}
                          >
                            <span>{opt}</span>
                            {showResult && isCorrectOpt && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                            {showResult && isChosen && !isCorrectOpt && <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                          </button>
                        );
                      })}
                    </div>

                    {userChosenQuiz !== undefined && (
                      <p className="text-[11px] text-slate-400 pt-1 italic">
                        {msg.checkQuestion.explanation}
                      </p>
                    )}
                  </div>
                )}

                {/* Follow-up suggestions */}
                {!isUser && msg.suggestedFollowUp && msg.suggestedFollowUp.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {msg.suggestedFollowUp.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSendMessage(sug)}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-indigo-300 hover:text-indigo-200 border border-slate-700/80 transition cursor-pointer text-left"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}

                <div
                  className={`text-[10px] ${
                    isUser ? 'text-indigo-200 text-right' : 'text-slate-500'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>Retrieving source note chunks &amp; synthesizing citation response...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Form Bar */}
      <div className="glass-panel p-3 rounded-2xl border border-slate-800 sticky bottom-4 shadow-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask a question about your syllabus, lecture notes, or past papers..."
            className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className={`p-2.5 rounded-xl font-semibold transition cursor-pointer ${
              !inputQuery.trim() || isLoading
                ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-900/40'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
