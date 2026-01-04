import { DailyChallenge } from "@/types/challenge.types"
import { format, differenceInDays, startOfDay } from "date-fns"

export function calculateStreak(dailyChallenges: DailyChallenge[]): {
  current_streak: number
  longest_streak: number
  last_completion_date?: string
} {
  const completed = dailyChallenges
    .filter(c => c.status === 'completed' && c.completed_at)
    .sort((a, b) => {
      const dateA = new Date(a.assigned_date)
      const dateB = new Date(b.assigned_date)
      return dateB.getTime() - dateA.getTime()
    })

  if (completed.length === 0) {
    return { current_streak: 0, longest_streak: 0 }
  }

  // Calculate current streak
  let currentStreak = 0
  const today = startOfDay(new Date())
  let lastDate: Date | null = null

  for (const challenge of completed) {
    const challengeDate = startOfDay(new Date(challenge.assigned_date))
    
    if (lastDate === null) {
      const daysDiff = differenceInDays(today, challengeDate)
      if (daysDiff === 0 || daysDiff === 1) {
        currentStreak = 1
        lastDate = challengeDate
      } else {
        break
      }
    } else {
      const daysDiff = differenceInDays(lastDate, challengeDate)
      if (daysDiff === 1) {
        currentStreak++
        lastDate = challengeDate
      } else {
        break
      }
    }
  }

  // Calculate longest streak
  let longestStreak = 1
  let tempStreak = 1
  let prevDate: Date | null = null

  for (const challenge of completed) {
    const challengeDate = startOfDay(new Date(challenge.assigned_date))
    
    if (prevDate === null) {
      prevDate = challengeDate
    } else {
      const daysDiff = differenceInDays(prevDate, challengeDate)
      if (daysDiff === 1) {
        tempStreak++
        longestStreak = Math.max(longestStreak, tempStreak)
      } else {
        tempStreak = 1
      }
      prevDate = challengeDate
    }
  }

  return {
    current_streak: currentStreak,
    longest_streak: longestStreak,
    last_completion_date: completed[0]?.assigned_date,
  }
}

