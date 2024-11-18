import { ChatGroq } from "@langchain/groq";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.2-90b-vision-preview",
});
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";
const callModel = async (state: typeof MessagesAnnotation.State) => {
  const response = await llm.invoke(state.messages);
  return { messages: response };
};
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("model", callModel)
  .addEdge(START, "model")
  .addEdge("model", END);

const memory = new MemorySaver();
const app = workflow.compile({ checkpointer: memory });
const config = { configurable: { thread_id: uuidv4() } };
export async function POST(request: Request) {
  console.log(memory.storage);
  const { prompt } = await request.json();
  const input = [
    {
      role: "user",
      content: prompt,
    },
  ];
  const response = await app.invoke({ messages: input }, config);
  const AIMessage = response.messages[response.messages.length - 1];
  try {
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
