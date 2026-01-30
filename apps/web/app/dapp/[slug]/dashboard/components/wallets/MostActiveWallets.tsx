import type { WalletWithActivity } from "@/app/types/result";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface MostActiveWalletsProps {
  wallets: WalletWithActivity[]; // Corrected type from ActiveWallet to WalletWithActivity
}

function ActivityIndicator({ value }: { value: number }) {
  return (
    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
      <div
        className="h-full bg-accent transition-all"
        style={{ width: `${value * 100}%` }}
      ></div>
    </div>
  );
}

export default function MostActiveWallets({ wallets }: MostActiveWalletsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Active Wallets</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Wallet</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>Transactions</TableHead>
              <TableHead>Volume</TableHead>
              {/* <TableHead>Avg Size</TableHead> */}
              {/* <TableHead>In/Out</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {wallets.map((wallet, index) => (
              <TableRow key={wallet.address}>
                <TableCell>
                  <span className="text-muted-foreground">#{index + 1}</span>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm text-accent">
                    {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground">{wallet.activityIndex.toFixed(3)}</span>
                    <ActivityIndicator value={wallet.activityIndex} />
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-foreground">{wallet.transactionCount}</span>
                </TableCell>
                <TableCell>
                  <span className="text-accent">{wallet.totalVolume} ETH</span>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}