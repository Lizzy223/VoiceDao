import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
    let transcript: string;
    try {
        const body = await req.json();
        transcript = body.transcript;
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    if (!transcript || typeof transcript !== "string" || !transcript.trim()) {
        return NextResponse.json({ error: "transcript is required" }, { status: 400 });
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a DAO governance assistant. Return only valid JSON, no markdown, no backticks.",
                },
                {
                    role: "user",
                    content: `A member just recorded a voice proposal.
Transcript: "${transcript}"

Return ONLY a JSON object like this:
{
  "title": "short proposal title (max 8 words)",
  "summary": "clear 2-3 sentence summary of the proposal",
  "category": "one of: Treasury, Protocol, Community, Partnership"
}`,
                },
            ],
            response_format: { type: "json_object" },
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            return NextResponse.json({ error: "Empty response from AI" }, { status: 502 });
        }

        return NextResponse.json(JSON.parse(content));
    } catch (err) {
        const message = err instanceof Error ? err.message : "AI service unavailable";
        return NextResponse.json({ error: message }, { status: 502 });
    }
}