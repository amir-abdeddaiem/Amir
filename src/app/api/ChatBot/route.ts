import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { ChatRequest, ChatResponse } from "@/types/Chat";

// Initialize Gemini with API Key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyBtNRrmMPU7VkM0uGPQ4_l4FB2GvLn-kgg");

export async function POST(req: NextRequest): Promise<NextResponse> {
    // Removed genAI.listModels() as it does not exist and is unnecessary.

    try {
        const body: ChatRequest = await req.json();

        if (!body.message) {
            return NextResponse.json({ response: "Message is required" }, { status: 400 });
        }

        // ✅ Correct model path
        const model = genAI.getGenerativeModel({ model: "gemini" });

        const result = await model.generateContent(body.message);
        const response = await result.response;
        const text = response.text();

        const responseBody: ChatResponse = { response: text };

        return NextResponse.json(responseBody);
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            {
                response: "Something went wrong",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
