"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { toast } from "sonner"
import { Navbar } from "@/components/navbar"
import { ProposalCard } from "@/components/proposal-card"
import { NewProposalModal } from "@/components/new-proposal-modal"
import { VoteModal } from "@/components/vote-modal"
import { FloatingActionButton } from "@/components/floating-action-button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, Vote, TrendingUp } from "lucide-react"
import { fetchProposals, Proposal as DBProposal } from "@/lib/proposals"

const stats = [
  { label: "Active Proposals", value: "12", icon: FileText, color: "text-primary" },
  { label: "Total Members", value: "4,832", icon: Users, color: "text-accent" },
  { label: "Votes Cast", value: "127.5K", icon: Vote, color: "text-primary" },
  { label: "Treasury", value: "$2.4M", icon: TrendingUp, color: "text-accent" },
]

function deriveStatus(deadline: string, votesFor: number, votesAgainst: number): "active" | "passed" | "rejected" {
  if (new Date(deadline) > new Date()) return "active"
  return votesFor >= votesAgainst ? "passed" : "rejected"
}

function formatDeadline(deadline: string): string {
  const diff = new Date(deadline).getTime() - Date.now()
  if (diff <= 0) return "Ended"
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  return days === 1 ? "1 day left" : `${days} days left`
}

function toCardProposal(p: DBProposal) {
  const votesFor = p.votes_for ?? 0
  const votesAgainst = p.votes_against ?? 0
  return {
    id: p.id ?? "",
    title: p.title,
    summary: p.summary,
    yesVotes: votesFor,
    noVotes: votesAgainst,
    deadline: formatDeadline(p.deadline),
    status: deriveStatus(p.deadline, votesFor, votesAgainst),
    author: p.proposer,
    votersCount: votesFor + votesAgainst,
  }
}

export default function HomeClient() {
  const [rawProposals, setRawProposals] = useState<DBProposal[]>([])
  const [loading, setLoading] = useState(true)
  const [isNewProposalOpen, setIsNewProposalOpen] = useState(false)
  const [selectedProposal, setSelectedProposal] = useState<DBProposal | null>(null)
  const [filter, setFilter] = useState<"all" | "active" | "passed" | "rejected">("all")

  const proposals = useMemo(() => rawProposals.map(toCardProposal), [rawProposals])

  const loadProposals = useCallback(async () => {
    try {
      const data = await fetchProposals()
      setRawProposals(data ?? [])
    } catch {
      toast.error("Failed to load proposals")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProposals()
  }, [loadProposals])

  const handleVote = (proposalId: string) => {
    const proposal = rawProposals.find((p) => p.id === proposalId)
    if (proposal) setSelectedProposal(proposal)
  }

  const filteredProposals = proposals.filter((proposal) => {
    if (filter === "all") return true
    return proposal.status === filter
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Governance Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Shape the future of VoiceDAO with your voice
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-card border-border">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-secondary ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {(["all", "active", "passed", "rejected"] as const).map((status) => (
            <Badge
              key={status}
              variant="outline"
              onClick={() => setFilter(status)}
              className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                filter === status
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-border hover:border-primary/50"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status === "active" && (
                <span className="ml-2 h-2 w-2 rounded-full bg-accent inline-block" />
              )}
            </Badge>
          ))}
        </div>

        {/* Proposals Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredProposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              onVote={handleVote}
            />
          ))}
        </div>

        {filteredProposals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No proposals found</p>
          </div>
        )}
      </main>

      <FloatingActionButton onClick={() => setIsNewProposalOpen(true)} />

      <NewProposalModal
        open={isNewProposalOpen}
        onOpenChange={(open) => {
          setIsNewProposalOpen(open)
          if (!open) loadProposals()
        }}
      />
      {selectedProposal && (
        <VoteModal
          proposal={selectedProposal}
          onClose={() => setSelectedProposal(null)}
          onVoted={loadProposals}
        />
      )}
    </div>
  )
}
