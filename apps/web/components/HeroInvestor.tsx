"use client"
import { Zap } from "lucide-react";
import Link from "next/link";
// import { useState } from "react";
import { LayeredCube3D } from "./LayeredCube3D";
import { BackgroundRippleEffect } from "./ui/background-ripple-effect";
import { RippleButton } from "./ui/ripple-button";

export function HeroInvestor() {
  // const [email, setEmail] = useState("");
  // const [isSubmitted, setIsSubmitted] = useState(false);

  // const handleWaitlistSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (email) {
  //     console.log("Waitlist signup:", email);
  //     setIsSubmitted(true);
  //     setTimeout(() => {
  //       setEmail("");
  //       setIsSubmitted(false);
  //     }, 3000);
  //   }
  // };

  return (
    <main className="min-h-screen w-full bg-background text-foreground overflow-hidden relative">
      <div className="absolute inset-0 w-full h-full">
       <BackgroundRippleEffect />
      </div>

      <div className="relative flex flex-col items-center justify-around min-h-screen px-4 sm:px-6 md:px-8">
        <div className="z-10 flex flex-col items-center text-center max-w-6xl mx-auto w-full">
          <div className="mb-6 md:mb-8 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-accent/10 border border-accent/30 backdrop-blur-sm">
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
            <span className="text-xs sm:text-sm text-accent">
              Investor Demo & Waitlist
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl tracking-tight mb-4 md:mb-6 text-balance px-2">
            X-Ray Vision for Your dApp
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mb-6 md:mb-8 text-balance leading-relaxed px-4">
            We&apos;re building the first AI-powered analytics
            platform that transforms on-chain data into
            actionable intelligence. Understand your community,
            identify power users, and make data-driven
            decisions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-10 md:mb-16 items-center justify-center w-full sm:w-auto px-4">
            <RippleButton
              className="w-full sm:w-48 h-11 sm:h-12 bg-accent hover:bg-accent/90 text-accent-foreground border-accent rounded-xl"
              rippleColor="#ff6b35"
            >
              Join Waitlist 
            </RippleButton>
            <Link href="/dapp">
            <RippleButton
              className="w-full sm:w-48 h-11 sm:h-12 bg-transparent hover:bg-accent/10 text-foreground border-accent/50 hover:border-accent rounded-xl"
              rippleColor="#ff6b35"
            >
              View Demo
            </RippleButton>
            </Link>
          </div>
          <LayeredCube3D />
        </div>
      </div>
    </main>
  );
}