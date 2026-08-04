import { NextRequest, NextResponse } from "next/server";
import { geminiResponse } from "../../../../lib/gemini";

export async function POST(req: NextRequest) {
    // Environment variable utha rahe hain
//const prompt = process.env.PROMPT;

const prompt ="You are a highly creative, empathetic, and engaging AI assistant for an anonymous messaging platform. Your task is to generate short, relatable, and fun message suggestions that users can send anonymously to their friends or connections. Context: The users are mostly Gen-Z and Millennials in India. The tone should be casual, friendly, and highly engaging. Generate exactly 5 diverse message suggestions based on the following rules: 1. MIX OF CATEGORIES: Provide one message from each of these categories: - Compliment (Make them smile) - Icebreaker/Curiosity (A deep or fun question) - Funny/Lighthearted Roast (Friendly teasing) - Secret Admirer/Wholesome (Positive vibes) - Random/Quirky (Out of the box) 2. LANGUAGE: Use a natural mix of English and Hinglish (Hindi written in the English alphabet). Keep it conversational and modern. 3. LENGTH: Keep each message extremely concise (1 to max 2 short sentences). 4. STRICT SAFETY PROTOCOL: - ZERO tolerance for hate speech, bullying, harassment, sexual content, or self-harm references. - All messages must remain positive, harmless, and safe for all ages. - Even the 'roasts' should be friendly and completely harmless (e.g., about their bad music taste or sleeping habits). 5. OUTPUT FORMAT: Return ONLY a valid JSON array of strings. Do not include markdown formatting like ```json or any other text. Example: ['You have a great smile!', 'Bhai itna kyu sota hai tu?', 'What is a secret you haven\\'t told anyone?']"

    // Edge Case: Agar .env me PROMPT miss ho gaya toh ye check bacha lega
    if (!prompt) {
        console.log('prompt is missing')
        return NextResponse.json({
            message: "Server configuration error: Prompt is missing."
        }, { status: 500 });
    }

    try {
        const response = await geminiResponse(prompt);

        // Agar response null/undefined aata hai
        if (!response) {
            return NextResponse.json({
                message: "Failed to generate suggestions. Please try again."
            }, { status: 500 });
        }

        // 🟢 SUCCESS RESPONSE
        return NextResponse.json({
            data: response,
            message: "Suggestions generated successfully!"
        }, { status: 200 }); // Changed 404 to 200 (OK)

    } catch (err) {
        console.error("Gemini API Error:", err);

        // 🔴 CATCH BLOCK RESPONSE
        return NextResponse.json({
            message: "Internal server error while generating the suggestion."
        }, { status: 500 }); // Changed 404 to 500 (Internal Server Error)
    }
}