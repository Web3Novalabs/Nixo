"use client";

import Link from "next/link";
import { Github, Twitter, Mail, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card/80 border-t border-border/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Nixo
            </h3>
            <p className="text-sm text-foreground/60 leading-relaxed mb-6">
              Privacy-first DeFi. Anonymous crypto transfers powered by
              Starknet, Typhoon Protocol, and AVNU.
            </p>
            <div className="flex gap-3">
              <Link
                href="#"
                className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                <Twitter className="w-5 h-5 text-primary" />
              </Link>
              <Link
                href="#"
                className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                <Github className="w-5 h-5 text-primary" />
              </Link>
              <Link
                href="#"
                className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                <Mail className="w-5 h-5 text-primary" />
              </Link>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider text-foreground/80">
              Product
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-foreground/60 hover:text-primary transition-colors font-medium"
                >
                  App
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-foreground/60 hover:text-primary transition-colors font-medium"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-foreground/60 hover:text-primary transition-colors font-medium"
                >
                  Security
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider text-foreground/80">
              Resources
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-foreground/60 hover:text-primary transition-colors font-medium"
                >
                  Docs
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-foreground/60 hover:text-primary transition-colors font-medium"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-foreground/60 hover:text-primary transition-colors font-medium"
                >
                  Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider text-foreground/80">
              Legal
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-foreground/60 hover:text-primary transition-colors font-medium"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-foreground/60 hover:text-primary transition-colors font-medium"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-foreground/60 hover:text-primary transition-colors font-medium"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-foreground/50">
              <p>&copy; 2025 Nixo. All rights reserved.</p>
            </div>
            <div className="flex items-center gap-1 text-sm text-foreground/50">
              <span>Built with</span>
              <Heart className="w-4 h-4 text-primary fill-primary" />
              <span>for privacy</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
