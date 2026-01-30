// components/NFTAdoptionCard.tsx
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Progress } from "@/components/ui/progress"
  
  import { NFTAdoption } from "@/app/types/nft"
  
  interface NFTAdoptionCardProps {
    data: NFTAdoption
  }
  
  export default function NFTAdoptionCard({ data }: NFTAdoptionCardProps) {
    const adoptionPercentage = data.adoptionRate
    const spamPercentage =
      data.totalNFTs > 0
        ? ((data.totalNFTs - data.totalLegitimateNFTs) / data.totalNFTs) * 100
        : 0
  
    return (
      <Card className="bg-card/50 border-border backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">📊 NFT Adoption Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-card/50">
              <CardHeader className="p-4">
                <CardDescription>Wallets with NFTs</CardDescription>
                <CardTitle className="text-3xl text-purple-400">
                  {data.walletsWithNFTs}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-card/50">
              <CardHeader className="p-4">
                <CardDescription>Without NFTs</CardDescription>
                <CardTitle className="text-3xl text-muted-foreground">
                  {data.walletsWithoutNFTs}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-card/50">
              <CardHeader className="p-4">
                <CardDescription>Adoption Rate</CardDescription>
                <CardTitle className="text-3xl text-blue-400">
                  {data.adoptionRate.toFixed(1)}%
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-card/50">
              <CardHeader className="p-4">
                <CardDescription>Avg NFTs/Wallet</CardDescription>
                <CardTitle className="text-3xl text-green-400">
                  {data.averageLegitimateNFTsPerWallet.toFixed(1)}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
  
          {/* Adoption Visualization */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              NFT Ownership Distribution
            </h3>
            <Progress value={adoptionPercentage} className="h-3 bg-muted" />
            <div className="flex justify-between mt-2 text-xs">
              <span className="text-purple-400">With NFTs</span>
              <span className="text-muted-foreground">Without NFTs</span>
            </div>
          </div>
  
          {/* Total NFTs Breakdown */}
          <Card className="bg-card/50 p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Total NFT Collection
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {data.totalLegitimateNFTs}
                </div>
                <div className="text-xs text-muted-foreground">
                  Legitimate NFTs
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">
                  {data.totalNFTs - data.totalLegitimateNFTs}
                </div>
                <div className="text-xs text-muted-foreground">Spam NFTs</div>
              </div>
            </div>
            <Progress value={100 - spamPercentage} className="h-2 bg-red-500" />
          </Card>
        </CardContent>
      </Card>
    )
  }
