import { BalanceStatistics, ConcentrationMetrics } from "@/app/types/result";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TokenConcentrationCardProps {
  concentration: ConcentrationMetrics;
  stats: BalanceStatistics;
}

const getConcentrationColor = (level: string) => {
    switch (level) {
      case "Very High": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "High": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "Moderate": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Low": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "bg-green-500/20 text-green-400 border-green-500/30";
    }
};

export function TokenConcentrationCard({ concentration, stats }: TokenConcentrationCardProps) {
  const concentrationStyle = getConcentrationColor(concentration.concentrationLevel);

  return (
    <Card className="bg-card/50 border-border backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Token Concentration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
            <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-muted-foreground">Gini Coefficient</p>
                <Badge variant="outline" className={concentrationStyle}>{concentration.concentrationLevel}</Badge>
            </div>
            <p className="text-4xl font-bold text-accent">{concentration.giniCoefficient.toFixed(3)}</p>
            <p className="text-xs text-muted-foreground">Measures wealth distribution (0 = equal, 1 = concentrated)</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Top 10% Hold</p>
                <p className="text-2xl font-semibold">{concentration.top10Percentage.toFixed(1)}%</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Top 20% Hold</p>
                <p className="text-2xl font-semibold">{concentration.top20Percentage.toFixed(1)}%</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}