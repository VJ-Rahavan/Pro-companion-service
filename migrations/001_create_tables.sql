-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 001 — initial schema
-- Run via: npm run migrate
-- ─────────────────────────────────────────────────────────────────────────────

-- Users: stores account info, reminder preference, and Expo push token
CREATE TABLE IF NOT EXISTS users (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email            TEXT        UNIQUE NOT NULL,
  password_hash    TEXT        NOT NULL,
  reminder_time    TIME        DEFAULT '20:00:00',  -- daily reminder at this local time
  expo_push_token  TEXT,                            -- set after mobile app registers
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Stages: top-level curriculum groupings (e.g. "Foundations", "Trees & graphs")
CREATE TABLE IF NOT EXISTS stages (
  id     UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  number INT   UNIQUE NOT NULL,
  title  TEXT  NOT NULL
);

-- Topics: sub-groups within a stage (e.g. "Arrays & strings", "Hashing")
CREATE TABLE IF NOT EXISTS topics (
  id       UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id UUID  NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
  name     TEXT  NOT NULL
);

-- Problems: individual LeetCode-style questions under a topic
CREATE TABLE IF NOT EXISTS problems (
  id        UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id  UUID  NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  title     TEXT  NOT NULL,
  difficulty TEXT  NOT NULL CHECK (difficulty IN ('easy', 'med', 'hard')),
  pattern   TEXT  NOT NULL   -- the algorithmic pattern (e.g. 'sliding window')
);

-- User progress: one row per user per problem attempt
CREATE TABLE IF NOT EXISTS user_progress (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id         UUID        NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  status             TEXT        NOT NULL CHECK (status IN ('solved', 'failed', 'skipped')),
  time_taken_seconds INT,
  solved_at          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, problem_id)  -- one record per user+problem, upserted on re-attempt
);

-- Streaks: one row per user, updated every time they solve a problem
CREATE TABLE IF NOT EXISTS streaks (
  id               UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID  NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  current_streak   INT   DEFAULT 0,
  longest_streak   INT   DEFAULT 0,
  last_active_date DATE              -- YYYY-MM-DD of the last day they solved something
);
