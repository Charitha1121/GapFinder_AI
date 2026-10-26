'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  X,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { UserProfile } from '@/types';
import { FRESH_STUDENT } from '@/lib/sampleData';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSelectJudgeMode: () => void;
  onSelectStudentMode: () => void;
  onCustomLogin: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectJudgeMode,
  onSelectStudentMode,
  onCustomLogin,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authMessage, setAuthMessage] = useState('');

  if (!isOpen) return null;

  const handleDemoProfile = async (selectProfile: () => void) => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setAuthMessage(error.message);
        return;
      }
    }
    selectProfile();
    onClose();
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setAuthMessage('Live accounts are not configured. Add the Supabase values from .env.example; demo profiles remain available.');
      return;
    }

    setAuthMessage('');
    const result = isSignUp
      ? await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: name.trim() || email.split('@')[0] } },
        })
      : await supabase.auth.signInWithPassword({ email: email.trim(), password });

    if (result.error) {
      setAuthMessage(result.error.message);
      return;
    }

    if (isSignUp && !result.data.session) {
      setAuthMessage('Check your email to confirm your account, then sign in here.');
      return;
    }

    const authUser = result.data.user;
    if (!authUser) {
      setAuthMessage('Authentication did not return a user. Please try again.');
      return;
    }

    const user: UserProfile = {
      id: authUser.id,
      name: String(authUser.user_metadata?.full_name || name.trim() || authUser.email?.split('@')[0] || 'Student'),
      email: authUser.email || email.trim(),
      role: 'student',
      courseName: 'New course',
      examDate: '2026-11-15',
      dailyStudyHours: 2.0,
    };

    onSelectStudentMode();
    onCustomLogin(user);
    onClose();
    window.location.reload();
  };

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) {
      setAuthMessage(error.message);
      return;
    }
    onSelectStudentMode();
    onClose();
    window.location.reload();
  };

  const hasSupabaseAuth = Boolean(getSupabaseBrowserClient());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-indigo-500/40 p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Authentication &amp; Demo Access</h2>
              <p className="text-xs text-slate-400">
                Official credentials and 1-click accounts for evaluation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1-Click Judge & Demo Credentials Box */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-bold flex items-center gap-1.5 text-cyan-300">
              <Sparkles className="w-3.5 h-3.5" />
              1-Click Judge &amp; Evaluation Profiles:
            </span>
            <span className="text-[10px] text-slate-500">Recommended for Hackathon</span>
          </div>

          {/* Profile 1: Preloaded Judge */}
          <button
            onClick={() => {
              void handleDemoProfile(onSelectJudgeMode);
            }}
            className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
              currentUser.role === 'judge'
                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">Alex Rivera (Judge Mode)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Preloaded Data
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Email: <code className="text-indigo-300 font-mono">judge@gapfinder.ai</code>
              </p>
              <p className="text-[11px] text-emerald-400">
                ✓ Full syllabus, 4 note chapters, past papers, gap report &amp; revision plan preloaded.
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0 ml-2" />
          </button>

          {/* Profile 2: Fresh Student */}
          <button
            onClick={() => {
              void handleDemoProfile(onSelectStudentMode);
            }}
            className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
              currentUser.id === FRESH_STUDENT.id
                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">Taylor Brooks (Student Mode)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  Blank Slate
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Email: <code className="text-indigo-300 font-mono">student@gapfinder.ai</code>
              </p>
              <p className="text-[11px] text-slate-400">
                Empty state to test uploading own custom syllabus &amp; notes from scratch.
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-800" />
          <span className="flex-shrink mx-4 text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
            Or Sign In with Custom Account
          </span>
          <div className="flex-grow border-t border-slate-800" />
        </div>

        {/* Custom Auth Form */}
        <form onSubmit={handleCustomSubmit} className="space-y-3 text-xs">
          {!hasSupabaseAuth && (
            <p className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-200">
              Configure Supabase to enable real email/password accounts. Demo profiles work without it.
            </p>
          )}

          {isSignUp && (
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Your Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jordan Lee"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Email Address:</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. yourname@university.edu"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Password:</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition cursor-pointer mt-2"
          >
            {isSignUp ? 'Create Student Account' : 'Sign In'}
          </button>

          {authMessage && <p className="text-xs text-amber-200" role="status">{authMessage}</p>}

          {hasSupabaseAuth && /^[0-9a-f-]{36}$/i.test(currentUser.id) && (
            <button
              className="w-full rounded-lg border border-slate-700 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-800"
              onClick={() => void handleSignOut()}
              type="button"
            >
              Sign out
            </button>
          )}

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
            >
              {isSignUp ? 'Already have an account? Sign In' : 'New student? Create an account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
