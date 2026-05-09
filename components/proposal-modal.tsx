"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useWallet } from "@solana/wallet-adapter-react";
import { VoiceRecorder } from "@/components/voice-recorder";
import { useSummarize } from "@/hooks/useSummarize";
import { speakText } from "@/lib/elevenlabs";
import { saveProposal } from "@/lib/proposals";

const CATEGORIES = ["Treasury", "Protocol", "Community", "Partnership"] as const;

interface ProposalModalProps {
    onClose: () => void;
}

export const ProposalModal = ({ onClose }: ProposalModalProps) => {
    const { publicKey } = useWallet();
    const [transcript, setTranscript] = useState("");
    const { summary, setSummary, isSummarizing, summarize, error: summarizeError } = useSummarize();
    const [speakError, setSpeakError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [manualTitle, setManualTitle] = useState("");
    const [manualSummaryText, setManualSummaryText] = useState("");
    const [manualCategory, setManualCategory] = useState<string>("Community");

    useEffect(() => {
        if (summarizeError) {
            toast.error("Could not summarize proposal", { description: summarizeError });
        }
    }, [summarizeError]);

    const handleTranscriptReady = useCallback(async (text: string) => {
        setTranscript(text);
        await summarize(text);
    }, [summarize]);

    const handleSpeak = async () => {
        if (!summary) return;
        setSpeakError(null);
        try {
            await speakText(summary.summary);
        } catch (err) {
            setSpeakError(err instanceof Error ? err.message : "Failed to play audio");
        }
    };

    const handleManualApply = () => {
        setSummary({
            title: manualTitle,
            summary: manualSummaryText,
            category: manualCategory,
        });
    };

    const handleSubmit = async () => {
        if (!summary || !publicKey) return;
        setIsSubmitting(true);
        try {
            await saveProposal({
                proposer: publicKey.toString(),
                title: summary.title,
                summary: summary.summary,
                category: summary.category,
                transcript,
                deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            });
            toast.success("Proposal submitted!");
            onClose();
        } catch (err) {
            toast.error("Failed to submit proposal", {
                description: err instanceof Error ? err.message : undefined,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 flex flex-col gap-4">
            <h2 className="text-xl font-bold text-white">New Proposal</h2>

            <VoiceRecorder onTranscriptReady={handleTranscriptReady} />

            {isSummarizing && (
                <div className="flex items-center gap-2 text-purple-400 text-sm">
                    <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                    AI is summarizing your proposal...
                </div>
            )}

            {/* Transcript preview */}
            {transcript && !summary && (
                <div className="w-full p-3 rounded-lg bg-gray-800 text-sm text-gray-300 leading-relaxed">
                    <p className="text-xs text-gray-500 mb-1">Transcript</p>
                    {transcript}
                </div>
            )}

            {/* Manual fallback — shown quietly when AI summary is unavailable */}
            {!isSummarizing && transcript && !summary && (
                <div className="flex flex-col gap-3 p-4 rounded-lg bg-gray-800 border border-gray-700">
                    <p className="text-xs text-gray-400">Fill in the proposal details to continue:</p>
                    <select
                        className="bg-gray-700 text-white text-sm rounded px-2 py-1"
                        value={manualCategory}
                        onChange={(e) => setManualCategory(e.target.value)}
                    >
                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <input
                        className="bg-transparent text-white font-semibold text-lg border-b border-gray-600 pb-1 focus:outline-none focus:border-purple-500"
                        placeholder="Proposal title..."
                        value={manualTitle}
                        onChange={(e) => setManualTitle(e.target.value)}
                    />
                    <textarea
                        className="bg-transparent text-gray-300 text-sm resize-none focus:outline-none"
                        rows={3}
                        placeholder="Proposal summary..."
                        value={manualSummaryText}
                        onChange={(e) => setManualSummaryText(e.target.value)}
                    />
                    <button
                        disabled={!manualTitle.trim() || !manualSummaryText.trim()}
                        onClick={handleManualApply}
                        className="self-end px-3 py-1 rounded bg-purple-600 text-white text-sm disabled:opacity-50"
                    >
                        Use this
                    </button>
                </div>
            )}

            {/* AI Summary Result */}
            {summary && (
                <div className="flex flex-col gap-3 p-4 rounded-lg bg-gray-800 border border-purple-500/30">
                    <span className="self-start px-2 py-1 rounded-full bg-purple-600/30 text-purple-300 text-xs font-medium">
                        {summary.category}
                    </span>

                    <input
                        className="bg-transparent text-white font-semibold text-lg border-b border-gray-600 pb-1 focus:outline-none focus:border-purple-500"
                        value={summary.title}
                        onChange={(e) => setSummary((s) => s && { ...s, title: e.target.value })}
                    />

                    <textarea
                        className="bg-transparent text-gray-300 text-sm resize-none focus:outline-none"
                        rows={3}
                        value={summary.summary}
                        onChange={(e) => setSummary((s) => s && { ...s, summary: e.target.value })}
                    />

                    <button
                        onClick={handleSpeak}
                        className="self-start flex items-center gap-2 text-sm text-green-400 hover:text-green-300"
                    >
                        🔊 Listen to summary
                    </button>
                    {speakError && <p className="text-xs text-red-400">{speakError}</p>}
                </div>
            )}

            {!publicKey && (
                <p className="text-xs text-center text-gray-500">Connect your wallet to submit</p>
            )}

            <button
                onClick={handleSubmit}
                disabled={!summary || !publicKey || isSubmitting}
                className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold disabled:opacity-50 transition-colors"
            >
                {isSubmitting ? "Submitting..." : "Submit Proposal"}
            </button>
        </div>
    );
};