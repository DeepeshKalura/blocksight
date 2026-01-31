import { cn } from "@/lib/utils";
import {
  BarChart3,
  Brain,
  Network,
  Target,
  Users,
  Zap
} from "lucide-react";
import { Badge } from "./ui/badge";

export function FeaturesSection() {
  const features = [
    {
      icon: Users,
      title: "Member Intelligence",
      description: "Deep profiles of every community member with activity scores, engagement patterns, and contribution history."
    },
    {
      icon: Network,
      title: "Cross-DAO Analysis",
      description: "See where your members are active across the entire Web3 ecosystem and identify overlap opportunities."
    },
    {
      icon: BarChart3,
      title: "Wallet Analytics",
      description: "Understand token holdings, transaction volumes, and on-chain behavior to segment your community."
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Natural language queries that turn complex blockchain data into actionable strategic recommendations."
    },
    {
      icon: Target,
      title: "Engagement Scoring",
      description: "Automatic ranking of members by activity, contribution value, and community impact."
    },
    {
      icon: Zap,
      title: "Real-Time Updates",
      description: "Live monitoring of community activity with instant alerts on significant changes or opportunities."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 relative">
      <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-12 md:mb-16">
        <Badge variant="outline" className="mb-2 border-accent/30 text-accent text-xs sm:text-sm">Features</Badge>
        <h2 className="text-2xl sm:text-3xl md:text-4xl px-4">
          Turn Data Into <span className="text-accent">Strategic Advantage</span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
          Comprehensive tools to understand, analyze, and grow your DAO community.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative z-10">
        {features.map((feature, index) => (
          <Feature key={feature.title} {...feature} index={index} />
        ))}
      </div>
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon: Icon,
  index,
}: {
  title: string;
  description: string;
  icon: any;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-8 md:py-10 relative group/feature border-border",
        (index === 0 || index === 3) && "lg:border-l",
        index < 3 && "lg:border-b"
      )}
    >
      {index < 3 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-accent/5 to-transparent pointer-events-none" />
      )}
      {index >= 3 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-6 sm:px-8 md:px-10 text-accent">
        <Icon className="h-8 w-8 sm:h-10 sm:w-10" />
      </div>
      <div className="text-base sm:text-lg mb-2 relative z-10 px-6 sm:px-8 md:px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-border group-hover/feature:bg-accent transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-foreground">
          {title}
        </span>
      </div>
      <p className="text-sm sm:text-base text-muted-foreground max-w-xs relative z-10 px-6 sm:px-8 md:px-10">
        {description}
      </p>
    </div>
  );
};
