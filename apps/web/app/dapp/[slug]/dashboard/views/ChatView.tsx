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

  // Parse content to extract thinking tags and clean content
  const parseContent = (rawContent: string) => {
    const thinkingMatch = rawContent.match(/<thinking>([\s\S]*?)<\/thinking>/);
    const thinkingText = thinkingMatch ? thinkingMatch[1].trim() : "";
    const cleanContent = rawContent.replace(/<thinking>[\s\S]*?<\/thinking>/g, "").trim();
    return { thinkingText, cleanContent };
  };

  const normalizedMessages = useMemo(() => {
    return messages
      .map((message) => {
        let rawContent = "";
        
        // Handle parts array (AI SDK v4+ format)
        if (Array.isArray(message.parts)) {
          rawContent = message.parts
            .map((part: any) => {
              // Handle text parts (the actual response)
              if (part.type === "text") return part.text || "";
              // Handle string parts
              if (typeof part === "string") return part;
              return "";
            })
            .join("");
        }
        // Handle direct content string (legacy format)
        else if (typeof (message as any).content === "string") {
          rawContent = (message as any).content;
        }
        
        // Parse out thinking tags for assistant messages
        const { thinkingText, cleanContent } = message.role === "assistant" 
          ? parseContent(rawContent)
          : { thinkingText: "", cleanContent: rawContent };
        
        // Use thinkingText as fallback content if cleanContent is empty
        // This handles cases where model only outputs thinking text as final response
        const finalContent = cleanContent || thinkingText;
        
        return {
          id: message.id,
          role: message.role as "user" | "assistant",
          content: finalContent,
          thinkingText: cleanContent ? thinkingText : "", // Only keep thinkingText if there's also cleanContent
        };
      })
      .filter(
        (message) =>
          (message.role === "user" || message.role === "assistant") &&
          (message.content.trim() !== "" || message.thinkingText.trim() !== ""),
      );
  }, [messages]);

  // Get thinking info from the last message while streaming
  const thinkingInfo = useMemo(() => {
    if (status === "submitted") {
      return { show: true, text: "" };
    }
    
    if (status !== "streaming") {
      return { show: false, text: "" };
    }
    
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== "assistant") {
      return { show: false, text: "" };
    }
    
    // Get raw content from parts
    let rawContent = "";
    if (Array.isArray(lastMessage.parts)) {
      rawContent = lastMessage.parts
        .map((part: any) => (part.type === "text" ? part.text || "" : ""))
        .join("");
    }
    
    // Check for thinking tags
    const thinkingMatch = rawContent.match(/<thinking>([\s\S]*?)<\/thinking>/);
    if (thinkingMatch) {
      const cleanContent = rawContent.replace(/<thinking>[\s\S]*?<\/thinking>/g, "").trim();
      // Show thinking if we have thinking text but no clean content yet
      if (!cleanContent) {
        return { show: true, text: thinkingMatch[1].trim() };
      }
    }
    
    // Check for reasoning parts without text (for models that use reasoning)
    const parts = lastMessage.parts || [];
    const hasReasoning = parts.some((p: any) => p.type === "reasoning");
    const hasText = parts.some((p: any) => p.type === "text" && p.text?.trim());
    
    if (hasReasoning && !hasText) {
      return { show: true, text: "" };
    }
    
    return { show: false, text: "" };
  }, [messages, status]);

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

  // Display messages are already filtered (thinking tags removed from content)
  const displayMessages = normalizedMessages;

  return (
    <div className="flex-1 h-[calc(100vh-6rem)]">
      <ChatInterface
        messages={displayMessages}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isGenerating={isGenerating}
        showThinking={thinkingInfo.show}
        thinkingText={thinkingInfo.text}
        stop={stop}
        slug={slug}
        logoUrl={logoUrl || undefined}
        daoName={daoName || undefined}
        isDemo={true}
      />
    </div>
  );
}
