import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getUser, getDailyChallenge, getAllChallenges, createDailyChallenge, updateDailyChallengeStatus } from "@/lib/supabase/queries"
import { getTodayDateString } from "@/lib/utils/dateHelpers"
import { generateDailyChallenge } from "@/lib/utils/challengeGenerator"
import { getDailyChallengesHistory } from "@/lib/supabase/queries"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userProfile = await getUser(user.id)
    if (!userProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const today = getTodayDateString()
    const currentChallenge = await getDailyChallenge(user.id, today)

    // Mark current challenge as skipped if it exists
    if (currentChallenge && currentChallenge.status === 'pending') {
      await updateDailyChallengeStatus(currentChallenge.id, 'skipped')
    }

    // Generate new challenge
    const allChallenges = await getAllChallenges()
    const history = await getDailyChallengesHistory(user.id, 30)
    const previousIds = history.map(dc => dc.challenge_id)
    
    // Also exclude the current challenge if it exists
    if (currentChallenge) {
      previousIds.push(currentChallenge.challenge_id)
    }

    const challenge = generateDailyChallenge(
      {
        comfortLevel: userProfile.comfort_level,
        focusDomain: userProfile.focus_domain,
        currentVibe: userProfile.current_vibe,
        dayNumber: history.filter(dc => dc.status === 'completed').length + 1,
        previousChallengeIds: previousIds,
      },
      allChallenges
    )

    if (!challenge) {
      return NextResponse.json({ error: "No challenge available" }, { status: 404 })
    }

    // Delete or update existing challenge for today, then create new one
    if (currentChallenge) {
      // Update the existing challenge with new challenge_id
      await supabase
        .from('daily_challenges')
        .update({
          challenge_id: challenge.id,
          status: 'pending',
          completed_at: null,
        })
        .eq('id', currentChallenge.id)
    } else {
      // Create new challenge
      await createDailyChallenge(user.id, challenge.id, today)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error rerolling challenge:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

