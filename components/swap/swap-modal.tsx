"use client";

import React, { useState, useEffect } from "react";
import { X, ArrowDown, RefreshCw, Loader2 } from "lucide-react";
import { useBalance } from "@starknet-react/core";
import type { AccountInterface } from "starknet";
import { createPortal } from "react-dom";
import {
  fetchSwapQuote,
  executeSwapTransaction,
  formatTokenAmount,
  getTokenDecimals,
} from "@/lib/avnu-service";
import type { SwapQuote } from "@/lib/avnu-service";
import { TOKEN_ADDRESSES, type TokenSymbol } from "@/lib/tokens";
import TokenSelector from "./token-selector";
import { toast } from "sonner";

interface SwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  account?: AccountInterface;
  address?: string;
}

export default function SwapModal({
  isOpen,
  onClose,
  account,
  address,
}: SwapModalProps) {
  const [sellToken, setSellToken] = useState<TokenSymbol>("ETH");
  const [buyToken, setBuyToken] = useState<TokenSymbol>("STRK");
  const [sellAmount, setSellAmount] = useState("");
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [swapping, setSwapping] = useState(false);

  // Fetch sell token balance
  const { data: sellBalance } = useBalance({
    address: address as `0x${string}`,
    token: TOKEN_ADDRESSES[sellToken] as `0x${string}`,
    refetchInterval: 10000,
    watch: true,
  });

  // Fetch quote when sell amount or tokens change
  useEffect(() => {
    const fetchQuote = async () => {
      if (!sellAmount || parseFloat(sellAmount) <= 0 || !address) {
        setQuote(null);
        return;
      }

      setLoading(true);
      try {
        const quoteResult = await fetchSwapQuote({
          sellToken,
          buyToken,
          sellAmount: parseFloat(sellAmount),
          takerAddress: address,
        });

        setQuote(quoteResult);
      } catch (err) {
        console.error("Quote fetch failed", err);
        toast.error("Failed to fetch quote");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchQuote, 500);
    return () => clearTimeout(timer);
  }, [sellAmount, sellToken, buyToken, address]);

  // Execute swap
  const handleSwap = async () => {
    if (!account || !quote) return;

    try {
      setSwapping(true);
      toast.info("Confirm the transaction in your wallet...");

      const result = await executeSwapTransaction(
        account,
        quote.rawQuote,
        0.01 // 1% slippage
      );

      if (result.success) {
        toast.success("Swap successful! Your balance will update shortly.");
        onClose();
        setSellAmount("");
        setQuote(null);
      } else {
        if (result.error?.includes("rejected")) {
          toast.error("Transaction rejected");
        } else {
          toast.error(result.error || "Swap failed");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Swap failed. Please try again.");
    } finally {
      setSwapping(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
      onClick={onClose}
    >
      <div
        className="bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-purple-500/20 w-full max-w-md overflow-hidden border border-purple-500/30 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-purple-500/20 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="bg-purple-600 hover:animate-spin text-white p-1.5 rounded-lg">
              <RefreshCw size={16} />
            </div>
            <span className="font-bold text-white">Swap Tokens</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Sell Token Selector */}
          <TokenSelector
            selectedToken={sellToken}
            onSelect={setSellToken}
            label="From"
            excludeToken={buyToken}
          />

          {/* Sell Amount Input */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-purple-500/20">
            <div className="flex justify-between text-xs text-slate-400 mb-2 uppercase font-semibold tracking-wider">
              <span>Amount</span>
              {sellBalance && (
                <span>
                  Balance:{" "}
                  {parseFloat(sellBalance.formatted).toFixed(
                    sellToken === "ETH" ? 4 : 2
                  )}
                </span>
              )}
            </div>
            <input
              type="number"
              value={sellAmount}
              onChange={(e) => setSellAmount(e.target.value)}
              placeholder="0.0"
              className="bg-transparent text-2xl font-mono outline-none w-full placeholder:text-slate-600 text-white cursor-text"
            />
            {loading && (
              <div className="mt-2 text-xs text-purple-400 animate-pulse">
                Fetching quote...
              </div>
            )}
          </div>

          {/* Swap Direction Button */}
          <div className="flex justify-center -my-2 relative z-10">
            <button
              onClick={() => {
                setSellToken(buyToken);
                setBuyToken(sellToken);
                setSellAmount("");
                setQuote(null);
              }}
              className="bg-slate-800 border border-purple-500/30 p-2 rounded-full shadow-sm text-purple-400 hover:bg-purple-500/10 transition-colors cursor-pointer"
            >
              <ArrowDown size={16} />
            </button>
          </div>

          {/* Buy Token Selector */}
          <TokenSelector
            selectedToken={buyToken}
            onSelect={setBuyToken}
            label="To"
            excludeToken={sellToken}
          />

          {/* Buy Amount Display */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-purple-500/20">
            <div className="flex justify-between text-xs text-slate-400 mb-2 uppercase font-semibold tracking-wider">
              <span>You Receive (Estimated)</span>
            </div>
            <div className="text-2xl font-mono text-white">
              {loading ? (
                <Loader2 className="animate-spin text-slate-400" size={24} />
              ) : quote ? (
                formatTokenAmount(quote.buyAmount, getTokenDecimals(buyToken))
              ) : (
                "0.0"
              )}
            </div>
          </div>

          {/* Rate Info */}
          {quote && !loading && (
            <div className="flex justify-between items-center text-xs text-slate-400 px-1">
              <span>Exchange Rate</span>
              <span className="text-purple-400 font-medium">
                1 {sellToken} ≈ {quote.rate.toFixed(4)} {buyToken}
              </span>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleSwap}
            disabled={!quote || swapping || loading || !account}
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {swapping ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Confirming...
              </>
            ) : (
              <>
                <RefreshCw size={18} />
                Swap to {buyToken}
              </>
            )}
          </button>

          <div className="text-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">
              Powered by AVNU
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
