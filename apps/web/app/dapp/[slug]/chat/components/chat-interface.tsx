"use client";

import {
  ChatContainerContent,
  ChatContainerRoot,
  ChatContainerScrollAnchor,
} from "@/components/ui/chat-container";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollButton } from "@/components/ui/scroll-button";
import { PromptSuggestions } from "@/components/ui/prompt-suggestions";
import { cn } from "@/lib/utils";
import { ArrowUp, Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: Date;
}

interface ChatInterfaceProps {
  messages: Message[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e?: React.FormEvent) => void;
  isGenerating: boolean;
  stop?: () => void;
  slug?: string;
  logoUrl?: string;
  daoName?: string;
}

export function ChatInterface({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isGenerating,
  stop,
  slug,
  logoUrl,
  daoName,
}: ChatInterfaceProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
  };

  // Generate dynamic prompt suggestions based on the dApp name
  const getPromptSuggestions = () => {
    const name = daoName || "this token";
    return [
      `What is the total market cap of ${name}?`,
      `Show me the top wallet holders for ${name}`,
      `Analyze recent transaction patterns of ${name}`,
      `What are the gas usage statistics for ${name}?`,
    ];
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleInputChange({
      target: { value: suggestion },
    } as React.ChangeEvent<HTMLInputElement>);
    handleSubmit();
  };

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <Card className="rounded-none border-x-0 border-t-0 border-b bg-card/50 backdrop-blur-sm">
          <CardHeader className="py-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <span className="text-primary">Chat</span>
              {slug && (
                <span className="text-sm text-muted-foreground font-normal">
                  / {slug}
                </span>
              )}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Messages Container */}
        <div className="flex-1 relative overflow-hidden">
          <ChatContainerRoot className="h-full w-full">
            <ChatContainerContent className="p-6 space-y-6">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground px-4">
                  <PromptSuggestions
                    label={`Ask about ${daoName || "this dApp"}`}
                    append={(message) => handleSuggestionClick(message.content)}
                    suggestions={getPromptSuggestions()}
                  />
                </div>
              ) : (
                messages.map((message) => (
                  <Message
                    key={message.id}
                    className={cn(
                      "flex gap-4 max-w-4xl",
                      message.role === "user"
                        ? "flex-row-reverse ml-auto"
                        : "mr-auto",
                    )}
                  >
                    <MessageAvatar
                      src={
                        message.role === "user"
                          ? "/puck-logo.png"
                          : logoUrl || "/puck-logo.png"
                      }
                      alt={message.role}
                      fallback={message.role === "user" ? "U" : "AI"}
                      className="h-10 w-10 shrink-0"
                    />
                    <div className="flex-1 space-y-2">
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-3",
                          message.role === "user"
                            ? "bg-muted text-muted-foreground rounded-tr-sm"
                            : "bg-secondary text-secondary-foreground rounded-tl-sm",
                        )}
                      >
                        <MessageContent markdown={message.role === "assistant"}>
                          {message.content}
                        </MessageContent>
                      </div>

                      {/* Message Actions */}
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              copyToClipboard(message.content, message.id)
                            }
                          >
                            {copiedId === message.id ? (
                              <span className="text-xs text-green-500">
                                Copied!
                              </span>
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                          >
                            <ThumbsUp className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                          >
                            <ThumbsDown className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </Message>
                ))
              )}
              <ChatContainerScrollAnchor />
            </ChatContainerContent>

            {/* Scroll to Bottom Button */}
            <div className="absolute right-6 bottom-24">
              <ScrollButton />
            </div>
          </ChatContainerRoot>
        </div>

        {/* Input Area */}
        <Card className="rounded-none border-x-0 border-b-0 border-t bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <form
              onSubmit={onSubmit}
              className="flex gap-3 items-end max-w-4xl mx-auto"
            >
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  disabled={isGenerating}
                  className="min-h-[52px] resize-none py-3 pr-12 text-base"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                />
              </div>
              {isGenerating ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={stop}
                  className="h-[52px] px-6"
                >
                  Stop
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!input.trim()}
                  className="h-[52px] w-[52px] p-0"
                >
                  <ArrowUp className="h-5 w-5" />
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
