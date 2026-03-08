"use client"
// components/SpamNFTAnalysis.tsx
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle } from "lucide-react"
  
  import { SpamAnalysis } from "@/app/types/nft"
  
  interface SpamNFTAnalysisProps {
    data: SpamAnalysis
  }
  
  export default function SpamNFTAnalysis({ data }: SpamNFTAnalysisProps) {
    return (
      <Card className="bg-card/50 border-border backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">Spam NFT Detection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-red-500/10 border-red-500/30">
              <CardHeader className="p-4">
                <CardDescription>Spam NFTs</CardDescription>
                <CardTitle className="text-3xl text-red-400">
                  {data.totalSpam}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-green-500/10 border-green-500/30">
              <CardHeader className="p-4">
                <CardDescription>Legitimate NFTs</CardDescription>
                <CardTitle className="text-3xl text-green-400">
                  {data.totalLegitimate}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-orange-500/10 border-orange-500/30">
              <CardHeader className="p-4">
                <CardDescription>Wallets Affected</CardDescription>
                <CardTitle className="text-3xl text-orange-400">
                  {data.walletsAffectedBySpam}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
  
          {/* Spam Percentage */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Spam Rate
              </h3>
              <span className="text-2xl font-bold text-red-400">
                {data.spamPercentage.toFixed(1)}%
              </span>
            </div>
            <Progress
              value={100 - data.spamPercentage}
              className="h-3 bg-red-500"
              indicatorClassName="bg-green-500"
            />
          </div>
  
          {/* Top Spam Collections */}
          {data.topSpamCollections.length > 0 && (
            <Card className="bg-card/50 p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Top Spam Collections
              </h3>
              <div className="space-y-2">
                {data.topSpamCollections.map((collection, index) => (
                  <div
                    key={index}
                    className="bg-muted/50 p-3 rounded-lg border border-destructive/20"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm truncate flex-1">
                        {collection.name}
                      </span>
                      <span className="text-red-400 font-bold ml-2">
                        {collection.count}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Affecting {collection.affectedWallets} wallet
                      {collection.affectedWallets !== 1 ? "s" : ""}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
  
          {/* Warning Message */}
          <Alert variant="destructive" className="bg-yellow-500/10 border-yellow-500/30 text-yellow-400">
            <AlertTriangle className="h-4 w-4 !text-yellow-400" />
            <AlertTitle>Spam Detection</AlertTitle>
            <AlertDescription className="text-yellow-400/80">
              These NFTs were automatically flagged as spam. They may be
              phishing attempts or unsolicited airdrops.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }
