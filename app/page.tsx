"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

const objectives = [
  { id: "performance", label: "Améliorer mes performances" },
  { id: "team", label: "Travailler en équipe" },
  { id: "learning", label: "Apprendre de nouvelles compétences" },
  { id: "innovation", label: "Innover et créer" },
  { id: "leadership", label: "Développer mon leadership" },
]

export default function HomePage() {
  const router = useRouter()
  const [sliderValue, setSliderValue] = useState([5])
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        router.push('/home')
      } else {
        setCheckingAuth(false)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setCheckingAuth(false)
    }
  }

  const handleCheckboxChange = (objectiveId: string, checked: boolean) => {
    if (checked) {
      setSelectedObjectives([...selectedObjectives, objectiveId])
    } else {
      setSelectedObjectives(selectedObjectives.filter((id) => id !== objectiveId))
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      
      // Sign in anonymously
      const { data: { user }, error: authError } = await supabase.auth.signInAnonymously()
      
      if (authError || !user) {
        console.error('Auth error:', authError)
        return
      }

      // Create user profile with default domain (we'll use the first objective or a default)
      const defaultDomain = selectedObjectives.length > 0 ? 'social' : 'novelty'
      
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          comfort_level: sliderValue[0],
          focus_domain: defaultDomain,
          current_vibe: null,
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

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-3 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-balance">Bienvenue</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Personnalisez votre expérience en quelques étapes simples
            </p>
          </div>

          {/* Slider Section */}
          <div className="space-y-6 rounded-xl border border-border bg-card p-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="experience-slider" className="text-base font-medium">
                  Niveau d'expérience
                </Label>
                <span className="text-3xl font-bold tabular-nums">{sliderValue[0]}</span>
              </div>
              <p className="text-sm text-muted-foreground">Évaluez votre niveau actuel sur une échelle de 1 à 10</p>
            </div>

            <div className="pt-4 pb-2">
              <Slider
                id="experience-slider"
                min={1}
                max={10}
                step={1}
                value={sliderValue}
                onValueChange={setSliderValue}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-3">
                <span>Débutant</span>
                <span>Expert</span>
              </div>
            </div>
          </div>

          {/* Objectives Section */}
          <div className="space-y-6 rounded-xl border border-border bg-card p-8">
            <div className="space-y-2">
              <Label className="text-base font-medium">Vos objectifs</Label>
              <p className="text-sm text-muted-foreground">Sélectionnez les objectifs qui vous correspondent</p>
            </div>

            <div className="space-y-4">
              {objectives.map((objective) => (
                <div
                  key={objective.id}
                  className="flex items-center space-x-3 rounded-lg border border-border/50 p-4 transition-colors hover:bg-accent/50"
                >
                  <Checkbox
                    id={objective.id}
                    checked={selectedObjectives.includes(objective.id)}
                    onCheckedChange={(checked) => handleCheckboxChange(objective.id, checked as boolean)}
                  />
                  <Label
                    htmlFor={objective.id}
                    className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {objective.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit} 
            size="lg" 
            className="w-full h-12 text-base font-medium"
            disabled={loading}
          >
            {loading ? "Chargement..." : "Valider et continuer"}
          </Button>
        </div>
      </div>
    </div>
  )
}
