import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function CTASection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-accent via-accent/90 to-accent/70 p-8 sm:p-10 md:p-12 lg:p-16">
        {/* Pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="relative text-center space-y-5 sm:space-y-6 md:space-y-8 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur border border-white/20">
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
            <span className="text-white text-xs sm:text-sm">Start Your Free Trial Today</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white px-2">
            Stop Flying Blind. Start Leading with Data.
          </h2>
          
          <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2">
            Join forward-thinking DAOs that are using BlockSight to understand their communities and make strategic decisions with confidence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 h-10 sm:h-11 text-sm sm:text-base"
            />
            <Button size="lg" className="bg-white text-accent hover:bg-white/90 gap-2 flex-shrink-0 h-10 sm:h-11 text-sm sm:text-base">
              Get Started
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
          
          <p className="text-white/80 text-xs sm:text-sm">
            No credit card required • Free to start • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
