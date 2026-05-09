"use client";
import { useEffect, useState } from "react";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";

interface Props {
    onTranscriptReady: (transcript: string) => void;
}

export const VoiceRecorder = ({ onTranscriptReady }: Props) => {
    const {
        isRecording,
        isTranscribing,
        transcript,
        error,
        startRecording,
        stopRecording,
    } = useVoiceRecorder();
    const [manualText, setManualText] = useState("");

    useEffect(() => {
        if (transcript) {
            onTranscriptReady(transcript);
        }
    }, [transcript, onTranscriptReady]);

    return (
        <div className="flex flex-col items-center gap-4 p-4">
            {/* Waveform animation */}
            <div className="flex items-center gap-1 h-10">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className={`w-1 rounded-full bg-purple-500 transition-all duration-150 ${isRecording ? "animate-bounce" : "h-2"}`}
                        style={{
                            height: isRecording ? `${Math.random() * 32 + 8}px` : "8px",
                            animationDelay: `${i * 0.1}s`,
                        }}
                    />
                ))}
            </div>

            {/* Record / Stop button */}
            {!isRecording ? (
                <button
                    onClick={startRecording}
                    className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600
                     flex items-center justify-center shadow-lg
                     transition-transform hover:scale-105"
                >
                    <div className="w-6 h-6 rounded-full bg-white" />
                </button>
            ) : (
                <button
                    onClick={stopRecording}
                    className="w-16 h-16 rounded-full bg-red-600
                     flex items-center justify-center shadow-lg
                     animate-pulse"
                >
                    <div className="w-6 h-6 rounded-sm bg-white" />
                </button>
            )}

            {/* Status */}
            <p className="text-sm text-gray-400">
                {isRecording
                    ? "Recording... click to stop"
                    : isTranscribing
                        ? "Transcribing..."
                        : "Click to record"}
            </p>

            {/* Error + manual text fallback */}
            {error && (
                <div className="w-full flex flex-col gap-2">
                    <p className="text-sm text-red-400">{error}</p>
                    <p className="text-xs text-gray-400">Enter your proposal text manually instead:</p>
                    <textarea
                        className="w-full p-2 rounded bg-gray-800 text-sm text-gray-200 resize-none focus:outline-none focus:ring-1 focus:ring-purple-500"
                        rows={3}
                        placeholder="Type your proposal here..."
                        value={manualText}
                        onChange={(e) => setManualText(e.target.value)}
                    />
                    <button
                        onClick={() => manualText.trim() && onTranscriptReady(manualText.trim())}
                        disabled={!manualText.trim()}
                        className="self-end px-3 py-1 rounded bg-purple-600 text-white text-sm disabled:opacity-50"
                    >
                        Use this text
                    </button>
                </div>
            )}

            {/* Transcript preview */}
            {transcript && (
                <div className="w-full p-3 rounded-lg bg-gray-800 text-sm text-gray-200">
                    {transcript}
                </div>
            )}
        </div>
    );
};