import { WhaleWallet } from "@/app/types/result";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TopHoldersTableProps {
  whales: WhaleWallet[];
}

export function TopHoldersTable({ whales }: TopHoldersTableProps) {
  return (
    <Card className="bg-card/50 border-border backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Top Holders (Whales)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="text-right">% of Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {whales.map((whale) => (
              <TableRow key={whale.rank}>
                <TableCell className="font-medium">#{whale.rank}</TableCell>
                <TableCell className="font-mono text-xs">{whale.address}</TableCell>
                <TableCell className="text-right font-medium">{whale.balance.toLocaleString()} ETH</TableCell>
                <TableCell className="text-right">
                    <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                        {whale.percentageOfTotal.toFixed(2)}%
                    </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}