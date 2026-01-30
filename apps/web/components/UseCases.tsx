import { CheckCircle2 } from "lucide-react";
import { Card } from "./ui/card";

export function UseCases() {
  const useCases = [
    {
      title: "DAO Operators",
      points: [
        "Identify and reward top contributors",
        "Prevent member churn before it happens",
        "Optimize governance participation"
      ]
    },
    {
      title: "Community Managers",
      points: [
        "Segment members for targeted campaigns",
        "Track engagement metrics over time",
        "Discover influencers in your community"
      ]
    },
    {
      title: "Treasury Teams",
      points: [
        "Understand token holder behavior",
        "Analyze voting patterns and power",
        "Strategic allocation recommendations"
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
      <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl px-4">
          Built For Everyone In Your DAO
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
          Whether you're managing the community, operating the DAO, or handling the treasury, BlockSight provides the insights you need.
        </p>
      </div>
      
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {useCases.map((useCase, index) => (
          <Card key={index} className="p-5 sm:p-6 bg-card/50 backdrop-blur border-border/50 hover:border-accent/50 transition-all">
            <h3 className="mb-3 sm:mb-4 text-base sm:text-lg">{useCase.title}</h3>
            <ul className="space-y-2.5 sm:space-y-3">
              {useCase.points.map((point, pointIndex) => (
                <li key={pointIndex} className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}