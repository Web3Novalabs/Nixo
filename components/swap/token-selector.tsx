"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import type { TokenSymbol } from "@/lib/tokens";

interface TokenSelectorProps {
  selectedToken: TokenSymbol;
  onSelect: (token: TokenSymbol) => void;
  label: string;
  excludeToken?: TokenSymbol;
}

const TOKENS: { symbol: TokenSymbol; name: string; icon: string }[] = [
  { symbol: "ETH", name: "Ethereum", icon: "/ethImg.png" },
  { symbol: "STRK", name: "Starknet", icon: "/strkImg.png" },
  { symbol: "USDC", name: "USD Coin", icon: "/usdcImg.png" },
  { symbol: "USDT", name: "Tether USD", icon: "/usdtImg.png" },
];

export default function TokenSelector({
  selectedToken,
  onSelect,
  label,
  excludeToken,
}: TokenSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const availableTokens = TOKENS.filter((t) => t.symbol !== excludeToken);
  const selected = TOKENS.find((t) => t.symbol === selectedToken);

  return (
    <div className="relative">
      <label className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-2 block">
        {label}
      </label>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-slate-800/50 border border-purple-500/20 hover:border-purple-500/40 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <Image
            src={selected?.icon || "/strkImg.png"}
            alt={selected?.symbol || "Token"}
            width={32}
            height={32}
            className="rounded-full"
          />
          <div className="text-left">
            <div className="text-white font-bold">{selected?.symbol}</div>
            <div className="text-xs text-slate-400">{selected?.name}</div>
          </div>
        </div>
        <ChevronDown
          size={16}
          className={`text-purple-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 w-full bg-slate-900/95 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-2xl shadow-purple-500/20 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
            {availableTokens.map((token) => (
              <button
                key={token.symbol}
                onClick={() => {
                  onSelect(token.symbol);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-500/10 transition-colors cursor-pointer border-b border-purple-500/10 last:border-0"
              >
                <Image
                  src={token.icon}
                  alt={token.symbol}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div className="text-left">
                  <div className="text-white font-bold">{token.symbol}</div>
                  <div className="text-xs text-slate-400">{token.name}</div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
