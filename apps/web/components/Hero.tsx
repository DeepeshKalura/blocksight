import { Zap } from "lucide-react";
import { MacbookMockup } from "./MacbookMockup";
import { BackgroundRippleEffect } from "./ui/background-ripple-effect";
import { RippleButton } from "./ui/ripple-button";

export function Hero() {
  const previewImage:string = "/heroComponent.png";
  return (
    <main className="min-h-screen w-full bg-background text-foreground overflow-hidden">
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-16 sm:px-6 md:px-8 md:py-20">
        <BackgroundRippleEffect />

        <div className="z-10 flex flex-col items-center text-center max-w-6xl mx-auto w-full">
          <div className="mb-6 md:mb-8 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-accent/10 border border-accent/30 backdrop-blur-sm">
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
            <span className="text-xs sm:text-sm text-accent">AI-Powered DAO Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl max-w-3xl tracking-tight font-medium mb-6 md:mb-8 text-balance px-4">
            See Your DAO Like Never Before
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-4xl mb-4 md:mb-6 leading-relaxed px-2">
            BlockSight transforms on-chain data into actionable intelligence. Understand your community, identify power
            users, and make data-driven decisions with AI-powered insights.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-10 md:mb-16 items-center justify-center w-full sm:w-auto px-4">
            <RippleButton
              className="w-full sm:w-48 h-11 sm:h-12 bg-accent hover:bg-accent/90 text-accent-foreground border-accent rounded-xl"
              rippleColor="#ff6b35"
            >
              Get Started 
            </RippleButton>

            <RippleButton
              className="w-full sm:w-48 h-11 sm:h-12 bg-transparent hover:bg-accent/10 text-foreground border-accent/50 hover:border-accent rounded-xl"
              rippleColor="#ff6b35"
            >
              Demo
            </RippleButton>
          </div>

          <MacbookMockup 
            imageSrc={previewImage}
            imageAlt="BlockSight analytics dashboard preview"
          />
        </div>
      </div>
    </main>
  );
}
