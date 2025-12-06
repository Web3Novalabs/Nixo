"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { TransactionIntent } from "@/lib/ai-service";

export interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  streaming?: boolean;
}

interface MessageContext {
  isConnected: boolean;
  walletAddress?: string;
  balances?: { token: string; balance: string }[];
}

export function useMessages(context: MessageContext) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hey there! 👋 I'm your privacy-focused DeFi assistant powered by Typhoon Protocol.\n\nI can help you:\n🔍 Check your token balances\n🔒 Make anonymous transfers\n💬 Answer questions about privacy\n\nJust ask me anything like 'What's my balance?' or 'Send 10 STRK to 0x...'",
      timestamp: new Date(),
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [currentIntent, setCurrentIntent] = useState<TransactionIntent | null>(null);

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

      // Create placeholder for streaming message
      const assistantMessageId = (Date.now() + 1).toString();
      const assistantMessage: Message = {
        id: assistantMessageId,
        type: "assistant",
        content: "",
        timestamp: new Date(),
        streaming: true,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      try {
        // Use balances from context (already fetched via useTokenBalances hook)
        const balances = context.balances || [];

        // Call AI API with streaming
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userInput,
            walletAddress: context.walletAddress,
            balances,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get AI response");
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error("No response stream");
        }

        let fullContent = "";
        let intent: TransactionIntent | null = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              
              if (data === "[DONE]") {
                break;
              }

              try {
                const parsed = JSON.parse(data);
                
                if (parsed.content) {
                  fullContent += parsed.content;
                  
                  // Update message with streaming content
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessageId
                        ? { ...msg, content: fullContent }
                        : msg
                    )
                  );
                }

                if (parsed.intent) {
                  intent = parsed.intent;
                  setCurrentIntent(intent);
                }
              } catch (e) {
                // Ignore parse errors for incomplete chunks
              }
            }
          }
        }

        // Mark streaming as complete
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, streaming: false }
              : msg
          )
        );

        // Handle transaction intent if present
        if (intent && intent.type === "transfer" && intent.confidence > 0.7) {
          // Transaction will be handled by the chatbot component
          console.log("Transaction intent detected:", intent);
        }

      } catch (error) {
        console.error("Message error:", error);
        
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content: "Sorry, I encountered an error processing your request. Please try again.",
                  streaming: false,
                }
              : msg
          )
        );

        toast.error("Failed to process your message", {
          description: "Please try again or rephrase your request.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [context]
  );

  return { messages, isLoading, addMessage, currentIntent };
}
