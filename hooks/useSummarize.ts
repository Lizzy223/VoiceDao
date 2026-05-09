import { useState, useCallback } from "react";

interface Summary {
    title: string;
    summary: string;
    category: string;
}

export const useSummarize = () => {
    const [summary, setSummary] = useState<Summary | null>(null);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const summarize = useCallback(async (transcript: string) => {
        setIsSummarizing(true);
        setError(null);
        try {
            const res = await fetch("/api/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transcript }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error ?? "Summarization failed");
            }

            setSummary(data);
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Summarization failed";
            setError(message);
            console.error("Summarization failed:", err);
        } finally {
            setIsSummarizing(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { summary, setSummary, isSummarizing, summarize, error };
};