import { ChatGroq } from "@langchain/groq";
import { NextResponse } from "next/server";

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.2-90b-vision-preview",
});

export async function POST(request: Request) {
  const { prompt } = await request.json();
  const response = await llm.invoke([
    {
      role: "user",
      content: prompt,
    },
  ]);
  try {
    return NextResponse.json({
      content: response.content,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
