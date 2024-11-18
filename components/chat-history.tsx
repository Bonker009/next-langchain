import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./chat-message";



export function ChatHistory({ messages }: { messages: Message[] }) {
  return (
    <ScrollArea className="h-[calc(100vh-240px)]">
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}
    </ScrollArea>
  );
}
