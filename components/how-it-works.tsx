"use client";

const steps = [
  {
    number: "01",
    title: "Connect Wallet",
    description:
      "Connect with ArgentX, Braavos, or any Starknet wallet. Your keys, your control.",
    icon: "🔐",
  },
  {
    number: "02",
    title: "Chat with AI",
    description:
      'Use natural language. "What\'s my balance?" or "Send 10 STRK anonymously".',
    icon: "💬",
  },
  {
    number: "03",
    title: "Private Transfer",
    description:
      "Typhoon Protocol creates zero-knowledge proof. Sender and recipient remain anonymous.",
    icon: "🌪️",
  },
  {
    number: "04",
    title: "Gasless Execution",
    description: "AVNU Paymaster sponsors fees. No costs, instant completion.",
    icon: "⚡",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative border-b border-border/50 overflow-hidden">
      <div className="absolute bottom-1/2 right-0 w-[700px] h-[700px] rounded-full blur-3xl bg-gradient-to-l from-accent/15 to-primary/5 opacity-40" />
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full blur-3xl bg-secondary/8 opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center mb-20">
          <h2 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            How It Works
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Four simple steps to anonymous, gasless crypto transfers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {index < steps.length - 1 && (
                <>
                  <div className="hidden lg:block absolute top-24 left-full w-8 h-px bg-gradient-to-r from-primary/40 to-transparent" />
                  <div className="lg:hidden absolute top-full left-1/2 w-px h-8 bg-gradient-to-b from-primary/40 to-transparent" />
                </>
              )}

              <div className="relative p-8 rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/50 hover:border-primary/40 hover:from-card hover:to-primary/5 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 mb-6 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {step.number}
                  </span>
                </div>

                <div className="text-4xl mb-4">{step.icon}</div>

                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-foreground/60 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
