-- ==============================================================================
-- ICS C Programming Learning Lab — Database Schema (PostgreSQL / Supabase)
-- ==============================================================================
-- Architecture:
-- 1. Profiles & Gamification (XP, Daily Streaks, Badges)
-- 2. Course Catalog & Structure (Topics, Lessons, Exercises)
-- 3. Student Progress & Mastery Tracking (Lesson Completion, Quiz Scores)
-- 4. Practice Submissions (Trace Tables, Predict Output, Code Correction)
-- 5. Row-Level Security (RLS) Policies protecting individual learner data
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES & USER ACCOUNTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
    xp INTEGER DEFAULT 0 CHECK (xp >= 0),
    streak_count INTEGER DEFAULT 0 CHECK (streak_count >= 0),
    last_active_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user leaderboard / profile lookup
CREATE INDEX IF NOT EXISTS idx_profiles_xp ON public.profiles(xp DESC);

-- ------------------------------------------------------------------------------
-- 2. TOPICS & LESSONS (COURSE CATALOG)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.topics (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    module_number INTEGER NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lessons (
    id TEXT PRIMARY KEY,
    topic_id TEXT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    estimated_minutes INTEGER DEFAULT 15,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(topic_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_lessons_topic ON public.lessons(topic_id, sort_order);

-- ------------------------------------------------------------------------------
-- 3. EXERCISES & PRACTICE PROBLEMS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.exercises (
    id TEXT PRIMARY KEY,
    lesson_id TEXT REFERENCES public.lessons(id) ON DELETE SET NULL,
    topic_id TEXT REFERENCES public.topics(id) ON DELETE CASCADE,
    exercise_type TEXT NOT NULL CHECK (exercise_type IN ('trace_table', 'predict_output', 'code_correction', 'fill_blank')),
    title TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    xp_reward INTEGER DEFAULT 50,
    instructions TEXT NOT NULL,
    initial_code TEXT NOT NULL,
    solution_data JSONB,
    hints JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exercises_topic ON public.exercises(topic_id, difficulty);

-- ------------------------------------------------------------------------------
-- 4. STUDENT PROGRESS (LESSON COMPLETION & MASTERY)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    topic_id TEXT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    quiz_score INTEGER DEFAULT 0,
    quiz_max_score INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_user_progress_user ON public.user_progress(user_id, topic_id);

-- ------------------------------------------------------------------------------
-- 5. SUBMISSIONS (TRACE WORKSHEETS & PROBLEM SOLVING)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    exercise_id TEXT NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
    exercise_type TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    score INTEGER NOT NULL DEFAULT 0,
    submitted_data JSONB NOT NULL,
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_submissions_user ON public.user_submissions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_exercise ON public.user_submissions(exercise_id, is_correct);

-- ------------------------------------------------------------------------------
-- 6. ROW-LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_submissions ENABLE ROW LEVEL SECURITY;

-- Topics & Lessons & Exercises: Public read for all authenticated and anonymous users
CREATE POLICY "Allow public read for topics"
    ON public.topics FOR SELECT USING (true);

CREATE POLICY "Allow public read for lessons"
    ON public.lessons FOR SELECT USING (true);

CREATE POLICY "Allow public read for exercises"
    ON public.exercises FOR SELECT USING (true);

-- Profiles: Users can view all profiles (leaderboard), but only edit their own
CREATE POLICY "Allow users to view profiles"
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Allow users to update own profile"
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Progress: Users can only see and update their own progress
CREATE POLICY "Users can view own progress"
    ON public.user_progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
    ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
    ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);

-- Submissions: Users can view and insert their own submissions
CREATE POLICY "Users can view own submissions"
    ON public.user_submissions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own submissions"
    ON public.user_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 7. TRIGGER: AUTO-CREATE PROFILE ON AUTH SIGNUP
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, xp, streak_count)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url',
        0,
        1
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger firing on Supabase auth.users table insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
