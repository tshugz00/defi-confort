import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUser, getDailyChallengesHistory } from "@/lib/supabase/queries"
import { calculateStreak } from "@/lib/utils/streakCalculator"
import ProfileClient from "./ProfileClient"

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/onboarding")
  }

  const userProfile = await getUser(user.id)
  if (!userProfile) {
    redirect("/onboarding")
  }

  const history = await getDailyChallengesHistory(user.id, 30)
  const streakData = calculateStreak(history)

  const stats = {
    current_streak: streakData.current_streak,
    longest_streak: streakData.longest_streak,
    total_completed: history.filter(h => h.status === 'completed').length,
    total_skipped: history.filter(h => h.status === 'skipped').length,
    completion_rate: history.length > 0
      ? (history.filter(h => h.status === 'completed').length / history.length) * 100
      : 0,
  }

  return <ProfileClient user={userProfile} stats={stats} />
}

