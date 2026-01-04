"use client"

import { Vibe } from "@/types/challenge.types"
import { VIBE_LABELS } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface VibeSelectorProps {
  selectedVibe?: Vibe
  onSelect: (vibe: Vibe) => void
  onSkip: () => void
}

const vibes: Vibe[] = ['motivated', 'down', 'fun', 'hard_challenge']

export function VibeSelector({ selectedVibe, onSelect, onSkip }: VibeSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {vibes.map((vibe) => {
          const { label, emoji } = VIBE_LABELS[vibe]
          return (
            <Card
              key={vibe}
              className={`cursor-pointer transition-all ${
                selectedVibe === vibe
                  ? 'border-primary bg-primary/5'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => onSelect(vibe)}
            >
              <div className="p-4 flex items-center gap-3">
                <span className="text-2xl">{emoji}</span>
                <div className="font-medium">{label}</div>
              </div>
            </Card>
          )
        })}
      </div>
      <Button variant="ghost" onClick={onSkip} className="w-full">
        Passer cette étape
      </Button>
    </div>
  )
}

