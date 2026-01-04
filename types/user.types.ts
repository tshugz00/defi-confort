import { ChallengeDomain, Vibe } from './challenge.types';

export interface User {
  id: string;
  comfort_level: number; // 1-10
  focus_domain: ChallengeDomain;
  current_vibe?: Vibe;
  notification_time: string; // "09:00"
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  comfort_level: number;
  focus_domain: ChallengeDomain;
  current_vibe?: Vibe;
  notification_time: string;
  notifications_enabled: boolean;
}

