"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useWallet } from "@solana/wallet-adapter-react";
import { VoiceRecorder } from "@/components/voice-recorder";
import { saveVote } from "@/lib/proposals";
import { speakText } from "@/lib/elevenlabs";
import type { Proposal } from "@/lib/proposals";

interface Props {
    proposal: Proposal;
    onClose: () => void;
    onVoted: () => void;
}

export const VoteModal = ({ proposal, onClose, onVoted }: Props) => {
    const { publicKey } = useWallet();
    const [support, setSupport] = useState<boolean | null>(null);
    const [reasoning, setReasoning] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (support === null || !publicKey) return;
        setIsSubmitting(true);

        try {
            await saveVote(
                proposal.id!,
                publicKey.toString(),
                support,
                reasoning
            );
            onVoted();
            onClose();
        } catch (err) {
            toast.error("Failed to submit vote", {
                description: err instanceof Error ? err.message : undefined,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center 
                    justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl w-full max-w-md p-6 
                      border border-gray-700 flex flex-col gap-4">

                {/* Header */}
                <div className="flex justify-between items-start">
                    <h2 className="text-white font-bold text-lg">Cast Your Vote</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white">
                        ✕
                    </button>
                </div>

                {/* Proposal summary */}
                <div className="p-3 rounded-lg bg-gray-800 border border-gray-700">
                    <p className="text-purple-300 text-xs mb-1">{proposal.category}</p>
                    <p className="text-white font-semibold text-sm">{proposal.title}</p>
                    <p className="text-gray-400 text-xs mt-1">{proposal.summary}</p>
                    <button
                        onClick={() => speakText(proposal.summary).catch(() => toast.error("Failed to play audio"))}
                        className="text-green-400 text-xs mt-2 hover:text-green-300"
                    >
                        🔊 Listen
                    </button>
                </div>

                {/* Yes / No buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => setSupport(true)}
                        className={`py-3 rounded-xl font-semibold text-sm transition-all ${support === true
                                ? "bg-green-500 text-white scale-105"
                                : "bg-gray-800 text-gray-400 hover:bg-green-500/20 hover:text-green-400"
                            }`}
                    >
                        ✅ Vote Yes
                    </button>
                    <button
                        onClick={() => setSupport(false)}
                        className={`py-3 rounded-xl font-semibold text-sm transition-all ${support === false
                                ? "bg-red-500 text-white scale-105"
                                : "bg-gray-800 text-gray-400 hover:bg-red-500/20 hover:text-red-400"
                            }`}
                    >
                        ❌ Vote No
                    </button>
                </div>

                {/* Voice reasoning */}
                {support !== null && (
                    <>
                        <p className="text-gray-400 text-sm">
                            Record your reasoning (optional):
                        </p>
                        <VoiceRecorder onTranscriptReady={setReasoning} />
                        {reasoning && (
                            <p className="text-gray-300 text-sm p-3 rounded-lg bg-gray-800">
                                {reasoning}
                            </p>
                        )}
                    </>
                )}

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={support === null || isSubmitting || !publicKey}
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 
                     text-white font-semibold disabled:opacity-50 transition-colors"
                >
                    {!publicKey
                        ? "Connect wallet to vote"
                        : isSubmitting
                            ? "Submitting..."
                            : "Submit Vote"}
                </button>
            </div>
        </div>
    );
};