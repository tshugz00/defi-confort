-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    comfort_level INTEGER CHECK(comfort_level BETWEEN 1 AND 10) DEFAULT 5,
    focus_domain TEXT CHECK(focus_domain IN ('social', 'confidence', 'novelty', 'procrastination', 'physical')) NOT NULL,
    current_vibe TEXT CHECK(current_vibe IN ('motivated', 'down', 'fun', 'hard_challenge')),
    notification_time TEXT DEFAULT '09:00',
    notifications_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: challenges
CREATE TABLE IF NOT EXISTS challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    domain TEXT NOT NULL CHECK(domain IN ('social', 'confidence', 'novelty', 'procrastination', 'physical')),
    level TEXT CHECK(level IN ('beginner', 'intermediate', 'spicy')) NOT NULL,
    estimated_minutes INTEGER NOT NULL,
    difficulty_score INTEGER CHECK(difficulty_score BETWEEN 1 AND 10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: daily_challenges
CREATE TABLE IF NOT EXISTS daily_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    assigned_date DATE NOT NULL,
    status TEXT CHECK(status IN ('pending', 'completed', 'skipped', 'postponed')) DEFAULT 'pending',
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, assigned_date)
);

-- Table: challenge_logs
CREATE TABLE IF NOT EXISTS challenge_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    daily_challenge_id UUID NOT NULL REFERENCES daily_challenges(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    note TEXT,
    mood TEXT CHECK(mood IN ('happy', 'neutral', 'sad')),
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: streaks
CREATE TABLE IF NOT EXISTS streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_completion_date DATE,
    total_completed INTEGER DEFAULT 0,
    total_skipped INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_daily_challenges_user_date ON daily_challenges(user_id, assigned_date);
CREATE INDEX IF NOT EXISTS idx_challenge_logs_user ON challenge_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_challenges_domain ON challenges(domain, difficulty_score);
CREATE INDEX IF NOT EXISTS idx_daily_challenges_status ON daily_challenges(user_id, status);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;

-- Users can only see/update their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Challenges are public (read-only for users)
CREATE POLICY "Challenges are viewable by everyone" ON challenges
    FOR SELECT USING (true);

-- Daily challenges
CREATE POLICY "Users can view own daily challenges" ON daily_challenges
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily challenges" ON daily_challenges
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily challenges" ON daily_challenges
    FOR UPDATE USING (auth.uid() = user_id);

-- Challenge logs
CREATE POLICY "Users can view own challenge logs" ON challenge_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own challenge logs" ON challenge_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Streaks
CREATE POLICY "Users can view own streak" ON streaks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streak" ON streaks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streak" ON streaks
    FOR UPDATE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for streaks table
CREATE TRIGGER update_streaks_updated_at BEFORE UPDATE ON streaks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

