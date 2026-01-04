import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { updateDailyChallengeStatus, createChallengeLog, getDailyChallenge } from "@/lib/supabase/queries"
import { getDailyChallengesHistory, updateStreak } from "@/lib/supabase/queries"
import { calculateStreak } from "@/lib/utils/streakCalculator"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const dailyChallengeId = formData.get("dailyChallengeId") as string
    const note = formData.get("note") as string | null
    const mood = formData.get("mood") as string | null
    const photo = formData.get("photo") as File | null

    // Update challenge status
    const updatedChallenge = await updateDailyChallengeStatus(dailyChallengeId, "completed")
    if (!updatedChallenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 })
    }

    // Handle photo upload if provided
    let photoUrl: string | undefined
    if (photo) {
      const fileExt = photo.name.split('.').pop()
      const fileName = `${user.id}/${dailyChallengeId}.${fileExt}`
      const { data, error } = await supabase.storage
        .from('challenge-photos')
        .upload(fileName, photo)

      if (!error && data) {
        const { data: urlData } = supabase.storage
          .from('challenge-photos')
          .getPublicUrl(data.path)
        photoUrl = urlData.publicUrl
      }
    }

    // Create log entry
    await createChallengeLog(dailyChallengeId, user.id, {
      note: note || undefined,
      mood: mood || undefined,
      photo_url: photoUrl,
    })

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
    console.error("Error completing challenge:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

