"use client";

import { useState } from "react";
import { toast } from "sonner";
import { VoteModal } from "@/components/vote-modal";
import { speakText } from "@/lib/elevenlabs";
import type { Proposal } from "@/lib/proposals";

export default function ProposalDetailClient({ proposal }: { proposal: Proposal }) {
  const [showVoteModal, setShowVoteModal] = useState(false);

  const totalVotes = (proposal.votes_for ?? 0) + (proposal.votes_against ?? 0);
  const yesPercent = totalVotes
    ? Math.round(((proposal.votes_for ?? 0) / totalVotes) * 100)
    : 0;

  const handleListen = async () => {
    try {
      await speakText(proposal.summary);
    } catch {
      toast.error("Failed to play audio");
    }
  };

  const handleShare = () => {
    const text = encodeURIComponent(
      `🗳️ Vote on this VoiceDAO proposal: "${proposal.title}"`
    );
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=VoiceDAO,Solana`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-gray-900 rounded-2xl border border-gray-700 p-6 flex flex-col gap-4">

        <span className="self-start px-2 py-1 rounded-full bg-purple-600/30 text-purple-300 text-xs font-medium">
          {proposal.category}
        </span>

        <h1 className="text-white font-bold text-2xl leading-tight">
          {proposal.title}
        </h1>

        <p className="text-gray-400 leading-relaxed">{proposal.summary}</p>

        <button
          onClick={handleListen}
          className="self-start flex items-center gap-2 text-green-400 text-sm hover:text-green-300 transition-colors"
        >
          🔊 Listen to proposal
        </button>

        {/* Vote bar */}
        <div className="flex flex-col gap-2">
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${yesPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>✅ {proposal.votes_for ?? 0} Yes ({yesPercent}%)</span>
            <span>❌ {proposal.votes_against ?? 0} No</span>
          </div>
        </div>

        <p className="text-xs text-gray-500">
          Voting closes {new Date(proposal.deadline).toLocaleDateString()}
        </p>

        <button
          onClick={() => setShowVoteModal(true)}
          className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors"
        >
          Cast Your Vote
        </button>

        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 py-2 rounded-xl bg-black border border-gray-700 text-white text-sm hover:bg-gray-900 transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Share on X
        </button>
      </div>

      {showVoteModal && (
        <VoteModal
          proposal={proposal}
          onClose={() => setShowVoteModal(false)}
          onVoted={() => {
            setShowVoteModal(false);
            toast.success("Vote submitted!");
          }}
        />
      )}
    </div>
  );
}
