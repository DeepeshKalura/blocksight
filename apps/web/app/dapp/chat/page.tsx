"use client";

import { Chat } from "@/components/ui/chat";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

function ChatContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({
      api: id ? `/api/chat?id=${encodeURIComponent(id)}` : "/api/chat",
    }),
    onError: (error) => {
      console.error("--- CHAT ERROR ---", error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      console.error("Messages at error time:", messages);
    },
    onFinish: (message) => {
      console.log("--- CHAT FINISHED ---");
      console.log("Finished message:", message);
      console.log("Final messages:", messages);
    },
    onToolCall: (toolCall) => {
      console.log("--- TOOL CALL ---", toolCall);
      console.log("Messages after tool call:", messages);
    },
  });

  const [input, setInput] = React.useState("");

  React.useEffect(() => {
    console.log("--- PAGE: MESSAGES UPDATED ---");
    console.log("Message count:", messages.length);
    console.log("Current status:", status);
    console.log("Input value:", input);
    console.log("-----------------------------");
    messages.forEach((m, i) => {
      const messageObj: any = m;
      console.log(`Message ${i}:`, {
        id: m.id,
        role: m.role,
        hasContent: !!messageObj.content,
        contentLength: messageObj.content
          ? String(messageObj.content).length
          : 0,
        contentPreview: messageObj.content
          ? String(messageObj.content).substring(0, 100)
          : "[No content]",
        hasToolInvocations: !!messageObj.toolInvocations,
        toolInvocationCount: messageObj.toolInvocations?.length || 0,
        hasParts: !!messageObj.parts,
        partsCount: messageObj.parts?.length || 0,
      });
    });
    console.log("=============================");
  }, [messages, status, input]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e?: { preventDefault?: () => void }) => {
    e?.preventDefault?.();
    if (!input) return;
    console.log("--- SENDING MESSAGE ---");
    console.log("Input:", input);
    console.log("DApp ID:", id);
    console.log("Current messages before send:", messages.length);
    try {
      const result = await sendMessage({ text: input });
      console.log("Message sent successfully");
      console.log("Result:", result);
      console.log("Current messages after send:", messages.length);
    } catch (error) {
      console.error("Failed to send message:", error);
      console.error("Current messages on error:", messages.length);
    } finally {
      setInput("");
    }
  };

  const append = (message: { role: "user"; content: string }) => {
    void sendMessage({ text: message.content });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full max-w-5xl mx-auto p-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          <div className="flex items-center justify-between">
            <span>
              Chat error occurred: {error.message || "Unknown error"}. Please
              try again.
            </span>
          </div>
        </div>
      )}

      <div className="mb-2 p-2 bg-gray-900 rounded text-xs text-gray-400">
        <div>Messages Count: {messages.length}</div>
        <div>Status: {status}</div>
        <div>Input: {input || "[empty]"}</div>
        <div className="mt-1 border-t border-gray-700 pt-1">
          Messages Debug:
          {messages.map((m, i) => {
            const messageObj: any = m;
            return (
              <div key={i} className="ml-2">
                [{i}] {m.role}:{" "}
                {messageObj.content
                  ? String(messageObj.content).substring(0, 50) + "..."
                  : "[No content]"}
              </div>
            );
          })}
        </div>
      </div>

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
