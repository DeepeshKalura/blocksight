import type { OverviewStats } from "@/app/types/result";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OverviewCardsProps {
  data: OverviewStats | null;
}

function getActivityLabel(index: number): string {
  if (index >= 0.7) return "Very Active Community";
  if (index >= 0.5) return "Active Community";
  if (index >= 0.3) return "Moderately Active";
  if (index >= 0.15) return "Low Activity";
  return "Mostly Inactive";
}

function getActivityBadge(index: number): { text: string; variant: "default" | "secondary" | "destructive" } {
  if (index >= 0.7) return { text: "Excellent", variant: "default" };
  if (index >= 0.5) return { text: "Good", variant: "secondary" };
  if (index >= 0.3) return { text: "Moderate", variant: "secondary" };
  return { text: "Low", variant: "destructive" };
}

export function OverviewCards({ data }: OverviewCardsProps) {
  if (!data) {
    // Skeleton loader for when data is not yet available
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse bg-card/50 h-36"></Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Wallets Analyzed",
      value: data.totalWallets.toLocaleString(),
      subtitle: `${data.activeWallets} active, ${data.inactiveWallets} inactive`,
      icon: "👛",
    },
    {
      title: "Total Transaction Volume",
      value: `${data.totalTransactionVolume.toFixed(3)} ETH`,
      subtitle: `Across all wallets`,
      icon: "💰",
    },
    {
      title: "Total Transactions",
      value: data.totalTransactions.toLocaleString(),
      subtitle: `${(data.totalTransactions / data.totalWallets).toFixed(1)} avg per wallet`,
      icon: "📊",
    },
    {
      title: "Average Wallet Balance",
      value: `${data.averageWalletBalance.toFixed(4)} ETH`,
      subtitle: "Per wallet",
      icon: "⚖️",
    },
    {
      title: "Active vs Inactive",
      value: `${((data.activeWallets / data.totalWallets) * 100).toFixed(1)}%`,
      subtitle: `${data.activeWallets} wallets with index ≥ 0.3`,
      icon: "🔥",
    },
    {
      title: "Average Activity Index",
      value: data.averageActivityIndex.toFixed(3),
      subtitle: getActivityLabel(data.averageActivityIndex),
      icon: "📈",
      badge: getActivityBadge(data.averageActivityIndex),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="bg-card/50 border-border backdrop-blur-sm hover:border-accent/50 transition-all">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{card.icon}</span>
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              </div>
              {card.badge && (
                <Badge variant={card.badge.variant} className="bg-muted text-muted-foreground">{card.badge.text}</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent mb-1">{card.value}</p>
            <p className="text-sm text-muted-foreground">{card.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
