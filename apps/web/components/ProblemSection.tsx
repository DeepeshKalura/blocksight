import { Activity, HelpCircle, Users, Wallet } from "lucide-react";
import { Card } from "./ui/card";

export function ProblemSection() {
  const challenges = [
    {
      icon: Users,
      question: "Who are your power users?",
      description:
        "Identify your power users and understand engagement patterns across your on-chain ecosystem. BlockSight analyzes on-chain activity to reveal who's truly driving your project forward, helping you recognize and reward key contributors.",
    },
    {
      icon: Activity,
      question: "Where are you losing them?",
      description:
        "Track user activity across protocols to understand retention and churn. Discover where users migrate, identify potential points of friction, and understand their broader Web3 journey.",
    },
    {
      icon: Wallet,
      question: "How do you drive real growth?",
      description:
        "Analyze user behavior and on-chain metrics to identify growth opportunities. Understand what drives engagement, optimize your strategies, and attract new users to your Web3 project.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 bg-gradient-to-b from-background to-background/50">
      <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-12 md:mb-16">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-accent/10 border border-accent/30 backdrop-blur-sm mb-3 sm:mb-4">
          <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
          <span className="text-xs sm:text-sm text-accent">The Real Challenge Every Web3 Project Faces</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl max-w-3xl mx-auto px-4">
          Understanding Your On-Chain Users Is <span className="text-accent">Mission Critical</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg px-4">
          Every Web3 project asks these questions. BlockSight gives you the answers.
        </p>
      </div>
      
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {challenges.map((challenge, index) => (
          <Card 
            key={index} 
            className="p-6 sm:p-7 md:p-8 bg-card border-border hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/10 group relative overflow-hidden"
          >
            {/* Background gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative space-y-3 sm:space-y-4">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors group-hover:scale-110 transform duration-300">
                <challenge.icon className="h-6 w-6 sm:h-7 sm:w-7 text-accent" />
              </div>
              <h3 className="text-lg sm:text-xl">{challenge.question}</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {challenge.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}