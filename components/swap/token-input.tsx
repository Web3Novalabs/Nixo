"use client";

import React from "react";
import Image from "next/image";

interface TokenInputProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  token: "ETH" | "STRK";
  balance?: string;
  readOnly?: boolean;
  loading?: boolean;
}

export default function TokenInput({
  label,
  value,
  onChange,
  token,
  balance,
  readOnly = false,
  loading = false,
}: TokenInputProps) {
  return (
    <div className="bg-slate-800/50 p-4 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-colors">
      <div className="flex justify-between text-xs text-slate-400 mb-2 uppercase font-semibold tracking-wider">
        <span>{label}</span>
        {balance && (
          <span>
            Balance: {balance} {token}
          </span>
        )}
      </div>
      <div className="flex justify-between items-center gap-3">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="0.0"
          readOnly={readOnly}
          className="bg-transparent text-2xl font-mono outline-none w-full placeholder:text-slate-600 text-white disabled:opacity-50 cursor-text"
          disabled={readOnly}
        />

        <div className="flex items-center gap-2 border border-purple-500/50 rounded-xl px-2 pr-6 py-1">
          <Image
            src={token === "ETH" ? "/ethImg.png" : "/strkImg.png"}
            alt={token}
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="font-bold text-sm flex items-center">{token}</span>
        </div>
      </div>
      {loading && (
        <div className="mt-2 text-xs text-purple-400 animate-pulse">
          Fetching quote...
        </div>
      )}
    </div>
  );
}
