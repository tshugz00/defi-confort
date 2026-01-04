"use client"

import { format, subDays, startOfDay, isToday, isPast } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChallengeStatus } from "@/types/challenge.types"
import { Check, Flame } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalendarDay {
  date: Date
  status?: ChallengeStatus
  dayNumber: number
}

interface CalendarGridProps {
  dailyChallenges: Array<{ assigned_date: string; status: ChallengeStatus }>
  currentStreak?: number
}

export function CalendarGrid({ dailyChallenges, currentStreak: propStreak }: CalendarGridProps) {
  const days: CalendarDay[] = Array.from({ length: 14 }, (_, i) => {
    const date = subDays(new Date(), 13 - i)
    const dateStr = format(date, 'yyyy-MM-dd')
    const challenge = dailyChallenges.find(c => c.assigned_date === dateStr)
    
    return {
      date,
      status: challenge?.status,
      dayNumber: i + 1,
    }
  })

  // Use provided streak or calculate from completed days
  const currentStreak = propStreak ?? days.filter((d) => d.status === 'completed').length

  const getStatusIcon = (day: CalendarDay) => {
    if (!isPast(day.date) && !isToday(day.date)) {
      return null
    }
    
    if (day.status === 'completed') {
      return <Check className="h-6 w-6 text-accent-foreground" strokeWidth={3} />
    }
    
    return <div className="h-3 w-3 rounded-full bg-muted-foreground/30" />
  }

  const getStatusColor = (day: CalendarDay) => {
    if (!isPast(day.date) && !isToday(day.date)) {
      return 'bg-secondary'
    }
    
    switch (day.status) {
      case 'completed':
        return 'bg-accent shadow-md'
      case 'skipped':
        return 'bg-destructive/20'
      case 'postponed':
        return 'bg-orange-100 dark:bg-orange-900/20'
      default:
        return 'bg-secondary'
    }
  }

  return (
    <Card className="w-full max-w-2xl bg-card shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-card-foreground">Calendrier de Streak</CardTitle>
          <div className="flex items-center gap-2 rounded-full bg-primary px-4 py-2">
            <Flame className="h-5 w-5 text-primary-foreground" />
            <span className="text-xl font-bold text-primary-foreground">{currentStreak}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Continuez votre série quotidienne</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-3">
          {days.map((day, index) => (
            <div
              key={index}
              className={cn(
                "relative flex flex-col items-center justify-center rounded-lg p-4 transition-all duration-200",
                getStatusColor(day),
                isToday(day.date) && "ring-2 ring-primary ring-offset-2 ring-offset-background",
              )}
            >
              <span
                className={cn(
                  "text-xs font-semibold mb-2",
                  day.status === 'completed' ? "text-accent-foreground" : "text-muted-foreground",
                )}
              >
                Jour {day.dayNumber}
              </span>
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                  day.status === 'completed' ? "bg-accent-foreground/10" : "bg-muted",
                )}
              >
                {getStatusIcon(day)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between rounded-lg bg-secondary p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
              <Flame className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Série actuelle</p>
              <p className="text-xs text-muted-foreground">Continuez comme ça !</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-foreground">{currentStreak}</p>
            <p className="text-xs text-muted-foreground">jours</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
