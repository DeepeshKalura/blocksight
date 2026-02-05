"use client";

import { ChatInterface } from "./components/chat-interface";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ChatPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({
      api: slug ? `/api/chat?slug=${encodeURIComponent(slug)}` : "/api/chat",
    }),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = () => {
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <ChatInterface
      messages={messages as any}
      input={input}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      isGenerating={status === "streaming" || status === "submitted"}
      stop={stop}
      slug={slug}
    />
  );
}
