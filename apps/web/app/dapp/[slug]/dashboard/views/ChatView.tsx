"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useMemo, useState } from "react";
import { ChatInterface } from "../components/chat/components/chat-interface";

interface ChatViewProps {
  slug: string;
  logoUrl?: string | null;
  daoName?: string | null;
}

export function ChatView({ slug, logoUrl, daoName }: ChatViewProps) {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: slug ? `/api/chat?slug=${encodeURIComponent(slug)}` : "/api/chat",
    }),
  });

  const normalizedMessages = useMemo(() => {
    return messages
      .map((message) => ({
        id: message.id,
        role: message.role as "user" | "assistant",
        content: Array.isArray(message.parts)
          ? message.parts
            .map((part) => (part.type === "text" ? part.text : ""))
            .join("")
          : "",
      }))
      .filter(
        (message) =>
          (message.role === "user" || message.role === "assistant") &&
          message.content.trim() !== "",
      );
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  const isGenerating = status === "streaming" || status === "submitted";

  return (
    <div className="flex-1 h-[calc(100vh-6rem)]">
      <ChatInterface
        messages={normalizedMessages}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isGenerating={isGenerating}
        stop={stop}
        slug={slug}
        logoUrl={logoUrl || undefined}
        daoName={daoName || undefined}
        isDemo={true}
      />
    </div>
  );
}
