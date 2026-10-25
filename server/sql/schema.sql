-- ============================================================================
-- CAMPUS POINT EXAMINATION & ASSESSMENT PLATFORM — POSTGRESQL DDL SCHEMA
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Taxonomy & Academic Hierarchy
CREATE TABLE IF NOT EXISTS subjects (
    subject_id SMALLSERIAL PRIMARY KEY,
    name VARCHAR(32) NOT NULL UNIQUE, -- 'Physics', 'Chemistry', 'Mathematics', 'Biology'
    code VARCHAR(8) NOT NULL UNIQUE,   -- 'PHY', 'CHE', 'MAT', 'BIO'
    display_order SMALLINT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS chapters (
    chapter_id SERIAL PRIMARY KEY,
    subject_id SMALLINT NOT NULL REFERENCES subjects(subject_id) ON DELETE RESTRICT,
    name VARCHAR(128) NOT NULL,
    code VARCHAR(64) NOT NULL UNIQUE,
    display_order SMALLINT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS topics (
    topic_id SERIAL PRIMARY KEY,
    chapter_id INT NOT NULL REFERENCES chapters(chapter_id) ON DELETE RESTRICT,
    name VARCHAR(160) NOT NULL,
    code VARCHAR(64) NOT NULL UNIQUE
);

-- 2. Question Bank & Multilingual Content
DO $$ BEGIN
    CREATE TYPE exam_category_enum AS ENUM ('jee_main', 'jee_advanced', 'both', 'neet');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE question_type_enum AS ENUM ('single_mcq', 'multiple_mcq', 'numerical', 'matrix_match', 'assertion_reason');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE difficulty_level_enum AS ENUM ('easy', 'medium', 'hard');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS questions (
    question_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_reference VARCHAR(128),
    exam_category exam_category_enum NOT NULL DEFAULT 'both',
    subject_id SMALLINT REFERENCES subjects(subject_id),
    chapter_id INT REFERENCES chapters(chapter_id),
    topic_id INT REFERENCES topics(topic_id),
    
    question_type question_type_enum NOT NULL DEFAULT 'single_mcq',
    difficulty difficulty_level_enum NOT NULL DEFAULT 'medium',
    
    numerical_correct_value NUMERIC(12, 4),
    numerical_tolerance NUMERIC(8, 4) DEFAULT 0.0000,
    
    default_positive_marks NUMERIC(4, 2) NOT NULL DEFAULT 4.00,
    default_negative_marks NUMERIC(4, 2) NOT NULL DEFAULT 1.00,
    partial_marking_rules JSONB DEFAULT NULL,
    
    verification_status VARCHAR(16) NOT NULL DEFAULT 'verified',
    current_version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS question_translations (
    translation_id SERIAL PRIMARY KEY,
    question_id UUID NOT NULL REFERENCES questions(question_id) ON DELETE CASCADE,
    language_code VARCHAR(5) NOT NULL DEFAULT 'en', -- 'en', 'hi'
    statement_latex TEXT NOT NULL,
    solution_latex TEXT,
    UNIQUE (question_id, language_code)
);

CREATE TABLE IF NOT EXISTS question_options (
    option_id SERIAL PRIMARY KEY,
    question_id UUID NOT NULL REFERENCES questions(question_id) ON DELETE CASCADE,
    option_key CHAR(1) NOT NULL, -- 'A', 'B', 'C', 'D'
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    display_order SMALLINT NOT NULL DEFAULT 1,
    UNIQUE (question_id, option_key)
);

-- 3. Student Identity Mapping (from MongoDB CP-ID)
CREATE TABLE IF NOT EXISTS students_sync (
    student_cp_id VARCHAR(32) PRIMARY KEY,
    mongo_user_id VARCHAR(24),
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL,
    parent_email VARCHAR(160),
    batch_plan VARCHAR(64) NOT NULL DEFAULT 'general',
    synced_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Test Papers & Quizzes
CREATE TABLE IF NOT EXISTS test_papers (
    paper_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paper_code VARCHAR(64) NOT NULL UNIQUE,
    title VARCHAR(180) NOT NULL,
    chapter_id INT REFERENCES chapters(chapter_id),
    difficulty VARCHAR(16) NOT NULL DEFAULT 'moderate', -- 'easy', 'moderate', 'difficult'
    duration_minutes INT NOT NULL DEFAULT 30,
    max_marks NUMERIC(6, 2) NOT NULL DEFAULT 60.00,
    total_questions INT NOT NULL DEFAULT 15,
    is_ai_optimized BOOLEAN NOT NULL DEFAULT FALSE,
    ai_rationale TEXT,
    created_by_role VARCHAR(16) NOT NULL DEFAULT 'user', -- 'user', 'mentor', 'admin'
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS paper_questions (
    paper_question_id SERIAL PRIMARY KEY,
    paper_id UUID NOT NULL REFERENCES test_papers(paper_id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(question_id),
    question_order SMALLINT NOT NULL,
    positive_marks NUMERIC(4, 2) NOT NULL DEFAULT 4.00,
    negative_marks NUMERIC(4, 2) NOT NULL DEFAULT 1.00,
    UNIQUE (paper_id, question_order)
);

-- 5. Exam Attempts & Responses
CREATE TABLE IF NOT EXISTS exam_attempts (
    attempt_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paper_id UUID NOT NULL REFERENCES test_papers(paper_id),
    student_cp_id VARCHAR(32) NOT NULL,
    status VARCHAR(24) NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'submitted', 'abandoned'
    started_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMPTZ,
    score NUMERIC(6, 2) DEFAULT 0.00,
    accuracy_percentage NUMERIC(5, 2) DEFAULT 0.00,
    time_spent_seconds INT DEFAULT 0
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_questions_chapter ON questions(chapter_id, difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_paper_questions_paper ON paper_questions(paper_id);
CREATE INDEX IF NOT EXISTS idx_attempts_student ON exam_attempts(student_cp_id);
