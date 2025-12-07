"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Wallet,
  LogOut,
  Copy,
  ChevronDown,
  X,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import type { Connector } from "@starknet-react/core";
import Chatbot from "@/components/chats/chatbot";
import { useTokenBalances } from "@/hooks/use-token-balances";
import SwapModal from "@/components/swap/swap-modal";
import Image from "next/image";

export default function AppPage() {
  const { address, isConnected, account } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { balances } = useTokenBalances();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [showBalances, setShowBalances] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);

  const handleConnectWallet = (connector: Connector) => {
    connect({ connector });
    setShowWalletModal(false);
  };

  const handleDisconnect = () => {
    disconnect();
    setShowBalances(false);
    setShowDisconnectModal(false);
    toast.success("Wallet disconnected");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Navbar */}
      <nav className="border-b border-purple-500/10 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Back button */}
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-colors cursor-pointer"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline text-sm font-medium">Back</span>
            </Link>

            {/* Center: Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-lg font-semibold text-white tracking-tight">
                Nixo AI
              </h1>
            </div>

            {/* Right: Swap, Wallet & Balances */}
            <div className="flex items-center gap-3">
              {isConnected ? (
                <>
                  {/* Swap Button */}
                  <button
                    onClick={() => setShowSwapModal(true)}
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 transition-all text-white text-sm font-semibold cursor-pointer"
                  >
                    <RefreshCw size={14} />
                    <span>Swap</span>
                  </button>
                  {/* Balances Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowBalances(!showBalances)}
                      className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-purple-500/20 hover:border-purple-500/40 hover:bg-slate-800/70 transition-all text-sm cursor-pointer group"
                    >
                      <span className="text-slate-300 font-medium group-hover:text-white transition-colors">
                        Balances
                      </span>
                      <ChevronDown
                        size={14}
                        className={`text-purple-400 transition-transform duration-300 ${
                          showBalances ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {showBalances && (
                      <div className="absolute right-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-2xl shadow-purple-500/20 p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Your Assets
                          </span>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        </div>

                        {balances.map((bal, index) => {
                          const getTokenColor = (token: string) => {
                            switch (token) {
                              case "STRK":
                                return "from-purple-500 to-pink-500";
                              case "USDC":
                                return "from-blue-500 to-cyan-500";
                              case "USDT":
                                return "from-green-500 to-emerald-500";
                              case "ETH":
                                return "from-black-500 to-black-200";
                              default:
                                return "from-slate-500 to-slate-600";
                            }
                          };

                          const getTokenIcon = (token: string) => {
                            switch (token) {
                              case "STRK":
                                return "/strkImg.png";
                              case "USDC":
                                return "/usdcImg.png";
                              case "USDT":
                                return "/usdtImg.png";
                              case "ETH":
                                return "/ethImg.png";
                              default:
                                return "/strk.png";
                            }
                          };

                          return (
                            <div
                              key={bal.token}
                              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-purple-500/20 hover:border-purple-500/40 p-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer"
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${getTokenColor(
                                      bal.token
                                    )} flex items-center justify-center text-xl shadow-lg`}
                                  >
                                    <Image
                                      src={getTokenIcon(bal.token)}
                                      alt={bal.token}
                                      width={40}
                                      height={40}
                                      className="rounded-full"
                                    />
                                  </div>
                                  <div>
                                    <div className="text-sm font-bold text-white">
                                      {bal.token}
                                    </div>
                                    <div className="text-xs text-slate-400">
                                      Available
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-white font-mono">
                                    {parseFloat(bal.balance).toFixed(
                                      bal.token === "ETH" ? 4 : 2
                                    )}
                                  </div>
                                  <div className="text-xs text-purple-400 font-medium">
                                    $
                                    {(
                                      parseFloat(bal.balance) *
                                      (bal.token === "STRK" ? 1 : 1)
                                    ).toFixed(bal.token === "ETH" ? 4 : 2)}
                                  </div>
                                </div>
                              </div>

                              {/* Hover effect overlay */}
                              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Wallet Address */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <Wallet size={14} className="text-purple-400" />
                    <span className="text-sm font-mono text-slate-200">
                      {formatAddress(address!)}
                    </span>
                    <button
                      onClick={copyToClipboard}
                      className="text-slate-400 hover:text-purple-400 transition-colors cursor-pointer"
                    >
                      <Copy size={12} />
                    </button>
                  </div>

                  {/* Disconnect Button */}
                  <button
                    onClick={() => setShowDisconnectModal(true)}
                    className="p-2 rounded-lg bg-slate-800/50 border border-purple-500/20 hover:border-red-500/40 hover:bg-red-500/10 transition-all cursor-pointer"
                    title="Disconnect"
                  >
                    <LogOut size={14} className="text-slate-400" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowWalletModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-all text-white text-sm font-semibold cursor-pointer"
                >
                  <Wallet size={16} />
                  <span>Connect Wallet</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Centered Chatbot */}
      <main className="max-w-5xl mx-auto px-4 py-8 relative z-10">
        <div className="h-[calc(100vh-120px)]">
          <Chatbot
            walletConnected={isConnected || false}
            walletAddress={address}
            balances={balances}
            account={account}
            onSwapRequest={() => setShowSwapModal(true)}
          />
        </div>
      </main>

      {/* Wallet Selection Modal */}
      {showWalletModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200 cursor-pointer"
          onClick={() => setShowWalletModal(false)}
        >
          <div
            className="bg-slate-900/90 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-purple-500/10 animate-in zoom-in-95 duration-200 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                Connect Wallet
              </h2>
              <button
                onClick={() => setShowWalletModal(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2">
              {connectors.map((connector) => {
                const iconUrl =
                  typeof connector.icon === "object" && connector.icon?.dark
                    ? connector.icon.dark
                    : typeof connector.icon === "string"
                    ? connector.icon
                    : null;

                return (
                  <button
                    key={connector.id}
                    onClick={() => handleConnectWallet(connector)}
                    className="w-full flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-purple-500/20 hover:border-purple-500/40 hover:bg-slate-800 transition-all group cursor-pointer"
                  >
                    {iconUrl && (
                      <Image
                        src={iconUrl}
                        alt={connector.name}
                        className="w-8 h-8"
                        width={32}
                        height={32}
                      />
                    )}
                    <span className="text-white font-medium group-hover:text-purple-400 transition-colors">
                      {connector.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="mt-6 text-xs text-slate-500 text-center">
              By connecting, you agree to our Terms of Service
            </p>
          </div>
        </div>
      )}

      {/* Disconnect Confirmation Modal */}
      {showDisconnectModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200 cursor-pointer"
          onClick={() => setShowDisconnectModal(false)}
        >
          <div
            className="bg-slate-900/90 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 max-w-sm w-full shadow-2xl shadow-purple-500/10 animate-in zoom-in-95 duration-200 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                <LogOut size={20} className="text-red-500" />
              </div>

              <h2 className="text-lg font-semibold text-white mb-2">
                Disconnect Wallet?
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                Are you sure you want to disconnect your wallet? You&apos;ll
                need to reconnect to use Nixo AI.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDisconnectModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-slate-800/50 border border-purple-500/20 hover:bg-slate-800 hover:border-purple-500/40 transition-all text-white font-medium text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDisconnect}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all text-red-400 font-medium text-sm cursor-pointer"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Swap Modal */}
      <SwapModal
        isOpen={showSwapModal}
        onClose={() => setShowSwapModal(false)}
        account={account}
        address={address}
      />
    </div>
  );
}
