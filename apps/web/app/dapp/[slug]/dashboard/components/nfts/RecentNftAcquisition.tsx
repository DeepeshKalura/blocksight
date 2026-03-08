import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { RecentNFTAcquisition } from "@/app/types/nft"

interface RecentNFTAcquisitionsProps {
  acquisitions: RecentNFTAcquisition[]
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return date.toLocaleDateString()
}

export default function RecentNFTAcquisitions({
  acquisitions,
}: RecentNFTAcquisitionsProps) {
  if (acquisitions.length === 0) {
    return (
      <Card className="bg-card/50 border-border backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Recent NFT Acquisitions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No recent acquisition data available
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card/50 border-border backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl">Recent NFT Acquisitions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {acquisitions.slice(0, 12).map((acquisition, index) => (
          <Card
            key={`${acquisition.walletAddress}-${acquisition.tokenId}-${index}`}
            className="bg-card/50 hover:border-primary/50 transition-all"
          >
            <div className="flex items-start gap-3 p-3">
              <Avatar className="w-16 h-16 rounded-lg border">
                <AvatarImage
                  src={acquisition.imageUrl ?? undefined}
                  alt={acquisition.nftName}
                />
                <AvatarFallback className="text-xl bg-muted">
                  🎨
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate mb-1">
                  {acquisition.nftName}
                </p>
                <p className="text-muted-foreground text-xs truncate mb-1">
                  {acquisition.collectionName}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatDate(acquisition.acquiredAt)}</span>
                  <span>•</span>
                  <span className="font-mono text-blue-400">
                    {acquisition.walletAddress.slice(0, 6)}...
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </CardContent>
      {acquisitions.length > 12 && (
        <CardFooter>
          <p className="text-sm text-muted-foreground text-center w-full">
            Showing 12 of {acquisitions.length} recent acquisitions
          </p>
        </CardFooter>
      )}
    </Card>
  )
}
