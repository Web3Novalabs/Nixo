"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Send, Loader } from "lucide-react";
import { useMessages } from "@/hooks/use-messages";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { typhoonService } from "@/lib/typhoon-service";
import { toast } from "sonner";
import type { AccountInterface } from "starknet";
// import TransactionPreview from "./transaction-preview";

interface ChatbotProps {
  walletConnected: boolean;
  walletAddress?: string;
  balances?: { token: string; balance: string }[];
  account?: AccountInterface;
}

export default function Chatbot({
  walletConnected,
  walletAddress,
  balances,
  account,
}: ChatbotProps) {
  const [input, setInput] = useState("");
  // const [showTransactionPreview, setShowTransactionPreview] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { messages, isLoading, addMessage, addAssistantMessage, currentIntent, clearIntent } =
    useMessages({
      isConnected: walletConnected,
      walletAddress,
      balances,
    });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Auto-focus input when wallet connects
  useEffect(() => {
    if (walletConnected && inputRef.current) {
      inputRef.current.focus();
    }
  }, [walletConnected]);

  // Handle Transfer Intent
  useEffect(() => {
    const handleTransfer = async () => {
      if (
        !isLoading &&
        currentIntent &&
        currentIntent.type === "transfer" &&
        currentIntent.amount &&
        currentIntent.token &&
        currentIntent.recipient
      ) {
        if (!account) {
          addAssistantMessage("⚠️ **Wallet not connected**\n\nPlease connect your wallet to execute the transfer.");
          clearIntent();
          return;
        }

        // Validate supported token
        const supportedTokens = ["STRK", "USDC", "USDT"];
        if (!supportedTokens.includes(currentIntent.token)) {
          addAssistantMessage(`⚠️ **Unsupported Token**\n\nI currently only support **STRK**, **USDC**, and **USDT** for anonymous transfers.\n\nPlease try again with one of these tokens.`);
          clearIntent();
          return;
        }

        // Validate minimum amount
        if (currentIntent.amount < 10) {
          addAssistantMessage(`⚠️ **Amount too low**\n\nMinimum transfer amount is **10 ${currentIntent.token}**. Please try again with a larger amount.`);
          clearIntent();
          return;
        }

        // Validate balance
        const tokenBalance = balances?.find(
          (b) => b.token === currentIntent.token
        );
        
        if (!tokenBalance || parseFloat(tokenBalance.balance) < currentIntent.amount) {
          addAssistantMessage(`⚠️ **Insufficient balance**\n\nYou need at least **${currentIntent.amount} ${currentIntent.token}** to complete this transfer.\n\nCurrent balance: ${tokenBalance?.balance || "0"} ${currentIntent.token}\n\nPlease fund your wallet and try again.`);
          clearIntent();
          return;
        }

        try {
          console.log("Executing transfer:", currentIntent);
          
          await typhoonService.executeTransfer(
            account,
            {
              amount: currentIntent.amount,
              token: currentIntent.token,
              recipient: currentIntent.recipient,
            },
            (status, message) => {
              toast.info(message, {
                id: "typhoon-status",
                duration: status === "success" || status === "error" ? 4000 : 100000,
              });
            }
          );
          
          clearIntent();
        } catch (error) {
          console.error("Transfer execution failed:", error);
          addAssistantMessage("❌ **Transfer failed**\n\nSomething went wrong while processing your request. Please try again.");
          clearIntent();
        }
      }
    };

    handleTransfer();
  }, [isLoading, currentIntent, account, clearIntent, addAssistantMessage]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!walletConnected) {
      addAssistantMessage("⚠️ **Wallet not connected**\n\nPlease connect your wallet to chat with Nixo AI.");
      return;
    }

    const message = input;
    setInput("");
    await addMessage(message);
  };

  const handleSuggestedAction = (action: string) => {
    if (!walletConnected) {
      addAssistantMessage("⚠️ **Wallet not connected**\n\nPlease connect your wallet to use this action.");
      return;
    }
    addMessage(action);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/50 backdrop-blur-sm rounded-xl border border-slate-800/50 overflow-hidden shadow-2xl">
      <div className="bg-purple-700 p-4 text-white font-semibold flex items-center gap-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        Nixo AI Assistant
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-3xl">🌪️</span>
            </div>
            <p className="text-lg font-medium text-slate-300">
              Nixo AI with Typhoon
            </p>
            <p className="text-sm text-slate-500 max-w-xs text-center">
              Your privacy-focused DeFi assistant. Connect wallet to start.
            </p>
          </div>
        )}

        {messages.map((message, idx) => {
          // Don't render empty assistant messages (waiting for stream)
          if (message.type === "assistant" && !message.content && message.streaming) {
            return null;
          }

          return (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              } animate-in fade-in duration-300`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.type === "user"
                    ? "bg-purple-700 text-white rounded-br-none"
                    : "bg-slate-800/80 text-slate-100 rounded-bl-none border border-slate-700/50"
                }`}
              >
                <div className="text-sm leading-relaxed break-words prose prose-invert prose-sm max-w-none">
                  {message.type === "assistant" ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({ node, ...props }) => (
                          <a
                            {...props}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300 underline"
                          />
                        ),
                        code: ({ node, className, children, ...props }) => {
                          const inline = !className;
                          return inline ? (
                            <code
                              {...props}
                              className="bg-slate-900/50 px-1.5 py-0.5 rounded text-purple-300 font-mono text-xs"
                            >
                              {children}
                            </code>
                          ) : (
                            <code
                              {...props}
                              className="block bg-slate-900/50 p-3 rounded-lg overflow-x-auto font-mono text-xs my-2"
                            >
                              {children}
                            </code>
                          );
                        },
                        pre: ({ node, ...props }) => (
                          <pre {...props} className="bg-slate-900/50 p-3 rounded-lg overflow-x-auto my-2" />
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
                <p
                  className={`text-xs mt-2 ${
                    message.type === "user"
                      ? "text-purple-200/70"
                      : "text-slate-400"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="bg-slate-800/80 text-slate-100 px-4 py-3 rounded-lg border border-slate-700/50 rounded-bl-none">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200" />
                </div>
                <span className="text-sm text-slate-400">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSendMessage}
        className="border-t border-slate-800/50 p-4 bg-slate-900/50 backdrop-blur"
      >
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              walletConnected
                ? "Ask me anything... e.g., 'Send 10 STRK to...'"
                : "Connect your wallet to start chatting"
            }
            className="flex-1 bg-slate-900 text-white placeholder-slate-500 rounded-lg px-4 py-3 border border-slate-700/50 focus:border-purple-500 focus:outline-none transition-colors disabled:opacity-50"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-purple-700 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-4 py-3 transition-all flex items-center justify-center gap-2 font-semibold cursor-pointer"
          >
            {isLoading ? (
              <Loader size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
            <span className="hidden sm:inline ">Send</span>
          </button>
        </div>
      </form>
    </div>
  );
}
