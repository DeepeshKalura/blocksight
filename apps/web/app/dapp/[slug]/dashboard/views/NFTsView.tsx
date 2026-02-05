"use client";

import { NFTAnalytics } from "@/app/types/nft";
import NFTAdoptionCard from "../components/nfts/NftAdoption";
import TopNFTCollections from "../components/nfts/NftCollections";
import NFTDiversityMetricsCard from "../components/nfts/NftDiversityMetrics";
import SpamNFTAnalysis from "../components/nfts/NftSpamAnalysis";
import RecentNFTAcquisitions from "../components/nfts/RecentNftAcquisition";

interface NFTsViewProps {
    nftAnalytics: NFTAnalytics | null;
}

export function NFTsView({ nftAnalytics }: NFTsViewProps) {
    if (!nftAnalytics) {
        return <div className="text-muted-foreground">No NFT data available for this DAO.</div>;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">NFT Analytics</h1>

            <section>
                <NFTAdoptionCard data={nftAnalytics.adoption} />
            </section>
            
            <section>
                <TopNFTCollections collections={nftAnalytics.topCollections} />
            </section>
            
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <NFTDiversityMetricsCard data={nftAnalytics.diversityMetrics} />
                <SpamNFTAnalysis data={nftAnalytics.spamAnalysis} />
            </section>
            
            <section>
                <RecentNFTAcquisitions acquisitions={nftAnalytics.recentAcquisitions} />
            </section>
        </div>
    );
}