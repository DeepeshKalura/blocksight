"use client";

import { Chat } from "@/components/ui/chat";
import { useChat } from "@ai-sdk/react";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

function ChatContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { messages, setMessages, sendMessage, status, stop } = useChat({
    id: id ?? undefined,
  });

  const [input, setInput] = React.useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e?: { preventDefault?: () => void }) => {
    e?.preventDefault?.();
    if (!input) return;
    try {
      await sendMessage({ text: input });
    } finally {
      setInput("");
    }
  };

  const append = (message: { role: "user"; content: string }) => {
    void sendMessage({ text: message.content });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full max-w-5xl mx-auto p-4">
      <div className="flex-1 overflow-hidden border border-gray-800 rounded-xl bg-gray-950/50 backdrop-blur-sm shadow-2xl">
        <Chat
          messages={messages as any}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isGenerating={status === "streaming" || status === "submitted"}
          stop={stop}
          append={append}
          suggestions={[
            "What is the total transaction volume?",
            "Show me the top whales.",
            "Analyze the token distribution.",
            "What are the recent transaction patterns?",
          ]}
          className="h-full"
        />
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-10">
          Loading chat...
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
