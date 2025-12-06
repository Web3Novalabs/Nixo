"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Send, Loader } from "lucide-react";
import { useMessages } from "@/hooks/use-messages";
import SuggestedActions from "./suggested-actions";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
// import TransactionPreview from "./transaction-preview";

interface ChatbotProps {
  walletConnected: boolean;
  walletAddress?: string;
  balances?: { token: string; balance: string }[];
}

export default function Chatbot({
  walletConnected,
  walletAddress,
  balances,
}: ChatbotProps) {
  const { messages, isLoading, addMessage } = useMessages({
    isConnected: walletConnected,
    walletAddress,
    balances,
  });

  const [input, setInput] = useState("");
  // const [showTransactionPreview, setShowTransactionPreview] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-focus input when wallet is connected
  useEffect(() => {
    if (walletConnected && inputRef.current) {
      inputRef.current.focus();
    }
  }, [walletConnected, messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userInput = input;
    setInput("");
    await addMessage(userInput);
  };

  const handleSuggestedAction = async (action: string) => {
    setInput(action);
    // Small delay to show the input was filled
    await new Promise((resolve) => setTimeout(resolve, 100));
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/60 backdrop-blur rounded-xl border border-purple-900/50 overflow-hidden shadow-lg">
      <div className="bg-purple-700 p-4 text-white font-semibold flex items-center gap-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        Nixo AI Assistant
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 1 && !isLoading && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <p className="text-slate-400 text-sm">
                Quick actions to get started
              </p>
            </div>
            <SuggestedActions
              onAction={handleSuggestedAction}
              isLoading={isLoading}
            />
          </div>
        )}

        {messages.map((message, idx) => (
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
        ))}

        {isLoading && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="bg-slate-800/80 text-slate-100 px-4 py-3 rounded-lg border border-slate-700/50 rounded-bl-none">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200" />
                </div>
                <span className="text-sm">Thinking...</span>
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
            disabled={isLoading || !walletConnected}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || !walletConnected}
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

      {/* <TransactionPreview
        isOpen={showTransactionPreview}
        onCancel={() => setShowTransactionPreview(false)}
      /> */}
    </div>
  );
}
