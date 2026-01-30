import {
    BarChart3,
    Brain,
    Network,
    Target,
    Users,
    Zap
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

export function FeaturesSection() {
  const features = [
    {
      icon: Users,
      title: "User Intelligence",
      description: "Deep profiles of every user with activity scores, engagement patterns, and on-chain history."
    },
    {
      icon: Network,
      title: "Cross-Protocol Analysis",
      description: "See where your users are active across the entire Web3 ecosystem and identify overlap opportunities."
    },
    {
      icon: BarChart3,
      title: "Wallet Analytics",
      description: "Understand token holdings, transaction volumes, and on-chain behavior to segment your users."
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Natural language queries that turn complex blockchain data into actionable strategic recommendations."
    },
    {
      icon: Target,
      title: "User Scoring",
      description: "Automatic ranking of users by activity, on-chain value, and project impact."
    },
    {
      icon: Zap,
      title: "Real-Time Updates",
      description: "Live monitoring of user activity with instant alerts on significant changes or opportunities."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 relative">
      <div className="relative">
        <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-12 md:mb-16">
          <Badge variant="outline" className="mb-2 border-accent/30 text-accent text-xs sm:text-sm">Features</Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl px-4">
            Turn Data Into <span className="text-accent">Strategic Advantage</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            Comprehensive tools to understand, analyze, and grow your Web3 project.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-5 sm:p-6 bg-card border-border hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/10 group">
              <div className="space-y-3 sm:space-y-4">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}