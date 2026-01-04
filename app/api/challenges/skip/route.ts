import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { updateDailyChallengeStatus, getDailyChallengesHistory, updateStreak } from "@/lib/supabase/queries"
import { calculateStreak } from "@/lib/utils/streakCalculator"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { dailyChallengeId } = await request.json()

    // Update challenge status
    await updateDailyChallengeStatus(dailyChallengeId, "skipped")

    // Update streak
    const history = await getDailyChallengesHistory(user.id, 30)
    const streakData = calculateStreak(history)
    await updateStreak(user.id, {
      current_streak: streakData.current_streak,
      longest_streak: streakData.longest_streak,
      last_completion_date: streakData.last_completion_date,
      total_completed: history.filter(h => h.status === 'completed').length,
      total_skipped: history.filter(h => h.status === 'skipped').length,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error skipping challenge:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

