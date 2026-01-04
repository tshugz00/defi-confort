import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { updateUserPreferences } from "@/lib/supabase/queries"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const preferences = await request.json()
    const updated = await updateUserPreferences(user.id, preferences)

    if (!updated) {
      return NextResponse.json({ error: "Failed to update" }, { status: 500 })
    }

    return NextResponse.json({ success: true, user: updated })
  } catch (error) {
    console.error("Error updating preferences:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

