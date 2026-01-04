import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete all user data
    await supabase.from('challenge_logs').delete().eq('user_id', user.id)
    await supabase.from('daily_challenges').delete().eq('user_id', user.id)
    await supabase.from('streaks').delete().eq('user_id', user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error resetting progress:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

