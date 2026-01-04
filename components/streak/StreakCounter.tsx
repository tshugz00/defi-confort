"use client"

import { Streak } from "@/types/progress.types"
import { Card, CardContent } from "@/components/ui/card"
import { Flame } from "lucide-react"

interface StreakCounterProps {
  streak: Streak
}

export function StreakCounter({ streak }: StreakCounterProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-center gap-3">
          <Flame className="h-8 w-8 text-orange-500" />
          <div className="text-center">
            <div className="text-4xl font-bold">{streak.current_streak}</div>
            <div className="text-sm text-muted-foreground">
              {streak.current_streak === 1 ? 'jour' : 'jours'} de suite
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

