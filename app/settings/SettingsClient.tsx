"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User } from "@/types/user.types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { ComfortSlider } from "@/components/onboarding/ComfortSlider"
import { DomainSelector } from "@/components/onboarding/DomainSelector"
import { VibeSelector } from "@/components/onboarding/VibeSelector"
import { ChallengeDomain, Vibe } from "@/types/challenge.types"
import { ArrowLeft, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface SettingsClientProps {
  user: User
}

export default function SettingsClient({ user: initialUser }: SettingsClientProps) {
  const router = useRouter()
  const [user, setUser] = useState(initialUser)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleUpdatePreferences = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comfort_level: user.comfort_level,
          focus_domain: user.focus_domain,
          current_vibe: user.current_vibe,
          notification_time: user.notification_time,
          notifications_enabled: user.notifications_enabled,
        }),
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Error updating preferences:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResetProgress = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/reset', {
        method: 'POST',
      })

      if (response.ok) {
        router.push('/home')
      }
    } catch (error) {
      console.error('Error resetting progress:', error)
    } finally {
      setLoading(false)
      setShowResetDialog(false)
    }
  }

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
          <h1 className="text-2xl font-bold">Paramètres</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Préférences</CardTitle>
            <CardDescription>Modifie tes préférences d'onboarding</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="mb-4 block">Niveau de confort</Label>
              <ComfortSlider
                value={user.comfort_level}
                onChange={(value) => setUser({ ...user, comfort_level: value })}
              />
            </div>

            <div>
              <Label className="mb-4 block">Domaine principal</Label>
              <DomainSelector
                selectedDomain={user.focus_domain}
                onSelect={(domain) => setUser({ ...user, focus_domain: domain })}
              />
            </div>

            <div>
              <Label className="mb-4 block">Vibe du moment</Label>
              <VibeSelector
                selectedVibe={user.current_vibe}
                onSelect={(vibe) => setUser({ ...user, current_vibe: vibe })}
                onSkip={() => setUser({ ...user, current_vibe: undefined })}
              />
            </div>

            <Button onClick={handleUpdatePreferences} disabled={loading} className="w-full">
              {loading ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Activer les notifications</Label>
              <Switch
                id="notifications"
                checked={user.notifications_enabled}
                onCheckedChange={(checked) =>
                  setUser({ ...user, notifications_enabled: checked })
                }
              />
            </div>
            {user.notifications_enabled && (
              <div>
                <Label htmlFor="notification-time">Heure de notification</Label>
                <Input
                  id="notification-time"
                  type="time"
                  value={user.notification_time}
                  onChange={(e) => setUser({ ...user, notification_time: e.target.value })}
                  className="mt-2"
                />
              </div>
            )}
            <Button onClick={handleUpdatePreferences} disabled={loading} variant="outline" className="w-full">
              {loading ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
            <CardDescription>Actions irréversibles</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={() => setShowResetDialog(true)}
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Réinitialiser la progression
            </Button>
          </CardContent>
        </Card>

        <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Réinitialiser la progression ?</DialogTitle>
              <DialogDescription>
                Cette action est irréversible. Tous tes défis, streaks et statistiques seront supprimés.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowResetDialog(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleResetProgress} disabled={loading}>
                {loading ? "Suppression..." : "Confirmer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

