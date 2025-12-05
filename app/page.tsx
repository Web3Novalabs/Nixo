import Hero from "@/components/hero";
import Features from "@/components/features";
import HowItWorks from "@/components/how-it-works";
import CTA from "@/components/cta";
import Footer from "@/components/footer";

export const metadata = {
  title: "Nixo - Anonymous Crypto Transfers with AI",
  description:
    "Send crypto. Stay anonymous. No fees. Natural-language AI-powered private transfers powered by Starknet.",
};

export default function Home() {
  return (
    <main className="bg-background text-foreground">
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  );
}
