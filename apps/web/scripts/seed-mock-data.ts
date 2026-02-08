// Script to seed mock/demo dApps into the database
// Run with: pnpm tsx scripts/seed-mock-data.ts

import { db } from "@/lib/db";
import { mockDapps } from "@/lib/db/schema";

// Sample mock data (simplified version - you'll use your actual mockDapps data)
const sampleMockData = [
  {
    id: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    name: "Tether (USDT)",
    logoUrl: "/logos/tetherusdt.png",
    chain: "Ethereum",
    contractAddress: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    description: "A core token for the Ethereum ecosystem.",
    slug: "usdt",
    dashboardData: {
      overviewStats: {
        totalWallets: 197123,
        totalTransactionVolume: 22308268112.37,
        totalTransactions: 335026,
        averageWalletBalance: 109.28,
        activeWallets: 95266,
        inactiveWallets: 101857,
        averageActivityIndex: 0.1,
      },
      aiSummary:
        "Tether (USDT) demonstrates massive network dominance with over 95,000 active wallets driving significant transaction volume.",
      tokenAddress: "0xdac17f958d2ee523a2206206994597c13d831ec7",
      socialLinks: {
        website: "https://tether.to/",
        twitter: "https://x.com/tether",
      },
      walletsWithActivity: [],
      transactionInsights: {
        timeline: [],
        mostActiveWallets: [],
        patterns: {
          totalIncoming: 299487,
          totalOutgoing: 335026,
          incomingVolume: 22308241574.31,
          outgoingVolume: 22308268112.37,
          averageIncomingSize: 74488.18,
          averageOutgoingSize: 66586.6772,
          internalTransactions: 0,
          externalTransactions: 335026,
          internalVolume: 0,
          externalVolume: 22308268112.37,
        },
        gasAnalysis: {
          totalGasSpent: 49111.6564,
          averageGasPerTransaction: 0.146591,
          estimatedCostUSD: 137512637.86,
          highestGasTransaction: null,
        },
      },
      tokenDistribution: {
        distribution: [],
        whales: [],
        concentration: {
          giniCoefficient: 0.9992,
          top10Percentage: 0,
          top20Percentage: 0,
          herfindahlIndex: 0,
          concentrationLevel: "High",
        },
        balanceStats: {
          totalBalance: 15559713499.53,
          averageBalance: 109.28,
          medianBalance: 10.0,
          maxBalance: 5000001410.0,
          minBalance: 0.1,
          standardDeviation: 14817093.9,
        },
      },
      nftAnalytics: {
        totalNFTs: 0,
        collections: [],
        topCollections: [],
        adoption: {
          walletsWithNFTs: 0,
          walletsWithoutNFTs: 55,
          adoptionRate: 0.0,
          totalNFTs: 0,
          totalLegitimateNFTs: 0,
          averageNFTsPerWallet: 0.0,
          averageLegitimateNFTsPerWallet: 0.0,
        },
        spamAnalysis: {
          totalSpam: 0,
          totalLegitimate: 0,
          spamPercentage: 0,
          walletsAffectedBySpam: 0,
          topSpamCollections: [],
        },
        recentAcquisitions: [],
        diversityMetrics: {
          uniqueCollections: 0,
          averageCollectionsPerWallet: 2.5,
          mostDiverseWallet: null,
          collectionConcentration: 0.1,
        },
      },
    },
  },
];

async function seedMockData() {
  console.log("Seeding mock dApps into database...\n");

  for (const dapp of sampleMockData) {
    try {
      await db
        .insert(mockDapps)
        .values(dapp)
        .onConflictDoUpdate({
          target: [mockDapps.id],
          set: {
            name: dapp.name,
            logoUrl: dapp.logoUrl,
            dashboardData: dapp.dashboardData,
            updatedAt: new Date(),
          },
        });

      console.log(`✅ Seeded: ${dapp.name} (${dapp.slug})`);
    } catch (error) {
      console.error(`❌ Failed to seed ${dapp.name}:`, error);
    }
  }

  console.log("\n✨ Mock data seeding complete!");
  process.exit(0);
}

seedMockData().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
