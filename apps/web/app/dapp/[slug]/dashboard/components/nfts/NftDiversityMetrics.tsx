import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

import { NFTDiversityMetrics } from "@/app/types/nft"

interface NFTDiversityMetricsProps {
  data: NFTDiversityMetrics
}

export default function NFTDiversityMetricsCard({
  data,
}: NFTDiversityMetricsProps) {
  const getDiversityLevel = (
    concentration: number
  ): {
    level: string
    variant: "default" | "secondary" | "destructive"
    color: string
  } => {
    if (concentration <= 0.3)
      return {
        level: "Very Diverse",
        variant: "default",
        color: "text-green-400",
      }
    if (concentration <= 0.5)
      return { level: "Diverse", variant: "secondary", color: "text-blue-400" }
    if (concentration <= 0.7)
      return {
        level: "Moderate",
        variant: "secondary",
        color: "text-yellow-400",
      }
    return {
      level: "Concentrated",
      variant: "destructive",
      color: "text-orange-400",
    }
  }

  const diversity = getDiversityLevel(data.collectionConcentration)

  return (
    <Card className="bg-card/50 border-border backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl">NFT Diversity Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-card/50">
            <CardHeader className="p-4">
              <CardDescription>Unique Collections</CardDescription>
              <CardTitle className="text-3xl text-purple-400">
                {data.uniqueCollections}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-card/50">
            <CardHeader className="p-4">
              <CardDescription>Avg Collections/Wallet</CardDescription>
              <CardTitle className="text-3xl text-blue-400">
                {data.averageCollectionsPerWallet.toFixed(1)}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Diversity Score */}
        <Card className="bg-card/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Collection Diversity
            </h3>
            <Badge variant={diversity.variant}>{diversity.level}</Badge>
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Concentration Index
            </span>
            <span className={`text-2xl font-bold ${diversity.color}`}>
              {data.collectionConcentration.toFixed(3)}
            </span>
          </div>
          <Progress
            value={data.collectionConcentration * 100}
            className="h-2"
            indicatorClassName={
              data.collectionConcentration <= 0.3
                ? "bg-green-500"
                : data.collectionConcentration <= 0.5
                  ? "bg-blue-500"
                  : data.collectionConcentration <= 0.7
                    ? "bg-yellow-500"
                    : "bg-orange-500"
            }
          />
          <p className="text-xs text-muted-foreground mt-2">
            Lower values indicate more diverse portfolios
          </p>
        </Card>

        {/* Most Diverse Wallet */}
        {data.mostDiverseWallet && (
          <Card className="bg-linear-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 p-4">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-purple-400 mb-2">
                  Most Diverse Wallet
                </h4>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-blue-400">
                    {data.mostDiverseWallet.address.slice(0, 10)}...
                    {data.mostDiverseWallet.address.slice(-8)}
                  </span>
                  <span className="font-bold">
                    {data.mostDiverseWallet.collectionCount} collections
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}
