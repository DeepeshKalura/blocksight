// components/GasAnalysis.tsx
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
  import { Separator } from "@/components/ui/separator"
  import { Info } from "lucide-react"
  
  import { GasAnalysis } from "@/app/types/result"
  
  interface GasAnalysisProps {
    data: GasAnalysis
  }
  
  export default function GasAnalysisCard({ data }: GasAnalysisProps) {
    return (
      <Card className="bg-card/50 border-border backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">Gas Spending Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card/50">
              <CardHeader className="p-4">
                <CardDescription>Total Gas Spent</CardDescription>
                <CardTitle className="text-3xl text-orange-400">
                  {data.totalGasSpent.toFixed(4)}
                  <span className="text-lg ml-1">ETH</span>
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-card/50">
              <CardHeader className="p-4">
                <CardDescription>Avg Gas per TX</CardDescription>
                <CardTitle className="text-3xl text-yellow-400">
                  {data.averageGasPerTransaction.toFixed(6)}
                  <span className="text-lg ml-1">ETH</span>
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-card/50">
              <CardHeader className="p-4">
                <CardDescription>Estimated Cost</CardDescription>
                <CardTitle className="text-3xl text-green-400">
                  ${data.estimatedCostUSD.toLocaleString()}
                  <span className="text-lg ml-1">USD</span>
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
  
          {data.highestGasTransaction && (
            <Card className="bg-card/50 p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Highest Gas Transaction
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Gas Spent:</span>
                  <span className="font-bold text-orange-400">
                    {data.highestGasTransaction.gasSpent} ETH
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">From:</span>
                  <span className="font-mono">
                    {data.highestGasTransaction.from.slice(0, 6)}...
                    {data.highestGasTransaction.from.slice(-4)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">To:</span>
                  <span className="font-mono">
                    {data.highestGasTransaction.to.slice(0, 6)}...
                    {data.highestGasTransaction.to.slice(-4)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center pt-1">
                  <span className="text-muted-foreground">Transaction:</span>
                  <a
                    href={`https://etherscan.io/tx/${data.highestGasTransaction.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    {data.highestGasTransaction.hash.slice(0, 10)}...
                  </a>
                </div>
              </div>
            </Card>
          )}
  
          <Alert className="bg-blue-500/10 border-blue-500/30 text-blue-300">
            <Info className="h-4 w-4 !text-blue-300" />
            <AlertTitle>Note</AlertTitle>
            <AlertDescription className="text-blue-300/80">
              Gas estimates are approximations. USD values use an estimated ETH
              price of $2,500.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }
