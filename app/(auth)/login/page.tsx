'use client';

// ==============================================================================
// ICS C Programming Learning Lab — Student Login Page
// ==============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Terminal, Shield, ArrowRight, UserCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { saveStoredUser, DEFAULT_DEMO_USER } from '@/lib/db/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleDemoLogin = () => {
    setLoading(true);
    saveStoredUser(DEFAULT_DEMO_USER);
    setTimeout(() => {
      router.push('/dashboard');
    }, 400);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Custom student profile login
    const customUser = {
      ...DEFAULT_DEMO_USER,
      email: email || 'student@lab.ics.edu',
      fullName: email ? email.split('@')[0] : 'Novice C Learner',
    };
    saveStoredUser(customUser);
    setMessage('Welcome back! Loading your workspace...');
    setTimeout(() => {
      router.push('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex items-center justify-center px-4 py-12">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 mb-4 shadow-lg shadow-indigo-600/20">
            <Terminal className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Sign in to C Learning Lab</h1>
          <p className="text-sm text-slate-400 mt-1.5">
            Continue mastering C memory models, pointer diagrams, and trace worksheets.
          </p>
        </div>

        {/* Quick Demo Mode Card */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Instant Guest Mode</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Zero Config
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Explore with a pre-seeded profile with completed lessons, XP, and streak stats.
          </p>
          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>Enter as Novice Explorer (Demo)</span>
          </button>
        </div>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <span className="relative px-3 bg-slate-900 text-xs text-slate-500 font-medium uppercase tracking-wider">
            or sign in with email
          </span>
        </div>

        {/* Email form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">University / Student Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.edu"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-medium text-slate-300">Password</label>
              <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300">Forgot?</a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
            />
          </div>

          {message && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-semibold border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-slate-500">
          New to the lab?{' '}
          <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
