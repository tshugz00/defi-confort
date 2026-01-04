export type ChallengeDomain = 'social' | 'confidence' | 'novelty' | 'procrastination' | 'physical';
export type ChallengeLevel = 'beginner' | 'intermediate' | 'spicy';
export type ChallengeStatus = 'pending' | 'completed' | 'skipped' | 'postponed';
export type Mood = 'happy' | 'neutral' | 'sad';
export type Vibe = 'motivated' | 'down' | 'fun' | 'hard_challenge';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  domain: ChallengeDomain;
  level: ChallengeLevel;
  estimated_minutes: number;
  difficulty_score: number; // 1-10
  created_at: string;
}

export interface DailyChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  assigned_date: string; // YYYY-MM-DD
  status: ChallengeStatus;
  completed_at?: string;
  created_at: string;
  challenge?: Challenge;
}

export interface ChallengeLog {
  id: string;
  daily_challenge_id: string;
  user_id: string;
  note?: string;
  mood?: Mood;
  photo_url?: string;
  created_at: string;
}

