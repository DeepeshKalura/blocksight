import { Wallet } from "../../data/wallets-data";
import { WalletCard } from "./WalletCard";

export function TopWalletsGrid({ wallets }: { wallets: Wallet[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {wallets.map((wallet) => (
        <WalletCard key={wallet.id} wallet={wallet} />
      ))}
    </div>
  );
}