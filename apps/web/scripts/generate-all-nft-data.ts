import { alchemy } from "../lib/indexing/alchemy-client.js";
import { getNFTAnalytics } from "../app/aux/nftAnalysis.js";
import { Result, type OwnedNFT } from "../app/types/result.js";
import * as fs from "fs";
import * as path from "path";

// All dApps with their wallet addresses (extracted from mock-dapp-data.ts)
const DAPP_WALLETS: Record<string, { slug: string; wallets: string[] }> = {
  usdt: {
    slug: "usdt",
    wallets: [
      "0x5041ed759dd4afc3a72b8192c143f72f4724081a",
      "0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503",
      "0xf977814e90da44bfa03b6295a0616a897441acec",
      "0x5a52e96bacdabb82fd05763e25335261b270efcb",
      "0x28c6c06298d514db089934071355e5743bf21d60",
    ],
  },
  usdc: {
    slug: "usdc",
    wallets: [
      "0x28c6c06298d514db089934071355e5743bf21d60",
      "0xf60c2ea62edbfe808163751dd0d8693dcb30019c",
      "0xa9d1e08c7793af67e9d92fe308d5697fb81d3e43",
      "0x46340b20830761efd32832a74d7169b29feb9758",
      "0xc94ebb328ac25b95db0e0aa968371885fa516215",
    ],
  },
  weth: {
    slug: "weth",
    wallets: [
      "0xf70da97812cb96acdf810712aa562db8dfa3dbef",
      "0xb1b2d032aa2f52347fbcfd08e5c3cc55216e8404",
      "0xeeb17adefd06a3c67abd4adf7e42978b1f018c8e",
      "0xcfdfad7450a98654b1b874f89c1f6634a81833bf",
      "0x4976a4a02f38326660d17bf34b431dc6e2eb2327",
    ],
  },
  uniswap: {
    slug: "uniswap",
    wallets: [
      "0x94b3c5fc67b0c63befcc74d7afcd333baa697b2a",
      "0x3d71d79c224998e608d03c5ec9b405e7a38505f0",
      "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
      "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45",
      "0xef1c6e67703c7bd7107eed8303fbe6ec2554bf6b",
    ],
  },
  "0x": {
    slug: "0x",
    wallets: [
      "0x4acb6c4321253548a7d4bb9c84032cc4ee04bfd7",
      "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
      "0x000000000022d473030f116ddee9f6b43ac78ba3",
      "0x1111111254eeb25477b68fb85ed929f73a960582",
      "0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad",
    ],
  },
  across: {
    slug: "across",
    wallets: [
      "0x07ae8551be970cb1cca11dd7a11f47ae82e70e67",
      "0x5c7bcd6e7de5423a257d81b442095a1a6ced35c5",
      "0x4d9079bb4165aeb4084c526a32695dcfd2f77381",
      "0x9a8f92a830a5cb89a3816e3d267cb7791c16b04d",
      "0x269727f088f16e1aea52cf5a97b1cd41daa3f02d",
    ],
  },
  metamask: {
    slug: "metamask",
    wallets: [
      "0xa566f4c0ceea9b7113151f4a5e44a15af30d4124",
      "0x881d40237659c251811cec9c364ef91dc08d300c",
      "0x74de5d4fcbf63e00296fd95d33236b9794016631",
      "0x220bda5c8994804ac96ebe4df184d25e5c2196d4",
      "0x1a1ec25dc08e98e5e93f1104b5e5cdd298707d31",
    ],
  },
  "1inch": {
    slug: "1inch",
    wallets: [
      "0xca74f404e0c7bfa35b13b511097df966d5a65597",
      "0x111111125421ca6dc452d289314280a0f8842a65",
      "0x1111111254eeb25477b68fb85ed929f73a960582",
      "0x11111112542d85b3ef69ae05771c2dccff4faa26",
      "0x220bda5c8994804ac96ebe4df184d25e5c2196d4",
    ],
  },
};

async function getWalletNFTsWithMetadata(address: string): Promise<OwnedNFT[]> {
  try {
    const response = await alchemy.nft.getNftsForOwner(address, {
      pageSize: 100,
      excludeFilters: [],
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
        cachedUrl: nft.image?.cachedUrl || null,
        contentType: nft.image?.contentType || null,
        size: nft.image?.size || null,
        originalUrl: nft.image?.originalUrl || null,
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
    console.error(`    ✗ Failed to fetch NFTs for ${address.substring(0, 10)}...`);
    return [];
  }
}

async function generateNFTDataForDapp(dappName: string, wallets: string[]) {
  console.log(`\n📊 Processing ${dappName.toUpperCase()}...`);
  
  const results: Result[] = [];
  
  for (const address of wallets) {
    process.stdout.write(`  Fetching ${address.substring(0, 10)}... `);
    const ownedNfts = await getWalletNFTsWithMetadata(address);
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
    
    // Rate limiting delay
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  const analytics = getNFTAnalytics(results);
  
  console.log(`  Summary: ${analytics.adoption.totalNFTs} total, ${analytics.adoption.totalLegitimateNFTs} legit, ${analytics.spamAnalysis.spamPercentage.toFixed(1)}% spam`);
  
  return analytics;
}

async function generateAllNFTData() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🚀 GENERATING NFT DATA FOR ALL DAPPS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  const allAnalytics: Record<string, any> = {};
  
  for (const [dappName, config] of Object.entries(DAPP_WALLETS)) {
    allAnalytics[config.slug] = await generateNFTDataForDapp(dappName, config.wallets);
  }
  
  // Output results to a JSON file for easy copy-paste
  const outputPath = path.join(process.cwd(), "scripts", "nft-analytics-output.json");
  fs.writeFileSync(outputPath, JSON.stringify(allAnalytics, null, 2));
  
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📝 SUMMARY");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  for (const [slug, analytics] of Object.entries(allAnalytics)) {
    const a = analytics as any;
    console.log(`\n${slug.toUpperCase()}:`);
    console.log(`  Total NFTs: ${a.adoption.totalNFTs}`);
    console.log(`  Legitimate: ${a.adoption.totalLegitimateNFTs}`);
    console.log(`  Spam: ${a.spamAnalysis.totalSpam} (${a.spamAnalysis.spamPercentage.toFixed(1)}%)`);
    console.log(`  Top Collections: ${a.topCollections.length}`);
  }
  
  console.log(`\n✅ Results saved to: ${outputPath}`);
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📋 TYPESCRIPT OUTPUT FOR mock-dapp-data.ts");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  
  // Generate TypeScript-ready output for each dApp
  for (const [slug, analytics] of Object.entries(allAnalytics)) {
    console.log(`\n// ========== ${slug.toUpperCase()} nftAnalytics ==========`);
    console.log(`nftAnalytics: {`);
    console.log(`  totalNFTs: ${(analytics as any).adoption.totalNFTs},`);
    console.log(`  collections: [],`);
    console.log(`  topCollections: ${JSON.stringify((analytics as any).topCollections.slice(0, 5), null, 2).replace(/\n/g, '\n  ')},`);
    console.log(`  adoption: ${JSON.stringify((analytics as any).adoption, null, 2).replace(/\n/g, '\n  ')},`);
    console.log(`  spamAnalysis: ${JSON.stringify((analytics as any).spamAnalysis, null, 2).replace(/\n/g, '\n  ')},`);
    console.log(`  recentAcquisitions: [],`);
    console.log(`  diversityMetrics: ${JSON.stringify((analytics as any).diversityMetrics, null, 2).replace(/\n/g, '\n  ')},`);
    console.log(`},`);
  }
  
  console.log("\n✅ NFT data generation complete for all dApps!");
}

generateAllNFTData().catch((error) => {
  console.error("Generation failed:", error);
  process.exit(1);
});
