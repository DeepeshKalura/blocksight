import {
  fetchContractData,
  fetchWalletDetails,
  buildIndexingResult,
  IndexingConfig,
} from "./data-fetcher";
import { DashboardData } from "@/app/types/dapp";
import {
  aggregateOverview,
  getWalletsWithActivity,
} from "@/app/aux/dataAggregation";
import { getTransactionInsights } from "@/app/aux/transactionAnalysis";
import { getNFTAnalytics } from "@/app/aux/nftAnalysis";
import { Result } from "@/app/types/result";

export interface ProcessResult {
  contractAddress: string;
  tokenName: string | null;
  dashboardData: DashboardData;
}

export async function processContractIndexing(
  config: IndexingConfig,
): Promise<DashboardData> {
  const { contractAddress } = config;

  console.log(`Processing indexing for ${contractAddress}...`);

  // Step 1: Fetch contract data
  const { transfers, wallets } = await fetchContractData(config);

  // Step 2: Get wallet addresses
  const walletAddresses = Array.from(wallets).slice(0, 100); // Limit to 100 wallets initially

  // Step 3: Fetch wallet details (balances, NFTs)
  const { balances, nfts } = await fetchWalletDetails(walletAddresses);

  // Step 4: Build Results array
  const results = await buildIndexingResult(
    contractAddress,
    transfers,
    balances,
    nfts,
  );

  // Step 5: Calculate overview stats
  const overviewStats = aggregateOverview(results);

  // Step 6: Get wallets with activity
  const walletsWithActivity = getWalletsWithActivity(results).slice(0, 50);

  // Step 7: Get transaction insights
  const transactionInsights = getTransactionInsights(results);

  // Step 8: Build dashboard data
  const dashboardData: DashboardData = {
    overviewStats,
    aiSummary: generateAiSummary(null, overviewStats, walletsWithActivity),
    tokenAddress: contractAddress,
    socialLinks: {
      website: "https://example.com",
      twitter: "https://twitter.com/example",
    },
    walletsWithActivity,
    transactionInsights,
    tokenDistribution: generateTokenDistribution(
      results,
      walletAddresses.length,
    ),
    nftAnalytics: getNFTAnalytics(results as Result[]),
  };

  console.log(`Successfully processed ${contractAddress}`);
  return dashboardData;
}

function generateAiSummary(
  tokenName: string | null,
  stats: {
    totalWallets: number;
    totalTransactions: number;
    totalTransactionVolume: number;
  },
  wallets: Array<{ activityIndex: number }>,
): string {
  const avgActivity =
    wallets.length > 0
      ? wallets.reduce((sum, w) => sum + w.activityIndex, 0) / wallets.length
      : 0;

  const name = tokenName || "This contract";

  return `${name} shows ${stats.totalTransactions.toLocaleString()} transactions across ${stats.totalWallets.toLocaleString()} wallets. Average activity level is ${(avgActivity * 100).toFixed(1)}%. Total volume: ${stats.totalTransactionVolume.toLocaleString()}.`;
}

function generateTokenDistribution(
  results: Array<{
    data: {
      tokenBalances: { data: { tokens: Array<{ tokenBalance: string }> } };
    };
  }>,
  totalWallets: number,
): {
  distribution: Array<{
    range: string;
    minBalance: number;
    maxBalance: number;
    count: number;
    percentage: number;
    totalBalance: number;
  }>;
  whales: Array<{
    address: string;
    balance: number;
    percentageOfTotal: number;
    rank: number;
    activityIndex: number;
    transactionCount: number;
  }>;
  concentration: {
    giniCoefficient: number;
    top10Percentage: number;
    top20Percentage: number;
    herfindahlIndex: number;
    concentrationLevel: "Very High" | "High" | "Moderate" | "Low" | "Very Low";
  };
  balanceStats: {
    totalBalance: number;
    averageBalance: number;
    medianBalance: number;
    maxBalance: number;
    minBalance: number;
    standardDeviation: number;
  };
} {
  const ranges = [
    { range: "0 - 0.1", min: 0, max: 0.1 },
    { range: "0.1 - 1", min: 0.1, max: 1 },
    { range: "1 - 10", min: 1, max: 10 },
    { range: "10 - 100", min: 10, max: 100 },
    { range: "100+", min: 100, max: Number.MAX_VALUE },
  ];

  const distribution = ranges.map((r) => ({
    range: r.range,
    minBalance: r.min,
    maxBalance: r.max,
    count: Math.floor(Math.random() * 50) + 10,
    percentage: 0,
    totalBalance: Math.random() * 1000,
  }));

  const total = distribution.reduce((sum, d) => sum + d.count, 0);
  distribution.forEach((d) => {
    d.percentage =
      total > 0 ? Math.round((d.count / total) * 100 * 10) / 10 : 0;
  });

  return {
    distribution,
    whales: [],
    concentration: {
      giniCoefficient: 0.5,
      top10Percentage: 30,
      top20Percentage: 50,
      herfindahlIndex: 0.1,
      concentrationLevel: "Moderate",
    },
    balanceStats: {
      totalBalance: 10000,
      averageBalance: 10,
      medianBalance: 1,
      maxBalance: 1000,
      minBalance: 0,
      standardDeviation: 50,
    },
  };
}

