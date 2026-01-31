"use client"
import { ArrowRight, CheckCircle2, Zap } from "lucide-react";
import { useState } from "react";
import { MacbookMockup } from "./MacbookMockup";
import { BackgroundRippleEffect } from "./ui/background-ripple-effect";
import { RippleButton } from "./ui/ripple-button";

export function HeroInvestor() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const previewImage:string = "/heroComponent.png";
  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // In a real app, this would send to your backend
      console.log("Waitlist signup:", email);
      setIsSubmitted(true);
      setTimeout(() => {
        setEmail("");
        setIsSubmitted(false);
      }, 3000);
    }
  };

  return (
    <main className="min-h-screen w-full bg-background text-foreground overflow-hidden relative">
      {/* Sparkles Background */}
         <BackgroundRippleEffect />
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-16 sm:px-6 md:px-8 md:py-20">
        <div className="z-10 flex flex-col items-center text-center max-w-6xl mx-auto w-full">
          {/* Badge */}
          <div className="mb-6 md:mb-8 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-accent/10 border border-accent/30 backdrop-blur-sm">
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
            <span className="text-xs sm:text-sm text-accent">Currently Building - Join the Waitlist</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl tracking-tight mb-4 md:mb-6 text-balance px-2">
            X-Ray Vision for Your dApp
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mb-6 md:mb-8 text-balance leading-relaxed px-4">
            We&apos;re building the first AI-powered analytics platform that transforms on-chain data into actionable 
            intelligence. Understand your community, identify power users, and make data-driven decisions.
          </p>

          {/* Waitlist Form */}
          {!isSubmitted ? (
            <form onSubmit={handleWaitlistSubmit} className="w-full max-w-md mb-8 md:mb-12 px-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 h-12 px-4 rounded-xl bg-card border border-accent/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
                  required
                />
                <RippleButton
                  type="submit"
                  className="w-full sm:w-auto h-12 px-8 bg-accent hover:bg-accent/90 text-accent-foreground border-accent rounded-xl whitespace-nowrap"
                  rippleColor="#ff6b35"
                >
                  Join Waitlist
                  <ArrowRight className="w-4 h-4 ml-2 inline" />
                </RippleButton>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Be the first to experience BlockSight. No spam, just early access.
              </p>
            </form>
          ) : (
            <div className="w-full max-w-md mb-8 md:mb-12 px-4">
              <div className="flex items-center justify-center gap-2 h-12 px-4 rounded-xl bg-accent/10 border border-accent/30 text-accent">
                <CheckCircle2 className="w-5 h-5" />
                <span>You&apos;re on the list! Check your email.</span>
              </div>
            </div>
          )}

          {/* MacBook Mockup */}
          <MacbookMockup 
            imageSrc={previewImage}
            imageAlt="BlockSight analytics dashboard preview"
          />
        </div>
      </div>
    </main>
  );
}
