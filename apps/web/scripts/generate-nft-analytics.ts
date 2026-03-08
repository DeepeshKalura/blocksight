#!/usr/bin/env npx tsx
/**
 * NFT Analytics Generator
 * 
 * This script:
 * 1. Reads wallet addresses from walletsWithActivity in mock-dapp-data.ts
 * 2. Fetches NFT data for those wallets from Alchemy
 * 3. Computes analytics using getNFTAnalytics()
 * 4. Updates nftAnalytics in mock-dapp-data.ts automatically
 * 
 * Usage:
 *   npx tsx scripts/generate-nft-analytics.ts [options]
 * 
 * Options:
 *   --max-wallets=N    Limit wallets per dApp (default: 10)
 *   --dapp=slug        Process single dApp only
 *   --dry-run          Show what would be generated without writing
 *   --reset-only       Only reset nftAnalytics to empty values (no API calls)
 */

import { alchemy } from "../lib/indexing/alchemy-client.js";
import { getNFTAnalytics } from "../app/aux/nftAnalysis.js";
import { Result, type OwnedNFT } from "../app/types/result.js";
import type { NFTAnalytics } from "../app/types/nft.js";
import * as fs from "fs";
import * as path from "path";

// Configuration
const DEFAULT_MAX_WALLETS = 10;
const WALLET_FETCH_DELAY_MS = 300;
const DAPP_DELAY_MS = 1000;

// Parse command line arguments
const args = process.argv.slice(2);
const getArg = (name: string): string | undefined => {
  const arg = args.find(a => a.startsWith(`--${name}=`));
  return arg?.split("=")[1];
};
const hasFlag = (name: string): boolean => args.includes(`--${name}`);

const MAX_WALLETS = parseInt(getArg("max-wallets") || String(DEFAULT_MAX_WALLETS), 10);
const SINGLE_DAPP = getArg("dapp");
const DRY_RUN = hasFlag("dry-run");
const RESET_ONLY = hasFlag("reset-only");

// Empty NFT Analytics template (matches NFTAnalytics type)
const EMPTY_NFT_ANALYTICS: NFTAnalytics = {
  totalNFTs: 0,
  collections: [],
  topCollections: [],
  adoption: {
    walletsWithNFTs: 0,
    walletsWithoutNFTs: 0,
    adoptionRate: 0,
    totalNFTs: 0,
    totalLegitimateNFTs: 0,
    averageNFTsPerWallet: 0,
    averageLegitimateNFTsPerWallet: 0,
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
    averageCollectionsPerWallet: 0,
    mostDiverseWallet: null,
    collectionConcentration: 0,
  },
};

interface DappConfig {
  slug: string;
  name: string;
  walletAddresses: string[];
}

/**
 * Extract dApp configurations from mock-dapp-data.ts
 * Parses the file to get slugs and wallet addresses from walletsWithActivity
 */
function extractDappConfigs(fileContent: string): DappConfig[] {
  const configs: DappConfig[] = [];
  
  // Match each dApp block - starts with { followed by id, name, etc.
  // Use non-greedy and anchor to the dApp structure
  const dappRegex = /\{\s*id:\s*"[^"]+",\s*name:\s*"([^"]+)",[\s\S]*?slug:\s*"([^"]+)"[\s\S]*?walletsWithActivity:\s*\[([\s\S]*?)\],\s*transactionInsights/g;
  
  let match;
  while ((match = dappRegex.exec(fileContent)) !== null) {
    const name = match[1] ?? "Unknown";
    const slug = match[2] ?? "";
    const walletsBlock = match[3] ?? "";
    
    if (!slug) continue;
    
    // Extract addresses from walletsWithActivity
    const addressRegex = /address:\s*"(0x[a-fA-F0-9]+)"/g;
    const addresses: string[] = [];
    let addrMatch;
    while ((addrMatch = addressRegex.exec(walletsBlock)) !== null) {
      const addr = addrMatch[1];
      if (addr) {
        addresses.push(addr.toLowerCase());
      }
    }
    
    if (addresses.length > 0) {
      configs.push({
        slug,
        name,
        walletAddresses: addresses.slice(0, MAX_WALLETS),
      });
    }
  }
  
  return configs;
}

/**
 * Fetch NFTs for a single wallet
 */
async function fetchWalletNFTs(address: string): Promise<OwnedNFT[]> {
  try {
    const response = await alchemy.nft.getNftsForOwner(address, {
      pageSize: 100,
      excludeFilters: [], // Include spam for classification
    });

    return response.ownedNfts.map((nft) => ({
      contract: {
        address: nft.contract.address,
        name: nft.contract.name || "Unknown Collection",
        symbol: nft.contract.symbol || "",
        totalSupply: nft.contract.totalSupply || "0",
        tokenType: (nft.contract.tokenType as "ERC721" | "ERC1155") || "ERC721",
        contractDeployer: nft.contract.contractDeployer || "",
        deployedBlockNumber: nft.contract.deployedBlockNumber || 0,
        openSeaMetadata: {
          floorPrice: nft.contract.openSeaMetadata?.floorPrice || 0,
          collectionName: nft.contract.openSeaMetadata?.collectionName || "",
          collectionSlug: nft.contract.openSeaMetadata?.collectionSlug || "",
          safelistRequestStatus: nft.contract.openSeaMetadata?.safelistRequestStatus || "",
          imageUrl: nft.contract.openSeaMetadata?.imageUrl || "",
          description: nft.contract.openSeaMetadata?.description || "",
          externalUrl: nft.contract.openSeaMetadata?.externalUrl || null,
          twitterUsername: nft.contract.openSeaMetadata?.twitterUsername || null,
          discordUrl: nft.contract.openSeaMetadata?.discordUrl || null,
          bannerImageUrl: nft.contract.openSeaMetadata?.bannerImageUrl || null,
          lastIngestedAt: nft.contract.openSeaMetadata?.lastIngestedAt || "",
        },
        isSpam: nft.contract.isSpam || false,
        spamClassifications: nft.contract.spamClassifications || [],
      },
      tokenId: nft.tokenId,
      tokenType: (nft.tokenType as "ERC721" | "ERC1155") || "ERC721",
      name: nft.name || "",
      description: nft.description || "",
      tokenUri: nft.tokenUri || "",
      image: {
        cachedUrl: nft.image?.cachedUrl || "",
        thumbnailUrl: nft.image?.thumbnailUrl || "",
        pngUrl: nft.image?.pngUrl || "",
        contentType: nft.image?.contentType || "",
        size: nft.image?.size || 0,
        originalUrl: nft.image?.originalUrl || "",
      },
      animation: {
        cachedUrl: null,
        contentType: null,
        size: null,
        originalUrl: null,
      },
      raw: {
        tokenUri: nft.raw?.tokenUri || "",
        metadata: {
          name: nft.raw?.metadata?.name || "",
          description: nft.raw?.metadata?.description || "",
          image: nft.raw?.metadata?.image || "",
        },
        error: nft.raw?.error || null,
      },
      collection: {
        name: nft.collection?.name || nft.contract.name || "",
        slug: nft.collection?.slug || "",
        externalUrl: nft.collection?.externalUrl || null,
        bannerImageUrl: nft.collection?.bannerImageUrl || null,
      },
      mint: {
        mintAddress: nft.mint?.mintAddress || null,
        blockNumber: nft.mint?.blockNumber || null,
        timestamp: nft.mint?.timestamp || null,
        transactionHash: nft.mint?.transactionHash || null,
      },
      owners: null,
      timeLastUpdated: nft.timeLastUpdated || "",
      balance: nft.balance?.toString() || "1",
      acquiredAt: {
        blockTimestamp: nft.acquiredAt?.blockTimestamp || null,
        blockNumber: nft.acquiredAt?.blockNumber || null,
      },
    }));
  } catch (error) {
    console.error(`  ✗ Failed to fetch NFTs for ${address.substring(0, 10)}...`);
    return [];
  }
}

/**
 * Generate NFT analytics for a dApp
 */
async function generateAnalyticsForDapp(config: DappConfig): Promise<NFTAnalytics> {
  console.log(`\n📊 Processing ${config.name} (${config.slug})...`);
  console.log(`   Using ${config.walletAddresses.length} wallets from walletsWithActivity`);
  
  const results: Result[] = [];
  
  for (const address of config.walletAddresses) {
    process.stdout.write(`   Fetching ${address.substring(0, 10)}... `);
    const ownedNfts = await fetchWalletNFTs(address);
    const legitimate = ownedNfts.filter(n => !n.contract.isSpam).length;
    console.log(`✓ ${ownedNfts.length} NFTs (${legitimate} legit)`);
    
    results.push({
      address,
      data: {
        nfts: { ownedNfts, totalCount: ownedNfts.length },
        transfers: [],
        tokenBalances: { data: { tokens: [], pageKey: null } },
      },
    });
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, WALLET_FETCH_DELAY_MS));
  }
  
  const analytics = getNFTAnalytics(results);
  
  console.log(`   Summary: ${analytics.adoption.totalNFTs} total, ${analytics.adoption.totalLegitimateNFTs} legit, ${analytics.spamAnalysis.spamPercentage.toFixed(1)}% spam`);
  
  return analytics;
}

/**
 * Format NFTAnalytics object as TypeScript code
 */
function formatAnalyticsAsTS(analytics: NFTAnalytics, indent: string = "      "): string {
  const topCollectionsStr = analytics.topCollections.length > 0
    ? analytics.topCollections.slice(0, 5).map(col => `${indent}  {
${indent}    contractAddress: "${col.contractAddress}",
${indent}    name: "${col.name.replace(/"/g, '\\"')}",
${indent}    symbol: "${col.symbol.replace(/"/g, '\\"')}",
${indent}    tokenType: "${col.tokenType}",
${indent}    totalOwned: ${col.totalOwned},
${indent}    uniqueHolders: ${col.uniqueHolders},
${indent}    holderPercentage: ${col.holderPercentage},
${indent}    floorPrice: ${col.floorPrice},
${indent}    imageUrl: "${col.imageUrl}",
${indent}    collectionSlug: "${col.collectionSlug}",
${indent}    isSpam: ${col.isSpam},
${indent}  }`).join(",\n")
    : "";

  const topSpamStr = analytics.spamAnalysis.topSpamCollections.length > 0
    ? analytics.spamAnalysis.topSpamCollections.map(s => 
        `{ name: "${s.name.replace(/"/g, '\\"')}", count: ${s.count}, affectedWallets: ${s.affectedWallets} }`
      ).join(`,\n${indent}    `)
    : "";

  const mostDiverseWalletStr = analytics.diversityMetrics.mostDiverseWallet
    ? `{
${indent}    address: "${analytics.diversityMetrics.mostDiverseWallet.address}",
${indent}    collectionCount: ${analytics.diversityMetrics.mostDiverseWallet.collectionCount},
${indent}  }`
    : "null";

  return `{
${indent}totalNFTs: ${analytics.totalNFTs},
${indent}collections: [],
${indent}topCollections: [
${topCollectionsStr}
${indent}],
${indent}adoption: {
${indent}  walletsWithNFTs: ${analytics.adoption.walletsWithNFTs},
${indent}  walletsWithoutNFTs: ${analytics.adoption.walletsWithoutNFTs},
${indent}  adoptionRate: ${analytics.adoption.adoptionRate},
${indent}  totalNFTs: ${analytics.adoption.totalNFTs},
${indent}  totalLegitimateNFTs: ${analytics.adoption.totalLegitimateNFTs},
${indent}  averageNFTsPerWallet: ${analytics.adoption.averageNFTsPerWallet},
${indent}  averageLegitimateNFTsPerWallet: ${analytics.adoption.averageLegitimateNFTsPerWallet},
${indent}},
${indent}spamAnalysis: {
${indent}  totalSpam: ${analytics.spamAnalysis.totalSpam},
${indent}  totalLegitimate: ${analytics.spamAnalysis.totalLegitimate},
${indent}  spamPercentage: ${Math.round(analytics.spamAnalysis.spamPercentage * 100) / 100},
${indent}  walletsAffectedBySpam: ${analytics.spamAnalysis.walletsAffectedBySpam},
${indent}  topSpamCollections: [
${indent}    ${topSpamStr}
${indent}  ],
${indent}},
${indent}recentAcquisitions: [],
${indent}diversityMetrics: {
${indent}  uniqueCollections: ${analytics.diversityMetrics.uniqueCollections},
${indent}  averageCollectionsPerWallet: ${analytics.diversityMetrics.averageCollectionsPerWallet},
${indent}  mostDiverseWallet: ${mostDiverseWalletStr},
${indent}  collectionConcentration: ${analytics.diversityMetrics.collectionConcentration},
${indent}},
${indent}}`;
}

/**
 * Find matching brace position
 * Returns the index of the closing brace that matches the opening brace at startIndex
 */
function findMatchingBrace(content: string, startIndex: number): number {
  let depth = 0;
  let i = startIndex;
  
  while (i < content.length) {
    if (content[i] === "{") {
      depth++;
    } else if (content[i] === "}") {
      depth--;
      if (depth === 0) {
        return i;
      }
    }
    i++;
  }
  
  return -1;
}

/**
 * Update mock-dapp-data.ts with new analytics
 */
function updateMockDataFile(
  filePath: string, 
  analyticsMap: Record<string, NFTAnalytics>
): void {
  let content = fs.readFileSync(filePath, "utf-8");
  
  for (const [slug, analytics] of Object.entries(analyticsMap)) {
    // Find the slug in the file
    const slugPattern = new RegExp(`slug:\\s*"${slug}"`);
    const slugMatch = slugPattern.exec(content);
    
    if (!slugMatch) {
      console.log(`   ⚠️ Could not find slug: ${slug}`);
      continue;
    }
    
    // Find nftAnalytics: { after this slug
    const searchStart = slugMatch.index;
    const nftAnalyticsMarker = "nftAnalytics: {";
    const nftAnalyticsIndex = content.indexOf(nftAnalyticsMarker, searchStart);
    
    if (nftAnalyticsIndex === -1) {
      console.log(`   ⚠️ Could not find nftAnalytics for: ${slug}`);
      continue;
    }
    
    // Make sure we're not crossing into another dApp (check if there's another slug: before nftAnalytics)
    const nextSlugMatch = /slug:\s*"[^"]+"/.exec(content.slice(searchStart + slugMatch[0].length));
    if (nextSlugMatch && searchStart + slugMatch[0].length + nextSlugMatch.index < nftAnalyticsIndex) {
      console.log(`   ⚠️ nftAnalytics seems to belong to different dApp: ${slug}`);
      continue;
    }
    
    // Find the opening brace position
    const openBraceIndex = nftAnalyticsIndex + nftAnalyticsMarker.length - 1;
    
    // Find the matching closing brace
    const closeBraceIndex = findMatchingBrace(content, openBraceIndex);
    
    if (closeBraceIndex === -1) {
      console.log(`   ⚠️ Could not find closing brace for nftAnalytics: ${slug}`);
      continue;
    }
    
    // Replace the nftAnalytics block
    const newAnalyticsStr = formatAnalyticsAsTS(analytics);
    content = content.slice(0, nftAnalyticsIndex) + 
              "nftAnalytics: " + newAnalyticsStr + 
              content.slice(closeBraceIndex + 1);
    
    console.log(`   ✓ Updated ${slug}`);
  }
  
  fs.writeFileSync(filePath, content);
}

/**
 * Main execution
 */
async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🚀 NFT ANALYTICS GENERATOR");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`   Max wallets per dApp: ${MAX_WALLETS}`);
  console.log(`   Single dApp: ${SINGLE_DAPP || "all"}`);
  console.log(`   Dry run: ${DRY_RUN}`);
  console.log(`   Reset only: ${RESET_ONLY}`);
  
  const mockDataPath = path.join(process.cwd(), "app/dapp/mock-dapp-data.ts");
  
  if (!fs.existsSync(mockDataPath)) {
    console.error(`❌ File not found: ${mockDataPath}`);
    process.exit(1);
  }
  
  const fileContent = fs.readFileSync(mockDataPath, "utf-8");
  let configs = extractDappConfigs(fileContent);
  
  if (SINGLE_DAPP) {
    configs = configs.filter(c => c.slug === SINGLE_DAPP);
    if (configs.length === 0) {
      console.error(`❌ dApp not found: ${SINGLE_DAPP}`);
      process.exit(1);
    }
  }
  
  console.log(`\n📋 Found ${configs.length} dApp(s) to process:`);
  configs.forEach(c => console.log(`   - ${c.name} (${c.slug}): ${c.walletAddresses.length} wallets`));
  
  const analyticsMap: Record<string, NFTAnalytics> = {};
  
  if (RESET_ONLY) {
    console.log("\n🔄 Reset mode - setting all nftAnalytics to empty values");
    for (const config of configs) {
      analyticsMap[config.slug] = EMPTY_NFT_ANALYTICS;
    }
  } else {
    // Fetch and generate analytics
    for (const config of configs) {
      try {
        const analytics = await generateAnalyticsForDapp(config);
        analyticsMap[config.slug] = analytics;
      } catch (error) {
        console.error(`❌ Failed to process ${config.slug}:`, error);
        analyticsMap[config.slug] = EMPTY_NFT_ANALYTICS;
      }
      
      // Delay between dApps
      if (configs.indexOf(config) < configs.length - 1) {
        await new Promise(resolve => setTimeout(resolve, DAPP_DELAY_MS));
      }
    }
  }
  
  // Save JSON backup
  const jsonPath = path.join(process.cwd(), "scripts/nft-analytics-output.json");
  fs.writeFileSync(jsonPath, JSON.stringify(analyticsMap, null, 2));
  console.log(`\n💾 Saved JSON backup to: ${jsonPath}`);
  
  // Update mock-dapp-data.ts
  if (DRY_RUN) {
    console.log("\n🔍 Dry run - not updating files");
    console.log("\nGenerated analytics preview:");
    for (const [slug, analytics] of Object.entries(analyticsMap)) {
      console.log(`\n${slug}:`);
      console.log(`  Total NFTs: ${analytics.adoption.totalNFTs}`);
      console.log(`  Legitimate: ${analytics.adoption.totalLegitimateNFTs}`);
      console.log(`  Spam: ${analytics.spamAnalysis.totalSpam} (${analytics.spamAnalysis.spamPercentage.toFixed(1)}%)`);
      console.log(`  Collections: ${analytics.topCollections.length}`);
    }
  } else {
    console.log("\n📝 Updating mock-dapp-data.ts...");
    updateMockDataFile(mockDataPath, analyticsMap);
    console.log("✅ File updated successfully!");
  }
  
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ DONE");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main().catch((error) => {
  console.error("Script failed:", error);
  process.exit(1);
});
