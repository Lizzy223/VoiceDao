"use client"

import { useState, useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Mic, Square, Trash2, ThumbsUp, ThumbsDown } from "lucide-react"

interface VotingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  proposalTitle: string
}

export function VotingModal({ open, onOpenChange, proposalTitle }: VotingModalProps) {
  const [selectedVote, setSelectedVote] = useState<"yes" | "no" | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecording, setHasRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [waveformHeights, setWaveformHeights] = useState<number[]>(
    Array(20).fill(4)
  )

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
        setWaveformHeights(
          Array(20)
            .fill(0)
            .map(() => Math.random() * 20 + 4)
        )
      }, 100)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRecording])

  const handleStartRecording = () => {
    setIsRecording(true)
    setRecordingTime(0)
    setHasRecording(false)
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    setHasRecording(true)
  }

  const handleDeleteRecording = () => {
    setHasRecording(false)
    setRecordingTime(0)
    setWaveformHeights(Array(20).fill(4))
  }

  const handleSubmitVote = () => {
    console.log({ vote: selectedVote, hasRecording })
    onOpenChange(false)
    setSelectedVote(null)
    setHasRecording(false)
    setRecordingTime(0)
  }

  const formatTime = (time: number) => {
    const seconds = Math.floor(time / 10)
    const deciseconds = time % 10
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}.${deciseconds}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-popover border-border">
        <DialogHeader>
          <DialogTitle className="text-xl text-foreground">Cast Your Vote</DialogTitle>
          <DialogDescription className="text-muted-foreground line-clamp-2">
            {proposalTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Vote Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              size="lg"
              variant="outline"
              onClick={() => setSelectedVote("yes")}
              className={`h-20 flex flex-col gap-2 transition-all ${
                selectedVote === "yes"
                  ? "bg-accent/20 border-accent text-accent"
                  : "border-border hover:border-accent hover:bg-accent/10"
              }`}
            >
              <ThumbsUp className="h-6 w-6" />
              <span className="font-semibold">Yes</span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setSelectedVote("no")}
              className={`h-20 flex flex-col gap-2 transition-all ${
                selectedVote === "no"
                  ? "bg-destructive/20 border-destructive text-destructive"
                  : "border-border hover:border-destructive hover:bg-destructive/10"
              }`}
            >
              <ThumbsDown className="h-6 w-6" />
              <span className="font-semibold">No</span>
            </Button>
          </div>

          {/* Voice Note Section */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Add a voice note to explain your reasoning (optional)
            </p>
            <div className="bg-secondary/50 rounded-xl p-4 border border-border">
              {/* Waveform Display */}
              <div className="flex items-center justify-center gap-0.5 h-10 mb-3">
                {waveformHeights.map((height, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-100 ${
                      isRecording ? "bg-destructive" : hasRecording ? "bg-primary" : "bg-muted"
                    }`}
                    style={{ height: `${height}px` }}
                  />
                ))}
              </div>

              {/* Timer */}
              <div className="text-center mb-3">
                <span className="text-lg font-mono text-foreground">
                  {formatTime(recordingTime)}
                </span>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3">
                {!isRecording && !hasRecording && (
                  <Button
                    size="lg"
                    onClick={handleStartRecording}
                    className="h-12 w-12 rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  >
                    <Mic className="h-5 w-5" />
                  </Button>
                )}

                {isRecording && (
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-destructive/30 animate-pulse-ring" />
                    <Button
                      size="lg"
                      onClick={handleStopRecording}
                      className="relative h-12 w-12 rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    >
                      <Square className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {hasRecording && !isRecording && (
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleStartRecording}
                      className="h-10 w-10 rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleDeleteRecording}
                      className="h-10 w-10 rounded-full border-border hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {hasRecording && (
                <p className="text-center text-xs text-accent mt-2">Voice note recorded!</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleSubmitVote}
            disabled={!selectedVote}
          >
            Submit Vote
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
