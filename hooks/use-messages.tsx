"use client";

import { useState, useCallback } from "react";
import { handleUserMessage, type MessageContext } from "@/lib/message-handler";

export interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function useMessages(context: MessageContext) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hey there! I'm your anonymous transaction assistant. Ask me anything - like 'What's my balance?' or 'Send 10 STRK to 0x...'",
      timestamp: new Date(),
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useCallback(
    async (userInput: string) => {
      if (!userInput.trim()) return;

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        type: "user",
        content: userInput,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        // Get AI response
        const response = await handleUserMessage(userInput, context);

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: response,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: `Sorry, I encountered an error. Please try again.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [context]
  );

  return { messages, isLoading, addMessage };
}
