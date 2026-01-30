"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ChatInterface } from "./components/chat-interface";

export default function ChatPage() {
  const params = useParams();
  const slug = params.slug as string;
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
        role: message.role as 'user' | 'assistant',
        content: Array.isArray(message.parts)
          ? message.parts.map(part => 
              part.type === 'text' ? part.text : ''
            ).join('')
          : '',
      }))
      .filter((message) => (message.role === 'user' || message.role === 'assistant') && message.content.trim() !== '');
  }, [messages]);

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
      messages={normalizedMessages}
      input={input}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      isGenerating={status === "streaming" || status === "submitted"}
      stop={stop}
      slug={slug}
    />
  );
}
