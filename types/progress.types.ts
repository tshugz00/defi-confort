export interface Streak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_completion_date?: string;
  total_completed: number;
  total_skipped: number;
  updated_at: string;
}

export interface UserStats {
  current_streak: number;
  longest_streak: number;
  total_completed: number;
  total_skipped: number;
  completion_rate: number; // percentage
}

