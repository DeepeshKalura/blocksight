"use client"
import { Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { LayeredCube3D } from "./LayeredCube3D";
import { BackgroundRippleEffect } from "./ui/background-ripple-effect";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { RippleButton } from "./ui/ripple-button";

export function HeroInvestor() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, planTier: "Hero Interest", typeUser: "General" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong.");

      toast.success("You're on the list! We'll be in touch.");
      setIsDialogOpen(false);
      setEmail('');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <main className="min-h-screen w-full bg-background text-foreground overflow-hidden relative">
        <div className="absolute inset-0 w-full h-full">
          <BackgroundRippleEffect />
        </div>
        <div className="relative flex flex-col items-center justify-around min-h-screen pt-24 md:pt-32 px-4 sm:px-6 md:px-8">
          <div className="z-10 flex flex-col items-center text-center max-w-6xl mx-auto w-full">
            <div className="mb-6 md:mb-8 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-accent/10 border border-accent/30 backdrop-blur-sm">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
              <span className="text-xs sm:text-sm text-accent">

                <Link
                  href="https://ethglobal.com/showcase/blocksight-vcsh3"
                  target="_blank"
                >
                  <span className="text-xs sm:text-sm text-muted-foreground group-hover:text-accent transition-colors">
                    View our <span className="text-accent font-semibold text-xs sm:text-sm uppercase tracking-wide">ETHGlobal</span> Hackathon Demo
                  </span>
                  <span className="text-xs sm:text-sm text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all duration-300">
                    →
                  </span>
                </Link>
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl tracking-tight mb-4 md:mb-6 text-balance px-2">
              X-Ray Vision for Your dApp
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mb-6 md:mb-8 text-balance leading-relaxed px-4">
              We&apos;re building the first AI-powered analytics platform that transforms on-chain data into actionable intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-10 md:mb-16 items-center justify-center w-full sm:w-auto px-4">
              <DialogTrigger asChild>
                <RippleButton
                  className="w-full sm:w-48 h-11 sm:h-12 bg-accent hover:bg-accent/90 text-accent-foreground border-accent rounded-xl"
                  rippleColor="#ff6b35"
                >
                  Join Waitlist
                </RippleButton>
              </DialogTrigger>
              <Link href="/dapp" className="w-full sm:w-auto">
                <RippleButton
                  className="w-full sm:w-48 h-11 sm:h-12 bg-transparent hover:bg-accent/10 text-foreground border-accent/50 hover:border-accent rounded-xl"
                  rippleColor="#ff6b35"
                >
                  View Demo
                </RippleButton>
              </Link>
            </div>
            <LayeredCube3D />
            {/* <MacbookVideo /> */}

          </div>
        </div>
      </main>
      <DialogContent className="sm:max-w-[425px] bg-card border-accent/30">
        <DialogHeader>
          <DialogTitle>Join the Waitlist</DialogTitle>
          <DialogDescription>Be the first to get access to BlockSight. Enter your email below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleWaitlistSubmit}>
          <div className="grid gap-4 py-4">
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="bg-background"
            />
          </div>
          <RippleButton type="submit" className="w-full bg-accent text-accent-foreground border-accent" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Notify Me'}
          </RippleButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}