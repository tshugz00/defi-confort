"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

const objectives = [
  { id: "social", label: "Social / oser parler aux gens" },
  { id: "confidence", label: "Confiance en soi / vulnérabilité" },
  { id: "novelty", label: "Nouvelles expériences / nouveauté" },
  { id: "procrastination", label: "Procrastination / trucs repoussés" },
  { id: "physical", label: "Corps / physique" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [sliderValue, setSliderValue] = useState([5])
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const handleCheckboxChange = (objectiveId: string, checked: boolean) => {
    if (checked) {
      setSelectedObjectives([...selectedObjectives, objectiveId])
    } else {
      setSelectedObjectives(selectedObjectives.filter((id) => id !== objectiveId))
    }
  }

  const handleSubmit = async () => {
    if (selectedObjectives.length === 0) {
      alert("Veuillez sélectionner au moins un objectif")
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      
      // Sign in anonymously
      const { data: { user }, error: authError } = await supabase.auth.signInAnonymously()
      
      if (authError || !user) {
        console.error("Auth error:", authError)
        alert("Erreur lors de la connexion. Veuillez réessayer.")
        return
      }

      // Use the first selected objective as the primary focus domain
      const focusDomain = selectedObjectives[0]

      // Create user profile
      const { error: profileError } = await supabase
        .from("users")
        .insert({
          id: user.id,
          comfort_level: sliderValue[0],
          focus_domain: focusDomain,
          notification_time: "09:00",
          notifications_enabled: true,
        })

      if (profileError) {
        console.error("Profile error:", profileError)
        alert("Erreur lors de la création du profil. Veuillez réessayer.")
        return
      }

      router.push("/home")
    } catch (error) {
      console.error("Error:", error)
      alert("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
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
            disabled={loading || selectedObjectives.length === 0}
          >
            {loading ? "Chargement..." : "Valider et continuer"}
          </Button>
        </div>
      </div>
    </div>
  )
}
