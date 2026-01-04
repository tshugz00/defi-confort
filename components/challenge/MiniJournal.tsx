"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Mood } from "@/types/challenge.types"
import { Camera } from "lucide-react"

interface MiniJournalProps {
  onSave: (data: { note?: string; mood?: Mood; photo?: File }) => void
}

const moods: { mood: Mood; emoji: string }[] = [
  { mood: 'happy', emoji: '😊' },
  { mood: 'neutral', emoji: '😐' },
  { mood: 'sad', emoji: '😔' },
]

export function MiniJournal({ onSave }: MiniJournalProps) {
  const [note, setNote] = useState("")
  const [selectedMood, setSelectedMood] = useState<Mood | undefined>()
  const [photo, setPhoto] = useState<File | undefined>()

  const handleSave = () => {
    onSave({ note: note || undefined, mood: selectedMood, photo })
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setPhoto(e.target.files[0])
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comment ça s'est passé ?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Note optionnelle (1-3 lignes)..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
        />
        <div className="flex gap-4 justify-center">
          {moods.map(({ mood, emoji }) => (
            <button
              key={mood}
              onClick={() => setSelectedMood(selectedMood === mood ? undefined : mood)}
              className={`text-4xl transition-transform ${
                selectedMood === mood ? 'scale-125' : 'opacity-50 hover:opacity-75'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
        <label className="flex items-center justify-center gap-2 p-3 border rounded-md cursor-pointer hover:bg-accent">
          <Camera className="h-4 w-4" />
          <span className="text-sm">Ajouter une photo</span>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </label>
        {photo && (
          <div className="text-sm text-muted-foreground">
            Photo sélectionnée: {photo.name}
          </div>
        )}
        <Button onClick={handleSave} className="w-full" size="lg">
          Sauvegarder
        </Button>
      </CardContent>
    </Card>
  )
}

