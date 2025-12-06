"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { useMessages } from "@/hooks/use-messages";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { typhoonService } from "@/lib/typhoon-service";
import { toast } from "sonner";
import type { AccountInterface } from "starknet";
import type { TransferStatus } from "@/lib/typhoon-service";
import TransactionProgress from "./transaction-progress";
import BalanceCard from "./balance-card";

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
  const [transactionStatus, setTransactionStatus] =
    useState<TransferStatus | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    messages,
    isLoading,
    addMessage,
    addAssistantMessage,
    currentIntent,
    clearIntent,
  } = useMessages({
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

  // Track if a transaction is currently executing to prevent double execution
  const isExecutingTransfer = useRef(false);

  // Handle Transfer Intent
  useEffect(() => {
    const handleTransfer = async () => {
      // Prevent double execution
      if (isExecutingTransfer.current) {
        console.log("[Chatbot] Transfer already executing, skipping...");
        return;
      }

      if (
        !isLoading &&
        currentIntent &&
        currentIntent.type === "transfer" &&
        currentIntent.amount &&
        currentIntent.token &&
        currentIntent.recipient
      ) {
        if (!account) {
          addAssistantMessage(
            "⚠️ **Wallet not connected**\n\nPlease connect your wallet to execute the transfer."
          );
          clearIntent();
          return;
        }

        // Validate supported token
        const supportedTokens = ["STRK", "USDC", "USDT"];
        if (!supportedTokens.includes(currentIntent.token)) {
          addAssistantMessage(
            `⚠️ **Unsupported Token**\n\nI currently only support **STRK**, **USDC**, and **USDT** for anonymous transfers.\n\nPlease try again with one of these tokens.`
          );
          clearIntent();
          return;
        }

        // Validate minimum amount
        if (currentIntent.amount < 10) {
          addAssistantMessage(
            `⚠️ **Amount too low**\n\nMinimum transfer amount is **10 ${currentIntent.token}**. Please try again with a larger amount.`
          );
          clearIntent();
          return;
        }

        // Validate balance
        const tokenBalance = balances?.find(
          (b) => b.token === currentIntent.token
        );

        if (
          !tokenBalance ||
          parseFloat(tokenBalance.balance) < currentIntent.amount
        ) {
          addAssistantMessage(
            `⚠️ **Insufficient balance**\n\nYou need at least **${
              currentIntent.amount
            } ${
              currentIntent.token
            }** to complete this transfer.\n\nCurrent balance: ${
              tokenBalance?.balance || "0"
            } ${currentIntent.token}\n\nPlease fund your wallet and try again.`
          );
          clearIntent();
          return;
        }

        try {
          console.log("[Chatbot] Executing transfer:", currentIntent);

          // Mark as executing to prevent double execution
          isExecutingTransfer.current = true;

          await typhoonService.executeTransfer(
            account,
            {
              amount: currentIntent.amount,
              token: currentIntent.token,
              recipient: currentIntent.recipient,
            },
            (status, message) => {
              // Update transaction status for progress bar
              setTransactionStatus(status);

              // Toast notification
              toast.info(message, {
                id: "typhoon-status",
                duration:
                  status === "success" || status === "error" ? 4000 : 100000,
              });
            },
            (message) => {
              // Chat UI message
              addAssistantMessage(message);
            }
          );

          // Clear status after a delay to show success state
          setTimeout(() => {
            setTransactionStatus(null);
          }, 3000);

          clearIntent();
          isExecutingTransfer.current = false;
        } catch (error) {
          console.error("[Chatbot] Transfer execution failed:", error);

          // Show error state briefly
          setTransactionStatus("error");
          setTimeout(() => {
            setTransactionStatus(null);
          }, 3000);

          addAssistantMessage(
            "❌ **Transfer failed**\n\nSomething went wrong while processing your request. Please try again."
          );
          clearIntent();
          isExecutingTransfer.current = false;
        }
      }
    };

    handleTransfer();
  }, [
    isLoading,
    currentIntent,
    account,
    clearIntent,
    addAssistantMessage,
    balances,
  ]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!walletConnected) {
      addAssistantMessage(
        "⚠️ **Wallet not connected**\n\nPlease connect your wallet to chat with Nixo AI."
      );
      return;
    }

    const message = input;
    setInput("");
    await addMessage(message);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-purple-500/20 overflow-hidden shadow-2xl shadow-purple-500/5">
      {/* Header */}
      <div className="border-b border-purple-500/20 p-4 flex items-center gap-3 bg-slate-900/50">
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
        <span className="text-white font-medium text-sm">
          Nixo AI Assistant
        </span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <span className="text-3xl">🌪️</span>
            </div>
            <p className="text-base font-medium text-slate-300">
              Nixo AI with Typhoon
            </p>
            <p className="text-sm text-slate-500 max-w-xs text-center">
              Your privacy-focused DeFi assistant.{" "}
              {walletConnected
                ? "Ask me anything!"
                : "Connect wallet to start."}
            </p>
          </div>
        )}

        {messages.map((message) => {
          // Don't render empty assistant messages (waiting for stream)
          if (
            message.type === "assistant" &&
            !message.content &&
            message.streaming
          ) {
            return null;
          }

          // Check if this is a balance-related response
          // Only show BalanceCard if the message contains actual balance data (token symbols with colons)
          const isBalanceResponse =
            message.type === "assistant" &&
            message.content &&
            (message.content.includes("STRK:") ||
              message.content.includes("USDC:") ||
              message.content.includes("USDT:")) &&
            balances &&
            balances.length > 0;

          return (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              } animate-in fade-in duration-300`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl ${
                  message.type === "user"
                    ? "bg-purple-600 text-white"
                    : "bg-slate-800/60 text-slate-100 border border-purple-500/20"
                }`}
              >
                {/* Show BalanceCard for balance-related responses */}
                {isBalanceResponse ? (
                  <div className="space-y-3">
                    <div className="text-sm leading-relaxed">
                      Here are your current balances:
                    </div>
                    <BalanceCard balances={balances} />
                  </div>
                ) : (
                  <div className="text-sm leading-relaxed break-words prose prose-invert prose-sm max-w-none">
                    {message.type === "assistant" ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({ ...props }) => (
                            <a
                              {...props}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-400 hover:text-purple-300 underline"
                            />
                          ),
                          code: ({ className, children, ...props }) => {
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
                          pre: ({ ...props }) => (
                            <pre
                              {...props}
                              className="bg-slate-900/50 p-3 rounded-lg overflow-x-auto my-2"
                            />
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                )}
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

        {/* Transaction Progress Bar */}
        {transactionStatus &&
          transactionStatus !== "success" &&
          transactionStatus !== "error" && (
            <div className="flex justify-center animate-in fade-in duration-300">
              <TransactionProgress currentStatus={transactionStatus} />
            </div>
          )}

        {isLoading && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="bg-slate-800/60 border border-purple-500/20 px-4 py-3 rounded-xl">
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
        className="border-t border-purple-500/20 p-4 bg-slate-900/50"
      >
        <div className="flex gap-3">
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
            className="flex-1 bg-slate-800/50 text-white placeholder-slate-500 rounded-xl px-4 py-3 border border-purple-500/20 focus:border-purple-500/50 focus:outline-none transition-all disabled:opacity-50 text-sm cursor-text"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl px-5 py-3 transition-all flex items-center justify-center gap-2 font-medium cursor-pointer"
          >
            <Send size={16} />
            <span className="hidden sm:inline text-sm">Send</span>
          </button>
        </div>
      </form>
    </div>
  );
}
