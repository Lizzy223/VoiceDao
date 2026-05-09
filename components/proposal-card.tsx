"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Clock, Users } from "lucide-react"

interface Proposal {
  id: string
  title: string
  summary: string
  yesVotes: number
  noVotes: number
  deadline: string
  status: "active" | "passed" | "rejected"
  author: string
  votersCount: number
}

interface ProposalCardProps {
  proposal: Proposal
  onVote: (proposalId: string) => void
}

export function ProposalCard({ proposal, onVote }: ProposalCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const totalVotes = proposal.yesVotes + proposal.noVotes
  const yesPercentage = totalVotes > 0 ? (proposal.yesVotes / totalVotes) * 100 : 50
  const noPercentage = totalVotes > 0 ? (proposal.noVotes / totalVotes) * 100 : 50

  const handlePlayPause = () => {
    if (isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
      setProgress(0)
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
            }
            setIsPlaying(false)
            return 0
          }
          return prev + 2
        })
      }, 100)
    }
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const getStatusColor = (status: Proposal["status"]) => {
    switch (status) {
      case "active":
        return "bg-primary/20 text-primary border-primary/30"
      case "passed":
        return "bg-accent/20 text-accent border-accent/30"
      case "rejected":
        return "bg-destructive/20 text-destructive border-destructive/30"
    }
  }

  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={getStatusColor(proposal.status)}>
                {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
              </Badge>
              <span className="text-xs text-muted-foreground">#{proposal.id}</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
              {proposal.title}
            </h3>
          </div>
          <Button
            size="icon"
            variant="outline"
            className="shrink-0 h-12 w-12 rounded-full border-primary/50 bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-all"
            onClick={handlePlayPause}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Audio Progress */}
        {isPlaying && (
          <div className="space-y-2">
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-center gap-1">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-primary rounded-full animate-waveform"
                  style={{
                    height: `${Math.random() * 16 + 8}px`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        <p className="text-sm text-muted-foreground leading-relaxed">{proposal.summary}</p>

        {/* Vote Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-accent font-medium">Yes {yesPercentage.toFixed(1)}%</span>
            <span className="text-destructive font-medium">No {noPercentage.toFixed(1)}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden flex">
            <div
              className="h-full bg-accent transition-all duration-500"
              style={{ width: `${yesPercentage}%` }}
            />
            <div
              className="h-full bg-destructive transition-all duration-500"
              style={{ width: `${noPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{proposal.yesVotes.toLocaleString()} votes</span>
            <span>{proposal.noVotes.toLocaleString()} votes</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {proposal.deadline}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {proposal.votersCount} voters
            </span>
          </div>
          <Button
            size="sm"
            onClick={() => onVote(proposal.id)}
            disabled={proposal.status !== "active"}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Cast Vote
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
