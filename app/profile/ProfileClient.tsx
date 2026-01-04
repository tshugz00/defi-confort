"use client"

import { useRouter } from "next/navigation"
import { User } from "@/types/user.types"
import { UserStats } from "@/types/progress.types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatsDisplay } from "@/components/streak/StatsDisplay"
import { DOMAIN_LABELS, COMFORT_LEVEL_LABELS } from "@/lib/constants"
import { ArrowLeft } from "lucide-react"

interface ProfileClientProps {
  user: User
  stats: UserStats
}

export default function ProfileClient({ user, stats }: ProfileClientProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Profil</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mes préférences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Niveau de confort</div>
              <div className="font-medium">
                {user.comfort_level}/10 - {COMFORT_LEVEL_LABELS[user.comfort_level as keyof typeof COMFORT_LEVEL_LABELS]}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Domaine principal</div>
              <div className="font-medium">{DOMAIN_LABELS[user.focus_domain]}</div>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push('/settings')}
              className="w-full"
            >
              Modifier les préférences
            </Button>
          </CardContent>
        </Card>

        <StatsDisplay stats={stats} />
      </div>
    </div>
  )
}

