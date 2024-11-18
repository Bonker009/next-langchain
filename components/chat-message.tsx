/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Bot, User2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";

export function ChatMessage({ message }: { message: Message }) {
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      className={`flex items-start mb-4 ${
        message.role === "ai" ? "justify-start" : "justify-end"
      }`}
    >
      {message.role === "ai" && (
        <Avatar className="mr-2 bg-red-300 flex items-center justify-center">
          <Bot size={20} color="white" />
        </Avatar>
      )}
      <div
        className={`rounded-lg p-2 max-w-[70%] ${
          message.role === "ai" ? "bg-slate-50" : "bg-slate-50"
        }`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  style={dracula}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
      {message.role === "user" && (
        <Avatar className="ml-2 flex items-center justify-center bg-red-300">
          <User2 size={20} color="white" />
        </Avatar>
      )}

      <div ref={messageEndRef} />
    </div>
  );
}
