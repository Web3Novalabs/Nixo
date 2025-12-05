"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="relative border-b border-border/50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-accent/5 to-secondary/8" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full blur-3xl bg-gradient-to-r from-primary/25 via-accent/15 to-secondary/10 opacity-20 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-3xl bg-secondary/10 opacity-40" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
        <h2 className="text-5xl sm:text-6xl font-bold tracking-tight mb-8 text-balance">
          Ready to Stay Anonymous?
        </h2>

        <p className="text-xl text-foreground/70 mb-12 max-w-2xl mx-auto leading-relaxed">
          Take control of your privacy with Typhoon. No signup, no KYC, no
          compromises. Just pure, anonymous crypto transfers.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 rounded-full px-10 font-semibold text-lg"
          >
            Launch App Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary/50 hover:bg-primary/10 hover:border-primary transition-all duration-300 rounded-full px-10 font-semibold text-lg bg-transparent"
          >
            Read Docs
          </Button>
        </div>

        <div className="mt-16 pt-16 border-t border-border/30">
          <p className="text-sm text-foreground/50 mb-10 font-medium uppercase tracking-wider">
            Why Choose Typhoon
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300">
              <div className="text-3xl font-bold text-primary mb-2">$0</div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <p className="text-sm text-foreground/70 font-medium">
                  Gas Fees
                </p>
              </div>
              <p className="text-xs text-foreground/50 mt-2">
                100% covered by AVNU
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300">
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <p className="text-sm text-foreground/70 font-medium">
                  Anonymous
                </p>
              </div>
              <p className="text-xs text-foreground/50 mt-2">
                Zero-knowledge proofs
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300">
              <div className="text-3xl font-bold text-primary mb-2">
                Your Control
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <p className="text-sm text-foreground/70 font-medium">
                  Non-Custodial
                </p>
              </div>
              <p className="text-xs text-foreground/50 mt-2">
                We never access funds
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
