"use client";

import {
  Lock,
  Zap,
  MessageSquare,
  Shield,
  Download,
  Wallet,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Lock,
    title: "Zero-Knowledge Privacy",
    description:
      "Powered by Typhoon Protocol. Complete anonymity between sender and recipient with no on-chain link.",
    highlight: true,
  },
  {
    icon: Zap,
    title: "Gasless Transfers",
    description:
      "AVNU Paymaster covers all gas fees. Send funds completely free, no hidden charges.",
    highlight: true,
  },
  {
    icon: MessageSquare,
    title: "Natural Language AI",
    description:
      'Just tell the AI what you want. "Send 10 STRK to...", "Pay 50 USDC", "Check my balance".',
  },
  {
    icon: Shield,
    title: "Non-Custodial",
    description:
      "Your wallet stays under your control. We never hold or access your funds.",
  },
  {
    icon: Download,
    title: "Auto-Backup Notes",
    description:
      "Automatically download transaction notes. Recover interrupted transfers anytime.",
  },
  {
    icon: Wallet,
    title: "Multi-Wallet Support",
    description:
      "Works with ArgentX, Braavos, and all Starknet-compatible wallets.",
  },
];

export default function Features() {
  return (
    <section className="relative border-b border-border/50 overflow-hidden">
      <div className="absolute top-1/3 left-0 w-[600px] h-[600px] -translate-x-1/3 rounded-full blur-3xl bg-gradient-to-r from-secondary/8 via-primary/8 to-transparent opacity-50" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-3xl bg-accent/5 opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center mb-20">
          <h2 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6 text-balance">
            Powerful Features Built For Privacy
          </h2>
          <p className="text-lg text-foreground/60 max-w-3xl mx-auto leading-relaxed">
            Everything you need for truly anonymous, gasless crypto transfers
            with enterprise-grade security
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`group relative p-8 rounded-2xl border transition-all duration-300 ${
                  feature.highlight
                    ? "border-primary/40 bg-gradient-to-br from-primary/8 to-accent/5 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/20"
                    : "border-border/50 bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
                }`}
              >
                <div
                  className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    feature.highlight
                      ? "bg-gradient-to-br from-primary/10 to-transparent"
                      : "bg-gradient-to-br from-primary/5 to-transparent"
                  }`}
                />

                <div className="relative">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 ${
                      feature.highlight
                        ? "bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/30 group-hover:shadow-lg group-hover:shadow-primary/30"
                        : "bg-primary/10 border border-primary/20 group-hover:bg-primary/20"
                    }`}
                  >
                    <Icon className="w-7 h-7 text-primary" />
                  </div>

                  <h3 className="text-lg font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-foreground/60 text-sm leading-relaxed mb-3">
                    {feature.description}
                  </p>

                  {feature.highlight && (
                    <div className="flex items-center gap-2 text-xs text-primary font-medium mt-4 pt-4 border-t border-primary/20">
                      <CheckCircle2 className="w-4 h-4" />
                      Verified Secure
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
