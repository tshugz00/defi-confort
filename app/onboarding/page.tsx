"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ComfortSlider } from "@/components/onboarding/ComfortSlider"
import { DomainSelector } from "@/components/onboarding/DomainSelector"
import { VibeSelector } from "@/components/onboarding/VibeSelector"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChallengeDomain, Vibe } from "@/types/challenge.types"
import { createClient } from "@/lib/supabase/client"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [comfortLevel, setComfortLevel] = useState(5)
  const [selectedDomain, setSelectedDomain] = useState<ChallengeDomain | undefined>()
  const [selectedVibe, setSelectedVibe] = useState<Vibe | undefined>()
  const [loading, setLoading] = useState(false)

  const handleComplete = async () => {
    if (!selectedDomain) return

    setLoading(true)
    try {
      const supabase = createClient()
      
      // Sign in anonymously
      const { data: { user }, error: authError } = await supabase.auth.signInAnonymously()
      
      if (authError || !user) {
        console.error('Auth error:', authError)
        return
      }

      // Create user profile
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          comfort_level: comfortLevel,
          focus_domain: selectedDomain,
          current_vibe: selectedVibe || null,
          notification_time: '09:00',
          notifications_enabled: true,
        })
        .select()
        .single()

      if (!profileError && userProfile) {
        router.push('/home')
      }
    } catch (error) {
      console.error('Error during onboarding:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {step === 1 && "Quel est ton niveau de confort ?"}
            {step === 2 && "Quel domaine t'intéresse ?"}
            {step === 3 && "Quelle est ta vibe du moment ?"}
          </CardTitle>
          <CardDescription className="text-center">
            {step === 1 && "Glisse pour ajuster ton niveau"}
            {step === 2 && "Choisis un domaine principal"}
            {step === 3 && "Optionnel - Skip si tu veux"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <ComfortSlider value={comfortLevel} onChange={setComfortLevel} />
          )}
          
          {step === 2 && (
            <DomainSelector
              selectedDomain={selectedDomain}
              onSelect={setSelectedDomain}
            />
          )}
          
          {step === 3 && (
            <VibeSelector
              selectedVibe={selectedVibe}
              onSelect={setSelectedVibe}
              onSkip={() => setSelectedVibe(undefined)}
            />
          )}

          <div className="flex gap-2">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1"
              >
                Précédent
              </Button>
            )}
            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={step === 2 && !selectedDomain}
                className="flex-1"
              >
                Suivant
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={loading || !selectedDomain}
                className="flex-1"
              >
                {loading ? "Création..." : "Commencer"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

