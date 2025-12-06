"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Wallet,
  LogOut,
  Copy,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import type { Connector } from "@starknet-react/core";
import Chatbot from "@/components/chats/chatbot";
import { useTokenBalances } from "@/hooks/use-token-balances";

export default function AppPage() {
  const { address, isConnected, account } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { balances } = useTokenBalances();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showBalances, setShowBalances] = useState(false);

  const handleConnectWallet = (connector: Connector) => {
    connect({ connector });
    setShowWalletModal(false);
  };

  const handleDisconnect = () => {
    disconnect();
    setShowBalances(false);
  };

  const copyToClipboard = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      toast.success("Address copied!", {
        description: "Wallet address copied to clipboard",
      });
    } catch (error) {
      toast.error("Failed to copy");
      console.error("Failed to copy address:", error);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navbar */}
      <nav className="border-b border-slate-800/50 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Back button */}
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back</span>
            </Link>

            {/* Center: Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Nixo AI
              </h1>
            </div>

            {/* Right: Wallet & Balances */}
            <div className="flex items-center gap-3">
              {isConnected ? (
                <>
                  {/* Balances Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowBalances(!showBalances)}
                      className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/50 transition-colors text-sm"
                    >
                      <span className="text-slate-300">Balances</span>
                      <ChevronDown size={16} className="text-slate-400" />
                    </button>
                    
                    {showBalances && (
                      <div className="absolute right-0 mt-2 w-48 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-lg shadow-xl p-3 space-y-2">
                        {balances.map((bal) => (
                          <div key={bal.token} className="flex justify-between text-sm">
                            <span className="text-slate-400">{bal.token}:</span>
                            <span className="text-white font-mono">{parseFloat(bal.balance).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Wallet Address */}
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-900/20 border border-purple-500/30">
                    <Wallet size={16} className="text-purple-400" />
                    <span className="text-sm font-mono text-slate-200">
                      {formatAddress(address!)}
                    </span>
                    <button
                      onClick={copyToClipboard}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <Copy size={14} />
                    </button>
                  </div>

                  {/* Disconnect Button */}
                  <button
                    onClick={handleDisconnect}
                    className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-red-500/50 hover:bg-red-900/20 transition-colors"
                    title="Disconnect"
                  >
                    <LogOut size={16} className="text-slate-400" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowWalletModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors text-white font-semibold"
                >
                  <Wallet size={18} />
                  <span>Connect Wallet</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Centered Chatbot */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="h-[calc(100vh-120px)]">
          <Chatbot
            walletConnected={isConnected || false}
            walletAddress={address}
            balances={balances}
            account={account}
          />
        </div>
      </main>

      {/* Wallet Selection Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Connect Wallet</h2>
              <button
                onClick={() => setShowWalletModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {connectors.map((connector) => {
                const iconUrl = typeof connector.icon === 'object' && connector.icon?.dark 
                  ? connector.icon.dark 
                  : typeof connector.icon === 'string' 
                  ? connector.icon 
                  : null;

                return (
                  <button
                    key={connector.id}
                    onClick={() => handleConnectWallet(connector)}
                    className="w-full flex items-center gap-3 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/50 hover:bg-slate-800 transition-all group"
                  >
                    {iconUrl && (
                      <img
                        src={iconUrl}
                        alt={connector.name}
                        className="w-8 h-8"
                      />
                    )}
                    <span className="text-white font-medium group-hover:text-purple-400 transition-colors">
                      {connector.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="mt-6 text-sm text-slate-400 text-center">
              By connecting, you agree to our Terms of Service
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
