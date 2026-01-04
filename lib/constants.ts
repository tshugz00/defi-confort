import { ChallengeDomain, Vibe } from '@/types/challenge.types';

export const DOMAIN_LABELS: Record<ChallengeDomain, string> = {
  social: 'Social / Oser parler aux gens',
  confidence: 'Confiance en soi / Vulnérabilité',
  novelty: 'Nouvelles expériences / Nouveauté',
  procrastination: 'Procrastination / Trucs repoussés',
  physical: 'Corps / Physique',
};

export const VIBE_LABELS: Record<Vibe, { label: string; emoji: string }> = {
  motivated: { label: 'Motivé', emoji: '💪' },
  down: { label: 'Un peu down', emoji: '😔' },
  fun: { label: "J'veux du fun", emoji: '🎉' },
  hard_challenge: { label: "J'veux du challenge hard", emoji: '🔥' },
};

export const LEVEL_LABELS: Record<string, { label: string; emoji: string; color: string }> = {
  beginner: { label: 'Débutant', emoji: '🟢', color: 'text-green-600' },
  intermediate: { label: 'Intermédiaire', emoji: '🟡', color: 'text-yellow-600' },
  spicy: { label: 'Spicy', emoji: '🔴', color: 'text-red-600' },
};

export const COMFORT_LEVEL_LABELS: Record<number, string> = {
  1: 'Très confortable',
  2: 'Confortable',
  3: 'Assez confortable',
  4: 'Légèrement sorti',
  5: 'Modérément sorti',
  6: 'Sorti',
  7: 'Bien sorti',
  8: 'Très sorti',
  9: 'Extrêmement sorti',
  10: 'Maximum',
};

