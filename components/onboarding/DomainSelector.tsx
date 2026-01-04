"use client"

import { ChallengeDomain } from "@/types/challenge.types"
import { DOMAIN_LABELS } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface DomainSelectorProps {
  selectedDomain?: ChallengeDomain
  onSelect: (domain: ChallengeDomain) => void
}

const domains: ChallengeDomain[] = ['social', 'confidence', 'novelty', 'procrastination', 'physical']

export function DomainSelector({ selectedDomain, onSelect }: DomainSelectorProps) {
  return (
    <div className="space-y-3">
      {domains.map((domain) => (
        <Card
          key={domain}
          className={`cursor-pointer transition-all ${
            selectedDomain === domain
              ? 'border-primary bg-primary/5'
              : 'hover:border-primary/50'
          }`}
          onClick={() => onSelect(domain)}
        >
          <div className="p-4">
            <div className="font-medium">{DOMAIN_LABELS[domain]}</div>
          </div>
        </Card>
      ))}
    </div>
  )
}

