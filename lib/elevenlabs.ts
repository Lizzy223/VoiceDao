export const speakText = async (text: string): Promise<void> => {
    const res = await fetch(
        "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM",
        {
            method: "POST",
            headers: {
                "xi-api-key": process.env.NEXT_PUBLIC_ELEVENLABS_KEY!,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text,
                model_id: "eleven_turbo_v2",
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                },
            }),
        }
    );

    if (!res.ok) {
        throw new Error(`Text-to-speech failed (${res.status})`);
    }

    const blob = await res.blob();
    const audio = new Audio(URL.createObjectURL(blob));
    audio.play();
};