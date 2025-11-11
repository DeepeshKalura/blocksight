'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { mockDapps, type DemoDapp } from '../mock-dapp-data';

import ActivityDistribution from '@/app/dashboard/_components/ActivityDistribution';
import BalanceDistributionChart from '@/app/dashboard/_components/BalanceDistributionChart';
import ConcentrationMetricsCard from '@/app/dashboard/_components/ConcentrationMetrics';
import GasAnalysisCard from '@/app/dashboard/_components/GasAnalysis';
import MostActiveWallets from '@/app/dashboard/_components/MostActiveWallet';
import NFTAdoption from '@/app/dashboard/_components/NftAdoption';
import TopNFTCollections from '@/app/dashboard/_components/NftCollections';
import NFTDiversityMetricsCard from '@/app/dashboard/_components/NftDiversityMetrics';
import SpamNFTAnalysis from '@/app/dashboard/_components/NftSpamAnalysis';
import OverviewCards from '@/app/dashboard/_components/OverviewCard';
import RecentNFTAcquisitions from '@/app/dashboard/_components/RecentNftAcquisition';
import TransactionPatternsCard from '@/app/dashboard/_components/TransactionPattern';
import TransactionTimeline from '@/app/dashboard/_components/TransactionTimeline';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QueryInterface } from './_components/QueryInterface';

function DashboardComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dapp, setDapp] = useState<DemoDapp | null>(null);
  const [timelineGroupBy, setTimelineGroupBy] = useState<'day' | 'week' | 'month'>('day');

  useEffect(() => {
    const address = searchParams.get('address');
    if (!address) {
      router.push('/dao');
      return;
    }
    const foundDapp = mockDapps.find(d => d.contract_address.toLowerCase() === address.toLowerCase());
    if (foundDapp) {
      setDapp(foundDapp);
    } else {
      // Handle case where dapp is not found, maybe redirect or show an error
      router.push('/dao');
    }
  }, [searchParams, router]);

  if (!dapp) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dApp Data...</p>
        </div>
      </div>
    );
  }

  const { overviewStats, walletsWithActivity, transactionInsights, tokenDistribution, nftAnalytics } = dapp.dashboardData;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
            {dapp.name} - dApp Intelligence
          </h1>
          <p className="text-gray-400">
            Analysis results for {dapp.name} community
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto bg-gray-800">
            <TabsTrigger value="dashboard">📊 Dashboard</TabsTrigger>
            <TabsTrigger value="ai">🤖 AI Query</TabsTrigger>
            <TabsTrigger value="nft">🖼️ NFT</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6 space-y-8">
            <OverviewCards data={overviewStats} />
            <ActivityDistribution wallets={walletsWithActivity} />
            <TransactionTimeline data={transactionInsights.timeline} groupBy={timelineGroupBy} onGroupByChange={setTimelineGroupBy} />
            <MostActiveWallets wallets={transactionInsights.mostActiveWallets} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TransactionPatternsCard data={transactionInsights.patterns} />
              <GasAnalysisCard data={transactionInsights.gasAnalysis} />
            </div>
            <BalanceDistributionChart data={tokenDistribution.distribution} />
            <ConcentrationMetricsCard concentration={tokenDistribution.concentration} stats={tokenDistribution.balanceStats} />
          </TabsContent>

          <TabsContent value="ai" className="mt-6">
            <QueryInterface />
          </TabsContent>

          <TabsContent value="nft" className="mt-6 space-y-8">
            <NFTAdoption data={nftAnalytics.adoption} />
            <TopNFTCollections collections={nftAnalytics.topCollections} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <NFTDiversityMetricsCard data={nftAnalytics.diversityMetrics} />
              <SpamNFTAnalysis data={nftAnalytics.spamAnalysis} />
            </div>
            <RecentNFTAcquisitions acquisitions={nftAnalytics.recentAcquisitions} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function DaoDashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardComponent />
    </Suspense>
  )
}