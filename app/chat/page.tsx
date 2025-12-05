"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Wallet,
  LogOut,
  Zap,
  Shield,
  Eye,
  Copy,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Chatbot from "@/components/chats/chatbot";
import BalanceSkeleton from "@/components/chats/balance-skeleton";

export default function AppPage() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [loadingBalances, setLoadingBalances] = useState(false);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    // Simulate wallet connection delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsWalletConnected(true);
    setWalletAddress("0x1234567890123456789012345678901234...5678");
    setLoadingBalances(true);
    // Simulate balance loading
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoadingBalances(false);
  };

  const handleDisconnect = () => {
    setIsWalletConnected(false);
    setWalletAddress("");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      toast.success("Address copied!", {
        description: "Wallet address copied to clipboard",
      });
    } catch (error) {
      toast.error("Failed to copy", {
        description: "Please try again or copy manually",
      });
      console.error("Failed to copy address:", error);
    }
  };

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-purple-600 rounded-full orb-glow animate-float-slow" />
        <div className="absolute bottom-1/3 -right-40 w-80 h-80 bg-purple-500 rounded-full orb-glow animate-float-slower" />
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-700 rounded-full orb-glow animate-float-slow"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-purple-950/50 bg-black/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft size={20} />
              Back to Home
            </Link>

            <h1 className="text-2xl font-bold text-purple-400">Nixo</h1>

            {isWalletConnected ? (
              <button
                onClick={handleDisconnect}
                className="flex items-center gap-2 bg-red-950/40 hover:bg-red-950/60 text-red-400 px-4 py-2 rounded-lg transition-colors border border-red-900/50 font-medium cursor-pointer"
              >
                <LogOut size={16} />
                Disconnect
              </button>
            ) : (
              <button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="flex items-center gap-2 bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-all cursor-pointer font-semibold"
              >
                <Wallet size={16} />
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
            )}
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!isWalletConnected ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="bg-slate-950/60 backdrop-blur rounded-2xl border border-purple-900/50 p-12 max-w-md w-full text-center shadow-2xl">
                <div className="bg-purple-700 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-8 animate-in fade-in duration-500">
                  <Wallet size={40} className="text-white" />
                </div>

                <h2 className="text-3xl font-bold mb-4 text-white">
                  Connect Your Wallet
                </h2>
                <p className="text-slate-300 mb-8 leading-relaxed">
                  Connect your Starknet wallet to start making anonymous,
                  gasless transfers with Nixo.
                </p>

                <button
                  onClick={handleConnectWallet}
                  disabled={isConnecting}
                  className="w-full bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white font-semibold py-4 rounded-lg mb-4 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isConnecting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet size={18} />
                      Connect Wallet
                    </>
                  )}
                </button>

                <p className="text-xs text-slate-400">
                  Supports ArgentX, Braavos, and all Starknet wallets
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Chat Section */}
              <div className="lg:col-span-2">
                <div className="h-[650px]">
                  <Chatbot
                    walletConnected={isWalletConnected}
                    walletAddress={walletAddress}
                  />
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Wallet Info Card */}
                <div className="bg-slate-950/60 backdrop-blur rounded-xl border border-purple-900/50 p-6 shadow-lg">
                  <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">
                    Connected Wallet
                  </h3>
                  <div className="bg-slate-900/50 rounded-lg p-3 mb-3">
                    <p className="text-xs font-mono text-purple-400 break-all">
                      {walletAddress}
                    </p>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900/50 hover:bg-slate-900 text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium border border-slate-800/50"
                  >
                    <Copy size={14} />
                    Copy Address
                  </button>
                </div>

                {/* Balance Card */}
                <div className="bg-slate-950/60 backdrop-blur rounded-xl border border-purple-900/50 p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                      Balances
                    </h3>
                    {loadingBalances && (
                      <div className="w-4 h-4 border-2 border-purple-600/30 border-t-purple-400 rounded-full animate-spin" />
                    )}
                  </div>
                  {loadingBalances ? (
                    <BalanceSkeleton />
                  ) : (
                    <div className="space-y-3">
                      {[
                        { token: "STRK", amount: "150.50" },
                        { token: "USDC", amount: "500.5" },
                        { token: "USDT", amount: "250" },
                      ].map((balance) => (
                        <div
                          key={balance.token}
                          className="flex justify-between items-center bg-slate-900/30 px-3 py-2 rounded-lg hover:bg-slate-900/50 transition-colors"
                        >
                          <span className="text-slate-300">
                            {balance.token}
                          </span>
                          <span className="font-semibold text-white">
                            {balance.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Features Card */}
                <div className="bg-slate-950/60 backdrop-blur rounded-xl border border-purple-900/50 p-6 shadow-lg">
                  <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">
                    Features
                  </h3>
                  <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-center gap-2">
                      <Shield size={16} className="text-purple-400" />
                      Zero-Knowledge Privacy
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap size={16} className="text-purple-400" />
                      Gasless Transfers
                    </li>
                    <li className="flex items-center gap-2">
                      <Eye size={16} className="text-purple-400" />
                      Non-Custodial
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
