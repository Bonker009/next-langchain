declare type Chat = {
  id: string;
  title: string;
};

declare type ChatSidebarProps = {
  chats: Chat[];
  currentChatId: string;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
};
declare type Message = {
  role: "user" | "ai";
  content: string;
};

declare type ChatMessage = {
  id: string;
  title: string;
  messages: Message[];
};

declare type ChatInputProps = {
  onSendMessage: (message: string) => void;
};