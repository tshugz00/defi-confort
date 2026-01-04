"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { COMFORT_LEVEL_LABELS } from "@/lib/constants"

interface ComfortSliderProps {
  value: number
  onChange: (value: number) => void
}

export function ComfortSlider({ value, onChange }: ComfortSliderProps) {
  const [localValue, setLocalValue] = useState([value])

  const handleValueChange = (newValue: number[]) => {
    setLocalValue(newValue)
    onChange(newValue[0])
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl font-bold mb-2">{localValue[0]}/10</div>
        <div className="text-lg text-muted-foreground">
          {COMFORT_LEVEL_LABELS[localValue[0] as keyof typeof COMFORT_LEVEL_LABELS]}
        </div>
      </div>
      <Slider
        value={localValue}
        onValueChange={handleValueChange}
        min={1}
        max={10}
        step={1}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>1</span>
        <span>10</span>
      </div>
    </div>
  )
}

