"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface FloatingActionButtonProps {
  onClick: () => void
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <Button
      size="lg"
      onClick={onClick}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg shadow-primary/25 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-200 z-40"
    >
      <Plus className="h-6 w-6" />
      <span className="sr-only">New Proposal</span>
    </Button>
  )
}
