import { Brain, Database, LineChart, Rocket } from "lucide-react";
import { Card } from "./ui/card";

export function HowItWorks() {
  const steps = [
    {
      icon: Database,
      step: "01",
      title: "Connect Your DAO",
      description: "Connect your DAO's wallet addresses or smart contracts. We'll start indexing immediately."
    },
    {
      icon: Brain,
      step: "02",
      title: "AI Analyzes On-Chain Data",
      description: "Our AI scans blockchain transactions to build comprehensive profiles of every member."
    },
    {
      icon: LineChart,
      step: "03",
      title: "Get Actionable Insights",
      description: "View dashboards, reports, and AI-generated recommendations tailored to your community."
    },
    {
      icon: Rocket,
      step: "04",
      title: "Grow Strategically",
      description: "Make data-driven decisions to engage members, prevent churn, and scale your DAO."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
      <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl px-4">How It Works</h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
          From connection to insights in minutes. BlockSight makes complex blockchain analytics simple.
        </p>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
        {steps.map((stepItem, index) => (
          <div key={index} className="relative">
            {/* Connection line */}
            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-16 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-gradient-to-r from-accent/50 to-accent/20" />
            )}
            
            <Card className="p-5 sm:p-6 bg-card border-border hover:border-accent/50 transition-all relative group">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <stepItem.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <span className="text-3xl sm:text-4xl text-muted-foreground/20">
                    {stepItem.step}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg">{stepItem.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {stepItem.description}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
