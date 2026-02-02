-- ============================================
-- Al-Haqq Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================
-- QURAN TABLES
-- ============================================

-- Surah metadata
CREATE TABLE IF NOT EXISTS surahs (
    id SERIAL PRIMARY KEY,
    number INT UNIQUE NOT NULL,
    arabic_name VARCHAR(100) NOT NULL,
    english_name VARCHAR(100) NOT NULL,
    transliteration VARCHAR(100),
    revelation_type VARCHAR(20) CHECK (revelation_type IN ('Meccan', 'Medinan')),
    total_ayahs INT NOT NULL,
    juz_start INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ayah/Verse table
CREATE TABLE IF NOT EXISTS ayahs (
    id SERIAL PRIMARY KEY,
    surah_id INT REFERENCES surahs(id) ON DELETE CASCADE,
    ayah_number INT NOT NULL,
    arabic_text TEXT NOT NULL,
    juz INT,
    hizb INT,
    manzil INT,
    ruku INT,
    sajda BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(surah_id, ayah_number)
);

-- Quran translations (MVP: English, Urdu, Telugu)
CREATE TABLE IF NOT EXISTS quran_translations (
    id SERIAL PRIMARY KEY,
    ayah_id INT REFERENCES ayahs(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL,
    translator VARCHAR(100),
    translation_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(ayah_id, language_code, translator)
);

-- Word-by-word data
CREATE TABLE IF NOT EXISTS quran_words (
    id SERIAL PRIMARY KEY,
    ayah_id INT REFERENCES ayahs(id) ON DELETE CASCADE,
    position INT NOT NULL,
    arabic_word TEXT NOT NULL,
    transliteration TEXT,
    translation TEXT,
    root VARCHAR(10),
    UNIQUE(ayah_id, position)
);

-- ============================================
-- HADITH TABLES
-- ============================================

-- Hadith books/collections
CREATE TABLE IF NOT EXISTS hadith_books (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(50) UNIQUE NOT NULL,
    arabic_title VARCHAR(200) NOT NULL,
    english_title VARCHAR(200) NOT NULL,
    author_arabic VARCHAR(200),
    author_english VARCHAR(200),
    total_hadiths INT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hadith chapters
CREATE TABLE IF NOT EXISTS hadith_chapters (
    id SERIAL PRIMARY KEY,
    book_id INT REFERENCES hadith_books(id) ON DELETE CASCADE,
    chapter_number INT NOT NULL,
    arabic_title TEXT,
    english_title TEXT,
    UNIQUE(book_id, chapter_number)
);

-- Individual hadiths
CREATE TABLE IF NOT EXISTS hadiths (
    id SERIAL PRIMARY KEY,
    book_id INT REFERENCES hadith_books(id) ON DELETE CASCADE,
    chapter_id INT REFERENCES hadith_chapters(id) ON DELETE SET NULL,
    hadith_number INT NOT NULL,
    arabic_text TEXT NOT NULL,
    english_narrator TEXT,
    english_text TEXT NOT NULL,
    grade VARCHAR(50),
    reference VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(book_id, hadith_number)
);

-- ============================================
-- VECTOR EMBEDDINGS (for Semantic Search)
-- ============================================

CREATE TABLE IF NOT EXISTS content_embeddings (
    id SERIAL PRIMARY KEY,
    content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('ayah', 'hadith')),
    content_id INT NOT NULL,
    language VARCHAR(10) NOT NULL,
    embedding vector(768), -- Gemini embedding dimensions
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(content_type, content_id, language)
);

-- ============================================
-- TAFSIR (Commentary)
-- ============================================

CREATE TABLE IF NOT EXISTS tafsir_sources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    author VARCHAR(200),
    language_code VARCHAR(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS tafsir_entries (
    id SERIAL PRIMARY KEY,
    source_id INT REFERENCES tafsir_sources(id) ON DELETE CASCADE,
    ayah_id INT REFERENCES ayahs(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    UNIQUE(source_id, ayah_id)
);

-- ============================================
-- DUAS
-- ============================================

CREATE TABLE IF NOT EXISTS duas (
    id SERIAL PRIMARY KEY,
    arabic_text TEXT NOT NULL,
    transliteration TEXT,
    translation TEXT NOT NULL,
    category VARCHAR(100),
    source TEXT,
    audio_url TEXT
);

-- ============================================
-- AI CONVERSATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- NULL for anonymous users in MVP
    title VARCHAR(255),
    started_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_messages (
    id SERIAL PRIMARY KEY,
    conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    sources JSONB,
    tokens_used INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- USER & AUTHENTICATION TABLES
-- ============================================

-- User accounts with full profile
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255),
    display_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    preferred_language VARCHAR(10) DEFAULT 'en',
    preferred_translation VARCHAR(50),
    preferred_reciter VARCHAR(100),
    prayer_calculation_method VARCHAR(50) DEFAULT 'MWL',
    timezone VARCHAR(50),
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- OAuth providers
CREATE TABLE IF NOT EXISTS user_oauth_accounts (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(provider, provider_user_id)
);

-- Passkeys / WebAuthn
CREATE TABLE IF NOT EXISTS user_passkeys (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    credential_id TEXT UNIQUE NOT NULL,
    public_key TEXT NOT NULL,
    counter INT DEFAULT 0,
    device_name VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Two-factor authentication
CREATE TABLE IF NOT EXISTS user_2fa (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    method VARCHAR(20) NOT NULL,
    secret TEXT,
    is_enabled BOOLEAN DEFAULT FALSE,
    backup_codes TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash VARCHAR(255),
    device_info JSONB,
    ip_address INET,
    location JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
);

-- ============================================
-- USER CONTENT TABLES
-- ============================================

-- Collections & Bookmarks
CREATE TABLE IF NOT EXISTS collections (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookmarks (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    collection_id INT REFERENCES collections(id) ON DELETE SET NULL,
    content_type VARCHAR(20) NOT NULL,
    content_id INT NOT NULL,
    note TEXT,
    color VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reading progress
CREATE TABLE IF NOT EXISTS reading_progress (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content_type VARCHAR(20) NOT NULL,
    content_id INT NOT NULL,
    last_position JSONB,
    percentage DECIMAL(5,2),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, content_type, content_id)
);

-- Memorization tracking
CREATE TABLE IF NOT EXISTS memorization_progress (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    surah_id INT REFERENCES surahs(id),
    ayah_start INT NOT NULL,
    ayah_end INT NOT NULL,
    status VARCHAR(20) NOT NULL,
    strength INT DEFAULT 0,
    next_review_at TIMESTAMPTZ,
    review_count INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prayer tracking
CREATE TABLE IF NOT EXISTS prayer_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    prayer_name VARCHAR(20) NOT NULL,
    prayer_type VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    prayed_at TIMESTAMPTZ,
    is_prayed BOOLEAN DEFAULT FALSE,
    is_on_time BOOLEAN,
    UNIQUE(user_id, prayer_name, prayer_type, date)
);

-- User locations
CREATE TABLE IF NOT EXISTS user_locations (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    city VARCHAR(100),
    country VARCHAR(100),
    timezone VARCHAR(50),
    is_primary BOOLEAN DEFAULT FALSE
);

-- Zakat records
CREATE TABLE IF NOT EXISTS zakat_records (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    year INT NOT NULL,
    calculation_date DATE NOT NULL,
    assets JSONB NOT NULL,
    total_wealth DECIMAL(15, 2),
    nisab_value DECIMAL(15, 2),
    zakat_due DECIMAL(15, 2),
    zakat_paid DECIMAL(15, 2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD'
);

-- Charity logs
CREATE TABLE IF NOT EXISTS charity_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    category VARCHAR(50),
    recipient TEXT,
    date DATE NOT NULL
);

-- Dhikr counter
CREATE TABLE IF NOT EXISTS dhikr_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    dhikr_text TEXT NOT NULL,
    target_count INT,
    actual_count INT DEFAULT 0,
    date DATE NOT NULL
);

-- User notes
CREATE TABLE IF NOT EXISTS user_notes (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content_type VARCHAR(20) NOT NULL,
    content_id INT NOT NULL,
    note_text TEXT NOT NULL,
    is_private BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification settings
CREATE TABLE IF NOT EXISTS notification_settings (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    prayer_times BOOLEAN DEFAULT TRUE,
    daily_verse BOOLEAN DEFAULT TRUE,
    daily_hadith BOOLEAN DEFAULT TRUE,
    study_reminders BOOLEAN DEFAULT TRUE,
    islamic_events BOOLEAN DEFAULT TRUE,
    pre_adhan_minutes INT DEFAULT 10
);

-- Study streaks
CREATE TABLE IF NOT EXISTS study_streaks (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_activity_date DATE,
    total_days_active INT DEFAULT 0
);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ADDITIONAL CONTENT
-- ============================================

-- Mosques
CREATE TABLE IF NOT EXISTS mosques (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone VARCHAR(50),
    website TEXT,
    facilities JSONB,
    is_verified BOOLEAN DEFAULT FALSE
);

-- Halal places
CREATE TABLE IF NOT EXISTS halal_places (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    certification VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE
);

-- Islamic events
CREATE TABLE IF NOT EXISTS islamic_events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    arabic_name VARCHAR(100),
    hijri_month INT NOT NULL,
    hijri_day INT NOT NULL,
    description TEXT,
    is_holiday BOOLEAN DEFAULT FALSE,
    is_fasting_day BOOLEAN DEFAULT FALSE
);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    difficulty VARCHAR(20),
    estimated_hours INT,
    is_published BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS course_lessons (
    id SERIAL PRIMARY KEY,
    course_id INT REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    video_url TEXT,
    order_index INT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_course_progress (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(id) ON DELETE CASCADE,
    completed_lessons INT[] DEFAULT '{}',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, course_id)
);

-- Community Q&A
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(300) NOT NULL,
    body TEXT NOT NULL,
    tags TEXT[],
    upvotes INT DEFAULT 0,
    is_answered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS answers (
    id SERIAL PRIMARY KEY,
    question_id INT REFERENCES questions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    body TEXT NOT NULL,
    upvotes INT DEFAULT 0,
    is_accepted BOOLEAN DEFAULT FALSE,
    is_scholar_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Quran indexes
CREATE INDEX IF NOT EXISTS idx_ayahs_surah ON ayahs(surah_id);
CREATE INDEX IF NOT EXISTS idx_translations_ayah ON quran_translations(ayah_id);
CREATE INDEX IF NOT EXISTS idx_translations_lang ON quran_translations(language_code);
CREATE INDEX IF NOT EXISTS idx_words_ayah ON quran_words(ayah_id);

-- Hadith indexes
CREATE INDEX IF NOT EXISTS idx_hadiths_book ON hadiths(book_id);
CREATE INDEX IF NOT EXISTS idx_hadiths_chapter ON hadiths(chapter_id);
CREATE INDEX IF NOT EXISTS idx_chapters_book ON hadith_chapters(book_id);

-- Embedding indexes (for vector similarity search)
CREATE INDEX IF NOT EXISTS idx_embeddings_type ON content_embeddings(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_embeddings_vector ON content_embeddings 
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- AI indexes
CREATE INDEX IF NOT EXISTS idx_ai_messages_conv ON ai_messages(conversation_id);

-- ============================================
-- FULL TEXT SEARCH
-- ============================================

-- Add tsvector columns for full-text search
ALTER TABLE ayahs ADD COLUMN IF NOT EXISTS arabic_tsv tsvector
    GENERATED ALWAYS AS (to_tsvector('simple', arabic_text)) STORED;

ALTER TABLE quran_translations ADD COLUMN IF NOT EXISTS translation_tsv tsvector
    GENERATED ALWAYS AS (to_tsvector('english', translation_text)) STORED;

ALTER TABLE hadiths ADD COLUMN IF NOT EXISTS english_tsv tsvector
    GENERATED ALWAYS AS (to_tsvector('english', english_text)) STORED;

ALTER TABLE hadiths ADD COLUMN IF NOT EXISTS arabic_tsv tsvector
    GENERATED ALWAYS AS (to_tsvector('simple', arabic_text)) STORED;

-- Create GIN indexes for full-text search
CREATE INDEX IF NOT EXISTS idx_ayahs_arabic_fts ON ayahs USING GIN(arabic_tsv);
CREATE INDEX IF NOT EXISTS idx_translations_fts ON quran_translations USING GIN(translation_tsv);
CREATE INDEX IF NOT EXISTS idx_hadiths_english_fts ON hadiths USING GIN(english_tsv);
CREATE INDEX IF NOT EXISTS idx_hadiths_arabic_fts ON hadiths USING GIN(arabic_tsv);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on core tables
ALTER TABLE surahs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayahs ENABLE ROW LEVEL SECURITY;
ALTER TABLE quran_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE hadith_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE hadiths ENABLE ROW LEVEL SECURITY;
ALTER TABLE duas ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

-- Enable RLS on new tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_oauth_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_passkeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_2fa ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE memorization_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE zakat_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE charity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE dhikr_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE mosques ENABLE ROW LEVEL SECURITY;
ALTER TABLE halal_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE islamic_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Public read access for content tables
DROP POLICY IF EXISTS "Public read access" ON surahs;
CREATE POLICY "Public read access" ON surahs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access" ON ayahs;
CREATE POLICY "Public read access" ON ayahs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access" ON quran_translations;
CREATE POLICY "Public read access" ON quran_translations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access" ON hadith_books;
CREATE POLICY "Public read access" ON hadith_books FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access" ON hadiths;
CREATE POLICY "Public read access" ON hadiths FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access" ON duas;
CREATE POLICY "Public read access" ON duas FOR SELECT USING (true);

-- AI conversations - public access for MVP (no auth)
DROP POLICY IF EXISTS "Public access for MVP" ON ai_conversations;
CREATE POLICY "Public access for MVP" ON ai_conversations FOR ALL USING (true);

DROP POLICY IF EXISTS "Public access for MVP" ON ai_messages;
CREATE POLICY "Public access for MVP" ON ai_messages FOR ALL USING (true);

-- Basic RLS Policies for User/Auth (Users can only see/edit their own data)

-- Users
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Collections
DROP POLICY IF EXISTS "Users can view own collections" ON collections;
CREATE POLICY "Users can view own collections" ON collections FOR SELECT USING (auth.uid() = user_id OR is_public = true);

DROP POLICY IF EXISTS "Users can manage own collections" ON collections;
CREATE POLICY "Users can manage own collections" ON collections FOR ALL USING (auth.uid() = user_id);

-- Bookmarks
DROP POLICY IF EXISTS "Users can manage own bookmarks" ON bookmarks;
CREATE POLICY "Users can manage own bookmarks" ON bookmarks FOR ALL USING (auth.uid() = user_id);

-- Reading Progress
DROP POLICY IF EXISTS "Users can manage own reading progress" ON reading_progress;
CREATE POLICY "Users can manage own reading progress" ON reading_progress FOR ALL USING (auth.uid() = user_id);

-- Public read access for additional content
DROP POLICY IF EXISTS "Public read access" ON mosques;
CREATE POLICY "Public read access" ON mosques FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access" ON halal_places;
CREATE POLICY "Public read access" ON halal_places FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access" ON islamic_events;
CREATE POLICY "Public read access" ON islamic_events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access" ON courses;
CREATE POLICY "Public read access" ON courses FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public read access" ON course_lessons;
CREATE POLICY "Public read access" ON course_lessons FOR SELECT USING (EXISTS (SELECT 1 FROM courses WHERE id = course_lessons.course_id AND is_published = true));

DROP POLICY IF EXISTS "Public read access" ON questions;
CREATE POLICY "Public read access" ON questions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access" ON answers;
CREATE POLICY "Public read access" ON answers FOR SELECT USING (true);

-- ============================================
-- SURAH METADATA (Initial data)
-- ============================================

INSERT INTO surahs (number, arabic_name, english_name, transliteration, revelation_type, total_ayahs) VALUES
(1, 'الفاتحة', 'The Opening', 'Al-Fatihah', 'Meccan', 7),
(2, 'البقرة', 'The Cow', 'Al-Baqarah', 'Medinan', 286),
(3, 'آل عمران', 'Family of Imran', 'Aal-E-Imran', 'Medinan', 200),
(4, 'النساء', 'The Women', 'An-Nisa', 'Medinan', 176),
(5, 'المائدة', 'The Table Spread', 'Al-Maidah', 'Medinan', 120),
(6, 'الأنعام', 'The Cattle', 'Al-Anaam', 'Meccan', 165),
(7, 'الأعراف', 'The Heights', 'Al-Araf', 'Meccan', 206),
(8, 'الأنفال', 'The Spoils of War', 'Al-Anfal', 'Medinan', 75),
(9, 'التوبة', 'The Repentance', 'At-Tawbah', 'Medinan', 129),
(10, 'يونس', 'Jonah', 'Yunus', 'Meccan', 109),
(11, 'هود', 'Hud', 'Hud', 'Meccan', 123),
(12, 'يوسف', 'Joseph', 'Yusuf', 'Meccan', 111),
(13, 'الرعد', 'The Thunder', 'Ar-Rad', 'Medinan', 43),
(14, 'إبراهيم', 'Abraham', 'Ibrahim', 'Meccan', 52),
(15, 'الحجر', 'The Rocky Tract', 'Al-Hijr', 'Meccan', 99),
(16, 'النحل', 'The Bee', 'An-Nahl', 'Meccan', 128),
(17, 'الإسراء', 'The Night Journey', 'Al-Isra', 'Meccan', 111),
(18, 'الكهف', 'The Cave', 'Al-Kahf', 'Meccan', 110),
(19, 'مريم', 'Mary', 'Maryam', 'Meccan', 98),
(20, 'طه', 'Ta-Ha', 'Taha', 'Meccan', 135),
(21, 'الأنبياء', 'The Prophets', 'Al-Anbiya', 'Meccan', 112),
(22, 'الحج', 'The Pilgrimage', 'Al-Hajj', 'Medinan', 78),
(23, 'المؤمنون', 'The Believers', 'Al-Muminun', 'Meccan', 118),
(24, 'النور', 'The Light', 'An-Nur', 'Medinan', 64),
(25, 'الفرقان', 'The Criterion', 'Al-Furqan', 'Meccan', 77),
(26, 'الشعراء', 'The Poets', 'Ash-Shuara', 'Meccan', 227),
(27, 'النمل', 'The Ant', 'An-Naml', 'Meccan', 93),
(28, 'القصص', 'The Stories', 'Al-Qasas', 'Meccan', 88),
(29, 'العنكبوت', 'The Spider', 'Al-Ankabut', 'Meccan', 69),
(30, 'الروم', 'The Romans', 'Ar-Rum', 'Meccan', 60),
(31, 'لقمان', 'Luqman', 'Luqman', 'Meccan', 34),
(32, 'السجدة', 'The Prostration', 'As-Sajdah', 'Meccan', 30),
(33, 'الأحزاب', 'The Combined Forces', 'Al-Ahzab', 'Medinan', 73),
(34, 'سبأ', 'Sheba', 'Saba', 'Meccan', 54),
(35, 'فاطر', 'Originator', 'Fatir', 'Meccan', 45),
(36, 'يس', 'Ya-Sin', 'Ya-Sin', 'Meccan', 83),
(37, 'الصافات', 'Those Who Set The Ranks', 'As-Saffat', 'Meccan', 182),
(38, 'ص', 'Sad', 'Sad', 'Meccan', 88),
(39, 'الزمر', 'The Troops', 'Az-Zumar', 'Meccan', 75),
(40, 'غافر', 'The Forgiver', 'Ghafir', 'Meccan', 85),
(41, 'فصلت', 'Explained in Detail', 'Fussilat', 'Meccan', 54),
(42, 'الشورى', 'The Consultation', 'Ash-Shura', 'Meccan', 53),
(43, 'الزخرف', 'The Ornaments of Gold', 'Az-Zukhruf', 'Meccan', 89),
(44, 'الدخان', 'The Smoke', 'Ad-Dukhan', 'Meccan', 59),
(45, 'الجاثية', 'The Crouching', 'Al-Jathiyah', 'Meccan', 37),
(46, 'الأحقاف', 'The Wind-Curved Sandhills', 'Al-Ahqaf', 'Meccan', 35),
(47, 'محمد', 'Muhammad', 'Muhammad', 'Medinan', 38),
(48, 'الفتح', 'The Victory', 'Al-Fath', 'Medinan', 29),
(49, 'الحجرات', 'The Rooms', 'Al-Hujurat', 'Medinan', 18),
(50, 'ق', 'Qaf', 'Qaf', 'Meccan', 45),
(51, 'الذاريات', 'The Winnowing Winds', 'Adh-Dhariyat', 'Meccan', 60),
(52, 'الطور', 'The Mount', 'At-Tur', 'Meccan', 49),
(53, 'النجم', 'The Star', 'An-Najm', 'Meccan', 62),
(54, 'القامر', 'The Moon', 'Al-Qamar', 'Meccan', 55),
(55, 'الرحمن', 'The Beneficent', 'Ar-Rahman', 'Medinan', 78),
(56, 'الواقعة', 'The Inevitable', 'Al-Waqiah', 'Meccan', 96),
(57, 'الحديد', 'The Iron', 'Al-Hadid', 'Medinan', 29),
(58, 'المجادلة', 'The Pleading Woman', 'Al-Mujadila', 'Medinan', 22),
(59, 'الحشر', 'The Exile', 'Al-Hashr', 'Medinan', 24),
(60, 'الممتحنة', 'She That Is Examined', 'Al-Mumtahanah', 'Medinan', 13),
(61, 'الصف', 'The Ranks', 'As-Saf', 'Medinan', 14),
(62, 'الجمعة', 'The Congregation', 'Al-Jumuah', 'Medinan', 11),
(63, 'المنافقون', 'The Hypocrites', 'Al-Munafiqun', 'Medinan', 11),
(64, 'التغابن', 'The Mutual Disillusion', 'At-Taghabun', 'Medinan', 18),
(65, 'الطلاق', 'The Divorce', 'At-Talaq', 'Medinan', 12),
(66, 'التحريم', 'The Prohibition', 'At-Tahrim', 'Medinan', 12),
(67, 'الملك', 'The Sovereignty', 'Al-Mulk', 'Meccan', 30),
(68, 'القلم', 'The Pen', 'Al-Qalam', 'Meccan', 52),
(69, 'الحاقة', 'The Reality', 'Al-Haqqah', 'Meccan', 52),
(70, 'المعارج', 'The Ascending Stairways', 'Al-Maarij', 'Meccan', 44),
(71, 'نوح', 'Noah', 'Nuh', 'Meccan', 28),
(72, 'الجن', 'The Jinn', 'Al-Jinn', 'Meccan', 28),
(73, 'المزمل', 'The Enshrouded One', 'Al-Muzzammil', 'Meccan', 20),
(74, 'المدثر', 'The Cloaked One', 'Al-Muddaththir', 'Meccan', 56),
(75, 'القيامة', 'The Resurrection', 'Al-Qiyamah', 'Meccan', 40),
(76, 'الإنسان', 'The Human', 'Al-Insan', 'Medinan', 31),
(77, 'المرسلات', 'The Emissaries', 'Al-Mursalat', 'Meccan', 50),
(78, 'النبأ', 'The Tidings', 'An-Naba', 'Meccan', 40),
(79, 'النازعات', 'Those Who Drag Forth', 'An-Naziat', 'Meccan', 46),
(80, 'عبس', 'He Frowned', 'Abasa', 'Meccan', 42),
(81, 'التكوير', 'The Overthrowing', 'At-Takwir', 'Meccan', 29),
(82, 'الانفطار', 'The Cleaving', 'Al-Infitar', 'Meccan', 19),
(83, 'المطففين', 'The Defrauding', 'Al-Mutaffifin', 'Meccan', 36),
(84, 'الانشقاق', 'The Sundering', 'Al-Inshiqaq', 'Meccan', 25),
(85, 'البروج', 'The Mansions of the Stars', 'Al-Buruj', 'Meccan', 22),
(86, 'الطارق', 'The Nightcomer', 'At-Tur', 'Meccan', 17),
(87, 'الأعلى', 'The Most High', 'Al-Ala', 'Meccan', 19),
(88, 'الغاشية', 'The Overwhelming', 'Al-Ghashiyah', 'Meccan', 26),
(89, 'الفجر', 'The Dawn', 'Al-Fajr', 'Meccan', 30),
(90, 'البلد', 'The City', 'Al-Balad', 'Meccan', 20),
(91, 'الشمس', 'The Sun', 'Ash-Shams', 'Meccan', 15),
(92, 'الليل', 'The Night', 'Al-Layl', 'Meccan', 21),
(93, 'الضحى', 'The Morning Hours', 'Ad-Duhaa', 'Meccan', 11),
(94, 'الشرح', 'The Relief', 'Ash-Sharh', 'Meccan', 8),
(95, 'التين', 'The Fig', 'At-Tin', 'Meccan', 8),
(96, 'العلق', 'The Clot', 'Al-Alaq', 'Meccan', 19),
(97, 'القدر', 'The Power', 'Al-Qadr', 'Meccan', 5),
(98, 'البينة', 'The Clear Proof', 'Al-Bayyinah', 'Medinan', 8),
(99, 'الزلزلة', 'The Earthquake', 'Az-Zalzalah', 'Medinan', 8),
(100, 'العاديات', 'The Courser', 'Al-Adiyat', 'Meccan', 11),
(101, 'القارعة', 'The Calamity', 'Al-Qariah', 'Meccan', 11),
(102, 'التكاثر', 'The Rivalry in Worldly Increase', 'At-Takathur', 'Meccan', 8),
(103, 'العصر', 'The Declining Day', 'Al-Asr', 'Meccan', 3),
(104, 'الهمزة', 'The Traducer', 'Al-Humazah', 'Meccan', 9),
(105, 'الفيل', 'The Elephant', 'Al-Fil', 'Meccan', 5),
(106, 'قريش', 'Quraysh', 'Quraysh', 'Meccan', 4),
(107, 'الماعون', 'The Small Kindnesses', 'Al-Maun', 'Meccan', 7),
(108, 'الكوثر', 'The Abundance', 'Al-Kawthar', 'Meccan', 3),
(109, 'الكافرون', 'The Disbelievers', 'Al-Kafirun', 'Meccan', 6),
(110, 'النصر', 'The Divine Support', 'An-Nasr', 'Medinan', 3),
(111, 'المسد', 'The Palm Fiber', 'Al-Masad', 'Meccan', 5),
(112, 'الإخلاص', 'The Sincerity', 'Al-Ikhlas', 'Meccan', 4),
(113, 'الفلق', 'The Daybreak', 'Al-Falaq', 'Meccan', 5),
(114, 'الناس', 'Mankind', 'An-Nas', 'Meccan', 6)
ON CONFLICT (number) DO NOTHING;

-- ============================================
-- HADITH BOOKS METADATA
-- ============================================

INSERT INTO hadith_books (slug, arabic_title, english_title, author_arabic, author_english) VALUES
('bukhari', 'صحيح البخاري', 'Sahih al-Bukhari', 'محمد بن إسماعيل البخاري', 'Imam Bukhari'),
('muslim', 'صحيح مسلم', 'Sahih Muslim', 'مسلم بن الحجاج', 'Imam Muslim'),
('abudawud', 'سنن أبي داود', 'Sunan Abu Dawud', 'سليمان بن الأشعث', 'Abu Dawud'),
('tirmidhi', 'جامع الترمذي', 'Jami at-Tirmidhi', 'محمد بن عيسى الترمذي', 'Imam Tirmidhi'),
('nasai', 'سنن النسائي', 'Sunan an-Nasai', 'أحمد بن شعيب النسائي', 'Imam an-Nasai'),
('ibnmajah', 'سنن ابن ماجه', 'Sunan Ibn Majah', 'ابن ماجه القزويني', 'Ibn Majah'),
('malik', 'موطأ مالك', 'Muwatta Malik', 'مالك بن أنس', 'Imam Malik'),
('ahmed', 'مسند أحمد', 'Musnad Ahmad', 'أحمد بن حنبل', 'Imam Ahmad'),
('darimi', 'سنن الدارمي', 'Sunan ad-Darimi', 'عبد الله بن عبد الرحمن الدارمي', 'Imam ad-Darimi'),
('nawawi40', 'الأربعون النووية', 'An-Nawawi Forty Hadith', 'يحيى بن شرف النووي', 'Imam an-Nawawi'),
('qudsi40', 'الأحاديث القدسية', 'Forty Hadith Qudsi', NULL, NULL),
('riyad_assalihin', 'رياض الصالحين', 'Riyad as-Salihin', 'يحيى بن شرف النووي', 'Imam an-Nawawi'),
('bulugh_almaram', 'بلوغ المرام', 'Bulugh al-Maram', 'ابن حجر العسقلاني', 'Ibn Hajar al-Asqalani'),
('mishkat_almasabih', 'مشكاة المصابيح', 'Mishkat al-Masabih', 'الخطيب التبريزي', 'al-Khatib at-Tabrizi'),
('aladab_almufrad', 'الأدب المفرد', 'Al-Adab al-Mufrad', 'محمد بن إسماعيل البخاري', 'Imam Bukhari'),
('shamail_muhammadiyah', 'الشمائل المحمدية', 'Shama''il Muhammadiyah', 'محمد بن عيسى الترمذي', 'Imam Tirmidhi'),
('shahwaliullah40', 'الأربعون حديثا', 'Shah Waliullah Forty Hadith', 'شاه ولي الله', 'Shah Waliullah')
ON CONFLICT (slug) DO NOTHING;
