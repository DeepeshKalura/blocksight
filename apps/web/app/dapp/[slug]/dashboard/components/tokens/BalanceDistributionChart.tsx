// components/BalanceDistributionChart.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
  
  import { BalanceDistribution } from "@/app/types/result";
  
  interface BalanceDistributionChartProps {
    data: BalanceDistribution[]
  }
  export default function BalanceDistributionChart({
  data,
}: BalanceDistributionChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Balance Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No balance data available</p>
        </CardContent>
      </Card>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance Distribution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {data.map((bucket, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground">
                  {bucket.range}
                </span>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    {bucket.count} wallet{bucket.count !== 1 ? "s" : ""} (
                    {bucket.percentage.toFixed(1)}%)
                  </span>
                  <span className="text-accent">
                    {bucket.totalBalance.toFixed(4)} ETH
                  </span>
                </div>
              </div>

              <div className="relative h-10 bg-muted rounded-lg overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-500 flex items-center px-3"
                  style={{
                    width: `${maxCount > 0 ? (bucket.count / maxCount) * 100 : 0}%`,
                  }}
                >
                  {bucket.count > 0 && (
                    <span className="text-xs text-accent-foreground">
                      {bucket.count}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-muted/50 rounded-lg border border-border">
          <h3 className="text-sm text-muted-foreground mb-3">
            Distribution Insights
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Most Common Range:</span>
              <p className="text-foreground">
                {data.reduce((max, d) => (d.count > max.count ? d : max)).range}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Highest Balance Range:</span>
              <p className="text-foreground">
                {
                  data.reduce((max, d) =>
                    d.totalBalance > max.totalBalance ? d : max
                  ).range
                }
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
