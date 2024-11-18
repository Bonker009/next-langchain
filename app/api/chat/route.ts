/* eslint-disable prefer-const */
import { ChatGroq } from "@langchain/groq";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.2-90b-vision-preview",
});

const callModel = async (state) => {
  const response = await llm.invoke(state.messages);
  return { messages: response };
};

type MemoryInstance = Record<string, MemorySaver>;

let memoryInstances: MemoryInstance = {};
const getMemoryInstance = (threadId: string): MemorySaver => {
  if (!memoryInstances[threadId]) {
    memoryInstances[threadId] = new MemorySaver();
  }
  return memoryInstances[threadId];
};

const createApp = (memory: MemorySaver) => {
  const workflow = new StateGraph(MessagesAnnotation)
    .addNode("model", callModel)
    .addEdge(START, "model")
    .addEdge("model", END);

  return workflow.compile({ checkpointer: memory });
};

export async function POST(request: Request) {
  try {
    const { prompt, thread_id }: { prompt: string; thread_id?: string } =
      await request.json();

    const threadId = thread_id || uuidv4();

    const memory = getMemoryInstance(threadId);

    const app = createApp(memory);

    const input = [
      {
        role: "user",
        content: prompt,
      },
    ];

    const response = await app.invoke(
      { messages: input },
      { configurable: { thread_id: threadId } }
    );
    const AIMessage = response.messages[response.messages.length - 1];

    return NextResponse.json({
      content: AIMessage.content,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
