"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/50">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full blur-3xl bg-gradient-to-br from-primary/15 to-accent/5 opacity-50 animate-pulse" />
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full blur-3xl bg-gradient-to-tr from-secondary/10 to-transparent opacity-40" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/40 bg-primary/8 hover:bg-primary/12 transition-all duration-300 cursor-pointer group">
            <Sparkles className="w-4 h-4 text-primary group-hover:animate-spin" />
            <span className="text-sm font-medium text-primary">
              Privacy-First DeFi on Starknet
            </span>
          </div>

          <div>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tighter text-balance leading-tight">
              Send Crypto.
              <span className="block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient">
                Stay Anonymous.
              </span>
              <span className="block text-foreground">No Fees.</span>
            </h1>
          </div>

          <p className="text-lg sm:text-xl text-foreground/70 max-w-3xl mx-auto text-balance leading-relaxed">
            Natural-language AI makes private, gasless crypto transfers as easy
            as texting. Powered by Typhoon Protocol, Starknet, and AVNU
            Paymaster.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link
              href="/chat"
              className="bg-gradient-to-r from-primary flex items-center to-accent text-primary-foreground hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 rounded-xl px-7 font-semibold cursor-pointer py-3.5"
            >
              Launch App
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link
              href="/chat"
              className="border hover:bg-foreground/5 transition-all duration-300 bg-transparent hover:border-[#8F7AFF] rounded-xl px-7 font-semibold py-3.5 cursor-pointer"
            >
              Watch Demo
            </Link>
          </div>

          <div className="pt-12 border-t border-border/30">
            <p className="text-sm text-foreground/50 mb-6 font-medium">
              Secured & Verified By Industry Leaders
            </p>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="font-mono text-sm font-semibold text-foreground/70">
                  STARKNET
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="font-mono text-sm font-semibold text-foreground/70">
                  TYPHOON
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <span className="font-mono text-sm font-semibold text-foreground/70">
                  AVNU
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
