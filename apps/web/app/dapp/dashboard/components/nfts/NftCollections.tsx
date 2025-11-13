// components/TopNFTCollections.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

import { TopNFTCollection } from "@/app/types/nft"

interface TopNFTCollectionsProps {
  collections: TopNFTCollection[]
}

export default function TopNFTCollections({
  collections,
}: TopNFTCollectionsProps) {
  if (collections.length === 0) {
    return (
      <Card className="bg-card/50 border-border backdrop-blur-sm">
        <CardHeader>
          <CardTitle>🎨 Top NFT Collections</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No legitimate NFT collections found
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card/50 border-border backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl">🎨 Top NFT Collections</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {collections.map((collection, index) => (
          <Card
            key={collection.contractAddress}
            className="bg-card/50 hover:border-primary/50 transition-all"
          >
            <CardHeader className="flex flex-row items-start gap-4 p-4">
              <Badge
                variant="secondary"
                className="w-10 h-10 text-lg font-bold flex-shrink-0 items-center justify-center"
              >
                #{index + 1}
              </Badge>

              <Avatar className="w-16 h-16 rounded-lg border">
                <AvatarImage
                  src={collection.imageUrl ?? undefined}
                  alt={collection.name}
                />
                <AvatarFallback className="text-2xl bg-muted">
                  🖼️
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="truncate">{collection.name}</CardTitle>
                    <CardDescription>
                      {collection.symbol} • {collection.tokenType}
                    </CardDescription>
                  </div>
                  {collection.floorPrice > 0 && (
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-green-400">
                        {collection.floorPrice} ETH
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Floor Price
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-purple-400">
                    {collection.totalOwned}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Owned</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-400">
                    {collection.uniqueHolders}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Unique Holders
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-pink-400">
                    {collection.holderPercentage.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">Adoption</p>
                </div>
              </div>

              <Progress
                value={collection.holderPercentage}
                className="h-2 [&>*]:bg-gradient-to-r [&>*]:from-purple-500 [&>*]:to-pink-500"
              />

              {collection.collectionSlug && (
                <div className="pt-2">
                  <a
                    href={`https://opensea.io/collection/${collection.collectionSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      View on OpenSea →
                    </Button>
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}
