'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { mockChat, type MockQA } from '../mock-chat-data';

interface Message {
  id: number;
  type: 'user' | 'ai' | 'thinking';
  text: string;
}

export function AiChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      text: "Welcome! I'm Puck, your AI community analyst. Ask me about this DAO's data by selecting a question below.",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleQuestionClick = (qa: MockQA) => {
    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), type: 'user', text: qa.question },
    ]);

    // Add thinking indicator
    const thinkingId = Date.now() + 1;
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: thinkingId, type: 'thinking', text: '...' }]);
    }, 300);

    // Replace thinking with AI answer after a delay
    setTimeout(() => {
      setMessages((prev) =>
        prev.filter((m) => m.id !== thinkingId)
          .concat({ id: Date.now() + 2, type: 'ai', text: qa.answer })
      );
    }, 1500 + Math.random() * 500);
  };

  return (
    <Card className="max-w-4xl mx-auto bg-gray-900/50 border-gray-800 text-white flex flex-col h-[70vh]">
      <CardHeader className="border-b border-gray-800">
        <p className="text-center font-medium">AI Chat (Demo)</p>
        <p className="text-center text-xs text-gray-500">
          This is a pre-scripted demonstration.
        </p>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className={`flex items-start gap-4 ${message.type === 'user' ? 'justify-end' : ''}`}>
            {message.type !== 'user' && (
              <Avatar className="w-8 h-8">
                <AvatarImage src="/puck-logo.png" alt="Puck" />
                <AvatarFallback>🤖</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-lg rounded-xl px-4 py-3 ${
                message.type === 'user'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-800'
              }`}
            >
              {message.type === 'thinking' ? (
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              )}
            </div>
            {message.type === 'user' && (
              <Avatar className="w-8 h-8">
                <AvatarFallback>🧐</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter className="border-t border-gray-800 p-4 flex-col items-start gap-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
            {mockChat.map(qa => (
                 <Button key={qa.id} variant="outline" className="justify-start text-left h-auto" onClick={() => handleQuestionClick(qa)}>
                    {qa.question}
                </Button>
            ))}
        </div>
        <div className="relative w-full mt-2">
          <Input placeholder="Ask a follow-up question..." disabled className="bg-gray-800 pr-10" />
          <Button type="submit" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" disabled>
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}