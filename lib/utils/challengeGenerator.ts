import { Challenge, ChallengeDomain, Vibe } from "@/types/challenge.types"

interface ChallengeGenerationParams {
  comfortLevel: number // 1-10
  focusDomain: ChallengeDomain
  currentVibe?: Vibe
  dayNumber: number // jour dans la progression
  previousChallengeIds: string[] // éviter répétitions
}

export function getVibeModifier(vibe?: Vibe): number {
  switch(vibe) {
    case 'hard_challenge': return +2
    case 'motivated': return +1
    case 'fun': return 0
    case 'down': return -1
    default: return 0
  }
}

export function generateDailyChallenge(
  params: ChallengeGenerationParams,
  allChallenges: Challenge[]
): Challenge | null {
  // 1. Calculer difficulty_score cible basé sur progression
  const baseTargetDifficulty = params.comfortLevel
  const progressionBonus = Math.floor(params.dayNumber / 7) // +1 difficulty tous les 7 jours
  const vibeModifier = getVibeModifier(params.currentVibe)
  
  const targetDifficulty = Math.min(10, 
    baseTargetDifficulty + progressionBonus + vibeModifier
  )
  
  // 2. Filtrer les challenges par domaine
  const domainChallenges = allChallenges
    .filter(c => c.domain === params.focusDomain)
    .filter(c => !params.previousChallengeIds.includes(c.id))
  
  if (domainChallenges.length === 0) {
    return null
  }
  
  // 3. Trouver le meilleur match de difficulté (±1 de la cible)
  const matchingChallenges = domainChallenges
    .filter(c => Math.abs(c.difficulty_score - targetDifficulty) <= 1)
  
  // 4. Sélection aléatoire parmi les matches
  if (matchingChallenges.length === 0) {
    // Fallback: prendre le plus proche
    const sorted = domainChallenges.sort((a, b) => 
      Math.abs(a.difficulty_score - targetDifficulty) - 
      Math.abs(b.difficulty_score - targetDifficulty)
    )
    return sorted[0]
  }
  
  return matchingChallenges[Math.floor(Math.random() * matchingChallenges.length)]
}

