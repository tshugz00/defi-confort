"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, RefreshCw, Check, AlertCircle } from "lucide-react"
import { DailyChallenge } from "@/types/challenge.types"
import { LEVEL_LABELS } from "@/lib/constants"

interface ChallengeCardProps {
  dailyChallenge: DailyChallenge
  onComplete: () => void
  onSkip: () => void
  onReroll?: () => void
  loading?: boolean
}

export function ChallengeCard({ 
  dailyChallenge, 
  onComplete, 
  onSkip,
  onReroll,
  loading = false 
}: ChallengeCardProps) {
  const challenge = dailyChallenge.challenge
  if (!challenge) return null

  const levelInfo = LEVEL_LABELS[challenge.level]
  const [status, setStatus] = useState<"pending" | "completed" | "skipped">(
    dailyChallenge.status === "completed" ? "completed" : 
    dailyChallenge.status === "skipped" ? "skipped" : 
    "pending"
  )

  const handleDone = async () => {
    setStatus("completed")
    onComplete()
  }

  const handleTooHard = async () => {
    setStatus("skipped")
    onSkip()
    if (onReroll) {
      setTimeout(() => {
        onReroll()
      }, 1500)
    }
  }

  const handleReroll = () => {
    if (onReroll) {
      onReroll()
    }
  }

  return (
    <Card className="w-full max-w-2xl border-2 shadow-xl">
      <CardHeader className="space-y-4 pb-4">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-sm font-medium px-3 py-1">
            Défi du jour
          </Badge>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={levelInfo.color}>
              {levelInfo.emoji} {levelInfo.label}
            </Badge>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{challenge.estimated_minutes} min</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pb-8">
        <div className="min-h-[120px] flex items-center justify-center">
          <h2 className="text-3xl md:text-4xl font-bold text-balance text-center leading-tight">
            {challenge.title}
          </h2>
        </div>

        {challenge.description && (
          <p className="text-center text-muted-foreground text-lg">
            {challenge.description}
          </p>
        )}

        {status === "completed" && (
          <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-medium">
            <Check className="w-5 h-5" />
            <span>Défi accompli !</span>
          </div>
        )}

        {status === "skipped" && (
          <div className="flex items-center justify-center gap-2 text-orange-600 dark:text-orange-400 font-medium">
            <AlertCircle className="w-5 h-5" />
            <span>Nouveau défi en cours...</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            size="lg"
            className="flex-1 text-base font-semibold"
            onClick={handleDone}
            disabled={status === "completed" || loading}
          >
            <Check className="w-5 h-5 mr-2" />
            Done
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="flex-1 text-base font-semibold bg-transparent"
            onClick={handleTooHard}
            disabled={status !== "pending" || loading}
          >
            <AlertCircle className="w-5 h-5 mr-2" />
            Trop dur
          </Button>
          {onReroll && (
            <Button
              size="lg"
              variant="outline"
              className="flex-1 text-base font-semibold bg-transparent"
              onClick={handleReroll}
              disabled={status !== "pending" || loading}
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Reroll
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
