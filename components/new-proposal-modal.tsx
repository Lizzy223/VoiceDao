"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ProposalModal } from './proposal-modal'

interface NewProposalModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewProposalModal({ open, onOpenChange }: NewProposalModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-popover border-border flex flex-col max-h-[85vh]">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xl text-foreground">Create New Proposal</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Record your voice to explain your proposal to the community
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 min-h-0">
          <ProposalModal onClose={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
