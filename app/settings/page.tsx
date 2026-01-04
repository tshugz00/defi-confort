import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUser } from "@/lib/supabase/queries"
import SettingsClient from "./SettingsClient"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/onboarding")
  }

  const userProfile = await getUser(user.id)
  if (!userProfile) {
    redirect("/onboarding")
  }

  return <SettingsClient user={userProfile} />
}

