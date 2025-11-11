"use client";

import type { WalletWithActivity } from "@/app/types/result";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

interface ActivityDistributionProps {
  wallets: WalletWithActivity[];
}

interface Bucket {
  label: string;
  min: number;
  max: number;
  count: number;
  walletAddresses: string[];
}

function createQuantileBins(wallets: WalletWithActivity[], numBins: number = 5): Bucket[] {
  if (wallets.length === 0) return [];

  const sortedWallets = [...wallets].sort((a, b) => a.activityIndex - b.activityIndex);
  const buckets: Bucket[] = [];
  const walletsPerBin = Math.ceil(wallets.length / numBins);
  
  for (let i = 0; i < numBins; i++) {
    const startIdx = i * walletsPerBin;
    const endIdx = Math.min(startIdx + walletsPerBin, sortedWallets.length);
    const binWallets = sortedWallets.slice(startIdx, endIdx);
    
    if (binWallets.length === 0) continue;
    
    const min = binWallets[0]!.activityIndex;
    const max = binWallets[binWallets.length - 1]!.activityIndex;
    
    buckets.push({
      label: `${min.toFixed(2)}-${max.toFixed(2)}`,
      min,
      max,
      count: binWallets.length,
      walletAddresses: binWallets.map(w => w.address),
    });
  }
  
  return buckets;
}

export default function ActivityDistribution({ wallets }: ActivityDistributionProps) {
  const [selectedBucket, setSelectedBucket] = useState<Bucket | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  if (wallets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Index</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No wallet data available</p>
        </CardContent>
      </Card>
    );
  }

  if (wallets.length === 1) {
    const wallet = wallets[0]!;
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Index</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-5xl text-accent">
              {wallet.activityIndex.toFixed(3)}
            </div>
            <div className="text-sm text-muted-foreground">
              <div>Single wallet analysis</div>
              <div className="mt-1 font-mono text-xs">{wallet.address}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const buckets = createQuantileBins(wallets, 5);
  const maxCount = Math.max(...buckets.map((b) => b.count));

  const handleCopyAddresses = () => {
    if (!selectedBucket) return;
    const addressList = selectedBucket.walletAddresses.join("\n");
    navigator.clipboard.writeText(addressList);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Activity Index Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {buckets.map((bucket, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{bucket.label}</span>
                  <span className="text-sm text-muted-foreground">
                    {bucket.count} wallet{bucket.count !== 1 ? "s" : ""} (
                    {((bucket.count / wallets.length) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div 
                  className="relative h-8 bg-muted rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-accent transition-all"
                  onClick={() => setSelectedBucket(bucket)}
                  title="Click to view wallet addresses"
                >
                  <div
                    className="h-full bg-accent transition-all duration-500 flex items-center justify-end px-3"
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
        </CardContent>
      </Card>

      <Dialog open={!!selectedBucket} onOpenChange={() => setSelectedBucket(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              Wallets in range {selectedBucket?.label}
            </DialogTitle>
          </DialogHeader>
          
          {selectedBucket && (
            <div className="space-y-4">
              <Button onClick={handleCopyAddresses} variant="outline">
                {copySuccess ? "✓ Copied!" : "📋 Copy All Addresses"}
              </Button>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {selectedBucket.walletAddresses.map((address, idx) => (
                  <div 
                    key={idx}
                    className="bg-muted p-3 rounded font-mono text-sm hover:bg-muted/80 transition-colors"
                  >
                    {address}
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
