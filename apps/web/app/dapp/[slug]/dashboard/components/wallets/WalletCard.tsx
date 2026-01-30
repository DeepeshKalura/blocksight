import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet } from "../../data/wallets-data";

const formatUsd = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`;
  }
  return `$${value.toFixed(2)}`;
};

export function WalletCard({ wallet }: { wallet: Wallet }) {
  return (
    <Card className="bg-card hover:bg-muted transition-colors cursor-pointer">
      <CardContent className="p-4 flex items-center gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={wallet.avatarUrl} alt={wallet.ensName || wallet.id} />
          <AvatarFallback>{(wallet.ensName || "N/A").substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm truncate">{wallet.ensName || `${wallet.id.slice(0, 6)}...${wallet.id.slice(-4)}`}</p>
            <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">{wallet.rank}</Badge>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{formatUsd(wallet.balanceUSD)}</span>
            <span>•</span>
            <span>{wallet.nftCount} NFTs</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
