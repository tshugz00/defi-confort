import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUser, getDailyChallenge, getAllChallenges, createDailyChallenge } from "@/lib/supabase/queries"
import { getTodayDateString } from "@/lib/utils/dateHelpers"
import { generateDailyChallenge } from "@/lib/utils/challengeGenerator"
import { getDailyChallengesHistory } from "@/lib/supabase/queries"
import { calculateStreak } from "@/lib/utils/streakCalculator"
import HomeClient from "./HomeClient"

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/onboarding")
  }

  const userProfile = await getUser(user.id)
  if (!userProfile) {
    redirect("/onboarding")
  }

  // Get or create today's challenge
  let dailyChallenge = await getDailyChallenge(user.id)
  const today = getTodayDateString()

  if (!dailyChallenge) {
    // Generate new challenge
    const allChallenges = await getAllChallenges()
    const history = await getDailyChallengesHistory(user.id, 30)
    const previousIds = history.map(dc => dc.challenge_id)

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

    if (challenge) {
      dailyChallenge = await createDailyChallenge(user.id, challenge.id, today)
    }
  }

  // Get history for streak calculation
  const history = await getDailyChallengesHistory(user.id, 14)
  const streakData = calculateStreak(history)

  return (
    <HomeClient
      dailyChallenge={dailyChallenge}
      streak={streakData}
      history={history}
    />
  )
}

