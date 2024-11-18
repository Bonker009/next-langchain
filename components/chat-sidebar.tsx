import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { PlusCircle, MessageCircle } from "lucide-react";

export function ChatSidebar({
  chats,
  currentChatId,
  onChatSelect,
  onNewChat,
}: ChatSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h2 className="text-xl font-bold mb-4">Chat AI</h2>
        <Button onClick={onNewChat} className="w-full bg-red-400">
          <PlusCircle className="mr-2 h-4 w-4" /> New Chat
        </Button>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <ScrollArea className="h-[calc(100vh-120px)]">
          {chats.map((chat) => (
            <Button
              key={chat.id}
              variant={chat.id === currentChatId ? "secondary" : "ghost"}
              className="w-full justify-start mb-1 bg-red-100"
              onClick={() => onChatSelect(chat.id)}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              {chat.title}
            </Button>
          ))}
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}
