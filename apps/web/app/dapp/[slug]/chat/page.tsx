"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { mockDapps } from "../../mock-dapp-data";
import { ChatInterface } from "./components/chat-interface";

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const [input, setInput] = useState("");
  const [isDemo, setIsDemo] = useState(true);
  const [loading, setLoading] = useState(true);

  // Find the DAO data based on the slug
  const dao = useMemo(() => {
    return mockDapps.find((d) => d.slug === slug) || null;
  }, [slug]);

  useEffect(() => {
    const checkAccess = async () => {
      if (dao) {
        // It's a demo dApp
        setIsDemo(true);
        setLoading(false);
        return;
      }

      // Check if user has access to this dApp
      try {
        const response = await fetch(`/api/dapp/${slug}/data`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.dapp) {
            setIsDemo(false);
          }
        }
      } catch (error) {
        console.error("Error checking dApp access:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [slug, dao]);

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

  const handleSubmit = () => {
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p>Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ChatInterface
        messages={normalizedMessages}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isGenerating={status === "streaming" || status === "submitted"}
        stop={stop}
        slug={slug}
        logoUrl={dao?.logo_url || undefined}
        daoName={dao?.name || undefined}
        isDemo={isDemo}
      />
    </div>
  );
}
