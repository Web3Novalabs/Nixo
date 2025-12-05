"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
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

      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error("Request timed out"));
        }, 30000); // 30 second timeout
      });

      try {
        // Race between the actual request and timeout
        const response = await Promise.race([
          handleUserMessage(userInput, context),
          timeoutPromise,
        ]);

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: response,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        const isTimeout =
          error instanceof Error && error.message === "Request timed out";

        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: isTimeout
            ? "Sorry, the request timed out. Please try again."
            : "Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorMessage]);

        // Show toast notification
        toast.error(
          isTimeout
            ? "Request timed out after 30 seconds"
            : "Failed to process your message",
          {
            description: "Please try again or rephrase your request.",
          }
        );

        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [context]
  );

  return { messages, isLoading, addMessage };
}
