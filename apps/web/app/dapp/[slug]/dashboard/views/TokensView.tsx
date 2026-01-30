import { TokenDistributionAnalysis } from "@/app/types/result";
import BalanceDistributionChart from "../components/tokens/BalanceDistributionChart";
import { TokenConcentrationCard } from "../components/tokens/TokenConcentrationCard";
import { TopHoldersTable } from "../components/tokens/TopHoldersTable";

interface TokensViewProps {
    tokenDistribution: TokenDistributionAnalysis | null;
}

export function TokensView({ tokenDistribution }: TokensViewProps) {
    if (!tokenDistribution) {
        return <div className="text-muted-foreground">No token data available.</div>;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Token Analytics</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <TokenConcentrationCard 
                        concentration={tokenDistribution.concentration} 
                        stats={tokenDistribution.balanceStats} 
                    />
                </div>
                <div className="lg:col-span-2">
                    <TopHoldersTable whales={tokenDistribution.whales} />
                </div>
            </div>
            <section>
                <BalanceDistributionChart data={tokenDistribution.distribution} />
            </section>
        </div>
    );
}