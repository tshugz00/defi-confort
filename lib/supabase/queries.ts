import { createClient } from "./server"
import { getTodayDateString } from "@/lib/utils/dateHelpers"
import { Challenge, DailyChallenge, ChallengeLog } from "@/types/challenge.types"
import { User } from "@/types/user.types"
import { Streak } from "@/types/progress.types"

// User queries
export async function getUser(userId: string): Promise<User | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error || !data) return null
  return data as User
}

export async function createUser(userId: string, preferences: {
  comfort_level: number
  focus_domain: string
  current_vibe?: string
}): Promise<User | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('users')
    .insert({
      id: userId,
      comfort_level: preferences.comfort_level,
      focus_domain: preferences.focus_domain,
      current_vibe: preferences.current_vibe || null,
      notification_time: '09:00',
      notifications_enabled: true,
    })
    .select()
    .single()

  if (error || !data) return null
  return data as User
}

export async function updateUserPreferences(
  userId: string,
  preferences: Partial<{
    comfort_level: number
    focus_domain: string
    current_vibe: string
    notification_time: string
    notifications_enabled: boolean
  }>
): Promise<User | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('users')
    .update({
      ...preferences,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single()

  if (error || !data) return null
  return data as User
}

// Challenge queries
export async function getDailyChallenge(
  userId: string,
  date?: string
): Promise<DailyChallenge | null> {
  const supabase = await createClient()
  const targetDate = date || getTodayDateString()
  
  const { data, error } = await supabase
    .from('daily_challenges')
    .select(`
      *,
      challenge:challenges(*)
    `)
    .eq('user_id', userId)
    .eq('assigned_date', targetDate)
    .single()

  if (error || !data) return null
  return data as DailyChallenge
}

export async function getAllChallenges(): Promise<Challenge[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('challenges')
    .select('*')

  if (error || !data) return []
  return data as Challenge[]
}

export async function createDailyChallenge(
  userId: string,
  challengeId: string,
  date: string
): Promise<DailyChallenge | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('daily_challenges')
    .insert({
      user_id: userId,
      challenge_id: challengeId,
      assigned_date: date,
      status: 'pending',
    })
    .select(`
      *,
      challenge:challenges(*)
    `)
    .single()

  if (error || !data) return null
  return data as DailyChallenge
}

export async function updateDailyChallengeStatus(
  dailyChallengeId: string,
  status: 'completed' | 'skipped' | 'postponed'
): Promise<DailyChallenge | null> {
  const supabase = await createClient()
  const updateData: any = {
    status,
    updated_at: new Date().toISOString(),
  }
  
  if (status === 'completed') {
    updateData.completed_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('daily_challenges')
    .update(updateData)
    .eq('id', dailyChallengeId)
    .select(`
      *,
      challenge:challenges(*)
    `)
    .single()

  if (error || !data) return null
  return data as DailyChallenge
}

export async function getDailyChallengesHistory(
  userId: string,
  days: number = 30
): Promise<DailyChallenge[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('daily_challenges')
    .select(`
      *,
      challenge:challenges(*)
    `)
    .eq('user_id', userId)
    .order('assigned_date', { ascending: false })
    .limit(days)

  if (error || !data) return []
  return data as DailyChallenge[]
}

// Challenge Log queries
export async function createChallengeLog(
  dailyChallengeId: string,
  userId: string,
  logData: {
    note?: string
    mood?: string
    photo_url?: string
  }
): Promise<ChallengeLog | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('challenge_logs')
    .insert({
      daily_challenge_id: dailyChallengeId,
      user_id: userId,
      ...logData,
    })
    .select()
    .single()

  if (error || !data) return null
  return data as ChallengeLog
}

// Streak queries
export async function getStreak(userId: string): Promise<Streak | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('streaks')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error || !data) return null
  return data as Streak
}

export async function updateStreak(
  userId: string,
  streakData: Partial<Streak>
): Promise<Streak | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('streaks')
    .upsert({
      user_id: userId,
      ...streakData,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error || !data) return null
  return data as Streak
}

