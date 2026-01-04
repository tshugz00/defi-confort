"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChallengeCard } from "@/components/challenge/ChallengeCard"
import { MiniJournal } from "@/components/challenge/MiniJournal"
import { StreakCounter } from "@/components/streak/StreakCounter"
import { CalendarGrid } from "@/components/streak/CalendarGrid"
import { StatsDisplay } from "@/components/streak/StatsDisplay"
import { DailyChallenge } from "@/types/challenge.types"
import { Button } from "@/components/ui/button"
import { User, Settings } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface HomeClientProps {
  dailyChallenge: DailyChallenge | null
  streak: { current_streak: number; longest_streak: number; last_completion_date?: string }
  history: DailyChallenge[]
}

export default function HomeClient({ dailyChallenge, streak, history }: HomeClientProps) {
  const router = useRouter()
  const [showJournal, setShowJournal] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleComplete = async () => {
    if (!dailyChallenge) return
    setShowJournal(true)
  }

  const handleSkip = async () => {
    if (!dailyChallenge || loading) return
    setLoading(true)
    try {
      const response = await fetch('/api/challenges/skip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dailyChallengeId: dailyChallenge.id }),
      })
      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Error skipping challenge:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReroll = async () => {
    if (!dailyChallenge || loading) return
    setLoading(true)
    try {
      const response = await fetch('/api/challenges/reroll', {
        method: 'POST',
      })
      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Error rerolling challenge:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleJournalSave = async (data: { note?: string; mood?: string; photo?: File }) => {
    if (!dailyChallenge || loading) return
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('dailyChallengeId', dailyChallenge.id)
      if (data.note) formData.append('note', data.note)
      if (data.mood) formData.append('mood', data.mood)
      if (data.photo) formData.append('photo', data.photo)

      const response = await fetch('/api/challenges/complete', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        router.refresh()
        setShowJournal(false)
      }
    } catch (error) {
      console.error('Error completing challenge:', error)
    } finally {
      setLoading(false)
    }
  }

  const streakForDisplay = {
    id: 'current',
    user_id: '',
    current_streak: streak.current_streak,
    longest_streak: streak.longest_streak,
    last_completion_date: streak.last_completion_date,
    total_completed: history.filter(h => h.status === 'completed').length,
    total_skipped: history.filter(h => h.status === 'skipped').length,
    updated_at: new Date().toISOString(),
  }

  const stats = {
    current_streak: streak.current_streak,
    longest_streak: streak.longest_streak,
    total_completed: streakForDisplay.total_completed,
    total_skipped: streakForDisplay.total_skipped,
    completion_rate: history.length > 0
      ? (streakForDisplay.total_completed / history.length) * 100
      : 0,
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Défi du jour</h1>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/profile')}
            >
              <User className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/settings')}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Streak Counter */}
        <StreakCounter streak={streakForDisplay} />

        {/* Challenge Card */}
        {dailyChallenge && !showJournal && (
          <ChallengeCard
            dailyChallenge={dailyChallenge}
            onComplete={handleComplete}
            onSkip={handleSkip}
            onReroll={handleReroll}
            loading={loading}
          />
        )}

        {/* Journal */}
        {showJournal && (
          <MiniJournal onSave={handleJournalSave} />
        )}

        {/* Calendar Grid */}
        <CalendarGrid 
          dailyChallenges={history.map(h => ({
            assigned_date: h.assigned_date,
            status: h.status,
          }))}
          currentStreak={streak.current_streak}
        />

        {/* Stats */}
        <StatsDisplay stats={stats} />
      </div>
    </div>
  )
}

