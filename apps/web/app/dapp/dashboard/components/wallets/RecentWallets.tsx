import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Wallet } from "../../data/wallets-data";

export function RecentWallets({ wallets }: { wallets: Wallet[] }) {
  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-2 -mb-2">
      {wallets.map((wallet) => (
        <div key={wallet.id} className="flex items-center gap-2 p-2 rounded-lg bg-card hover:bg-muted cursor-pointer transition-colors shrink-0">
          <Avatar className="h-6 w-6">
            <AvatarImage src={wallet.avatarUrl} alt={wallet.ensName || wallet.id} />
            <AvatarFallback>{(wallet.ensName || wallet.id).substring(0, 2)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium whitespace-nowrap">{wallet.ensName || `${wallet.id.slice(0,6)}...${wallet.id.slice(-4)}`}</span>
        </div>
      ))}
    </div>
  );
}