import React from "react";
import {
  ChatMessage,
  type ChatMessageProps,
  type Message,
} from "@/components/ui/chat-message";
import { TypingIndicator } from "@/components/ui/typing-indicator";

type AdditionalMessageOptions = Omit<ChatMessageProps, keyof Message>;

interface MessageListProps {
  messages: Message[];
  showTimeStamps?: boolean;
  isTyping?: boolean;
  messageOptions?:
    | AdditionalMessageOptions
    | ((message: Message) => AdditionalMessageOptions);
}

export function MessageList({
  messages,
  showTimeStamps = true,
  isTyping = false,
  messageOptions,
}: MessageListProps) {
  React.useEffect(() => {
    console.log("--- MessageList Component ---");
    console.log("Rendering messages:", messages.length);
    messages.forEach((m, i) => {
      const messageObj: any = m;
      console.log(`Message ${i}:`, {
        id: m.id,
        role: m.role,
        hasContent: !!messageObj.content,
        contentPreview: messageObj.content
          ? String(messageObj.content).substring(0, 100)
          : "[No content]",
        hasToolInvocations: !!messageObj.toolInvocations,
        hasParts: !!messageObj.parts,
      });
    });
  }, [messages]);

  return (
    <div className="space-y-4 overflow-visible">
      {messages.map((message, index) => {
        const additionalOptions =
          typeof messageOptions === "function"
            ? messageOptions(message)
            : messageOptions;

        return (
          <ChatMessage
            key={index}
            showTimeStamp={showTimeStamps}
            {...message}
            {...additionalOptions}
          />
        );
      })}
      {isTyping && <TypingIndicator />}
    </div>
  );
}
