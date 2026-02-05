import { WalletWithActivity } from "@/app/types/result";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, Crown } from "lucide-react";
import { useState } from "react";
import ActivityDistribution from "../components/wallets/ActivityDistribution";
import MostActiveWallets from "../components/wallets/MostActiveWallets";
import { TopWalletsGrid } from "../components/wallets/TopWalletsGrid";
import { mockWallets } from "../data/wallets-data";

interface WalletsViewProps {
    walletsWithActivity: WalletWithActivity[];
}

export function WalletsView({ walletsWithActivity }: WalletsViewProps) {
  const [filter, setFilter] = useState("rank");

  // We'll pass this down later to sort the grid
  const sortedWallets = [...mockWallets].sort((a, b) => {
    if (filter === 'rank') {
      return b.balanceUSD - a.balanceUSD; // Example sorting for rank
    }
    // Add other sorting logic later
    return 0;
  });

  return (
    <div className="space-y-8">

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Top wallets</h2>
          <Tabs value={filter} onValueChange={setFilter} className="w-auto">
            <TabsList>
              <TabsTrigger value="rank"><Crown className="mr-2 h-4 w-4" />Rank</TabsTrigger>
              <TabsTrigger value="transactions"><BarChart2 className="mr-2 h-4 w-4" />Transactions</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <TopWalletsGrid wallets={sortedWallets} />
      </section>

      <section>
        <ActivityDistribution wallets={walletsWithActivity} />
      </section>

      <section>
        <MostActiveWallets wallets={walletsWithActivity} />
      </section>
    </div>
  );
}