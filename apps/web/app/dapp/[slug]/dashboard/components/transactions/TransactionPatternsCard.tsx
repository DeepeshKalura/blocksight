// components/TransactionPatterns.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
  
  import { TransactionPatterns } from "@/app/types/result"
  
  interface TransactionPatternsProps {
    data: TransactionPatterns
  }
  
  export default function TransactionPatternsCard({
    data,
  }: TransactionPatternsProps) {
    // Percentages should be based on VOLUME, not counts
    const totalIOVolume = data.incomingVolume + data.outgoingVolume
    const incomingPercentage =
      totalIOVolume > 0 ? (data.incomingVolume / totalIOVolume) * 100 : 50
  
    const totalInternalExternalVolume = data.internalVolume + data.externalVolume
    const internalPercentage =
      totalInternalExternalVolume > 0
        ? (data.internalVolume / totalInternalExternalVolume) * 100
        : 50
  
    return (
      <Card className="bg-card/50 border-border backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">Transaction Patterns</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Incoming vs Outgoing */}
          <Card className="bg-card/50 p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Incoming vs Outgoing
              </h3>
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-muted-foreground">Incoming</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-muted-foreground">Outgoing</span>
                </div>
              </div>
            </div>
  
            <div className="grid grid-cols-2 gap-4 mb-3">
              <Card className="bg-muted/50 p-3">
                <CardDescription>Incoming</CardDescription>
                <CardTitle className="text-2xl text-green-400">
                  {data.totalIncoming}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {data.incomingVolume.toFixed(2)} ETH
                </p>
              </Card>
              <Card className="bg-muted/50 p-3">
                <CardDescription>Outgoing</CardDescription>
                <CardTitle className="text-2xl text-red-400">
                  {data.totalOutgoing}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {data.outgoingVolume.toFixed(2)} ETH
                </p>
              </Card>
            </div>
  
            <Progress
              value={incomingPercentage}
              className="h-3 bg-red-500"
            />
          </Card>
  
          {/* Internal vs External */}
          <Card className="bg-card/50 p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Internal vs External
              </h3>
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-muted-foreground">Internal</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-muted-foreground">External</span>
                </div>
              </div>
            </div>
  
            <div className="grid grid-cols-2 gap-4 mb-3">
              <Card className="bg-muted/50 p-3">
                <CardDescription>Internal</CardDescription>
                <CardTitle className="text-2xl text-blue-400">
                  {data.internalTransactions}
                </CardTitle>
              </Card>
              <Card className="bg-muted/50 p-3">
                <CardDescription>External</CardDescription>
                <CardTitle className="text-2xl text-purple-400">
                  {data.externalTransactions}
                </CardTitle>
              </Card>
            </div>
  
            <Progress
              value={internalPercentage}
              className="h-3 bg-purple-500"
              indicatorClassName="bg-blue-500"
            />
          </Card>
        </CardContent>
      </Card>
    )
  }
