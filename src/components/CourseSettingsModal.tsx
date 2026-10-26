'use client';

import React from 'react';
import { GraduationCap, X } from 'lucide-react';

interface CourseSettingsModalProps {
  isOpen: boolean;
  courseName: string;
  onClose: () => void;
  onSave: (courseName: string) => void;
}

export const CourseSettingsModal: React.FC<CourseSettingsModalProps> = ({
  isOpen,
  courseName,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextCourseName = String(formData.get('courseName') || '').trim();
    if (!nextCourseName) return;
    onSave(nextCourseName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <section
        aria-labelledby="course-settings-title"
        aria-modal="true"
        className="glass-panel w-full max-w-md rounded-xl border border-slate-700 p-6 shadow-2xl"
        role="dialog"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-300">
              <GraduationCap className="h-5 w-5" />
            </span>
            <div>
              <h2 id="course-settings-title" className="text-lg font-semibold text-slate-100">
                Active course
              </h2>
              <p className="mt-1 text-sm text-slate-400">Set the course shown in your workspace.</p>
            </div>
          </div>
          <button
            aria-label="Close course settings"
            className="rounded-md p-2 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300" htmlFor="active-course-name">
              Course name
            </label>
            <input
              autoFocus
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-500"
              defaultValue={courseName}
              id="active-course-name"
              key={courseName}
              maxLength={100}
              name="courseName"
              required
            />
          </div>
          <div className="flex justify-end gap-2 border-t border-slate-800 pt-4">
            <button
              className="rounded-lg border border-slate-700 px-3.5 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-lg bg-emerald-700 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
              type="submit"
            >
              Save course
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};