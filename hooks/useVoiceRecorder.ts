import { useState, useRef } from "react";

export const useVoiceRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [transcript, setTranscript] = useState("");
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const chunks = useRef<BlobPart[]>([]);

    const startRecording = async () => {
        setError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            chunks.current = [];

            mediaRecorder.current.ondataavailable = (e) => {
                chunks.current.push(e.data);
            };

            mediaRecorder.current.onstop = async () => {
                const blob = new Blob(chunks.current, { type: "audio/webm" });
                setAudioBlob(blob);
                await transcribe(blob);
            };

            mediaRecorder.current.start();
            setIsRecording(true);
        } catch (err) {
            const message =
                err instanceof DOMException && err.name === "NotAllowedError"
                    ? "Microphone access denied. Please allow microphone access and try again."
                    : err instanceof Error
                        ? err.message
                        : "Could not access microphone";
            setError(message);
        }
    };

    const stopRecording = () => {
        mediaRecorder.current?.stop();
        mediaRecorder.current?.stream.getTracks().forEach((t) => t.stop());
        setIsRecording(false);
    };

    const transcribe = async (blob: Blob) => {
        setIsTranscribing(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append("file", blob, "recording.webm");
            formData.append("model_id", "scribe_v1");

            const res = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
                method: "POST",
                headers: {
                    "xi-api-key": process.env.NEXT_PUBLIC_ELEVENLABS_KEY!,
                },
                body: formData,
            });

            if (!res.ok) {
                throw new Error(`Transcription service error (${res.status})`);
            }

            const data = await res.json();
            setTranscript(data.text || "");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Transcription failed";
            setError(message);
            console.error("Transcription failed:", err);
        } finally {
            setIsTranscribing(false);
        }
    };

    return {
        isRecording,
        isTranscribing,
        transcript,
        audioBlob,
        error,
        startRecording,
        stopRecording,
    };
};