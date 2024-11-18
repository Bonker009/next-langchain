"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ChatSidebar } from "./chat-sidebar";
import { ChatHistory } from "./chat-history";
import { ChatInput } from "./chat-input";

export function ChatAI() {
  const [chats, setChats] = useState<ChatMessage[]>([
    { id: "1", title: "New Chat", messages: [] },
  ]);
  const [currentChatId, setCurrentChatId] = useState("1");

  const handleSendMessage = async (message: string) => {
    const userMessage: Message = { role: "user", content: message };

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: [...chat.messages, userMessage],
              title:
                chat.messages.length === 0 ? message.slice(0, 30) : chat.title,
            }
          : chat
      )
    );

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: message }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch AI response");
      }

      const { content } = await response.json();
      const aiMessage: Message = {
        role: "ai",
        content: content,
      };

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === currentChatId
            ? { ...chat, messages: [...chat.messages, aiMessage] }
            : chat
        )
      );
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };

  const createNewChat = () => {
    const newChat: ChatMessage = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
    };
    setChats((prevChats) => [...prevChats, newChat]);
    setCurrentChatId(newChat.id);
  };

  const currentChat = chats.find((chat) => chat.id === currentChatId);

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background w-full">
        <ChatSidebar
          chats={chats}
          currentChatId={currentChatId}
          onChatSelect={setCurrentChatId}
          onNewChat={createNewChat}
        />
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 flex flex-col m-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                <SidebarTrigger className="mr-2" />
                {currentChat?.title || "Chat with AI"}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <ChatHistory messages={currentChat?.messages || []} />
            </CardContent>
            <CardFooter>
              <ChatInput onSendMessage={handleSendMessage} />
            </CardFooter>
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
}
