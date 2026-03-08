import { alchemy } from "../lib/indexing/alchemy-client.js";
import { getNFTAnalytics } from "../app/aux/nftAnalysis.js";
import { Result, type OwnedNFT } from "../app/types/result.js";

// Top USDC holder wallets from mock data
const USDC_WALLETS = [
  "0x28c6c06298d514db089934071355e5743bf21d60",
  "0xf60c2ea62edbfe808163751dd0d8693dcb30019c",
  "0xa9d1e08c7793af67e9d92fe308d5697fb81d3e43",
  "0x46340b20830761efd32832a74d7169b29feb9758",
  "0xc94ebb328ac25b95db0e0aa968371885fa516215",
];

async function getWalletNFTsWithMetadata(address: string) {
  console.log(`  Fetching NFTs for ${address.substring(0, 10)}...`);
  
  try {
    const response = await alchemy.nft.getNftsForOwner(address, {
      pageSize: 100,
      excludeFilters: [], // Include spam NFTs
    });

    const ownedNfts: OwnedNFT[] = response.ownedNfts.map((nft) => ({
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

    console.log(`    ✓ Found ${ownedNfts.length} NFTs (${ownedNfts.filter(n => !n.contract.isSpam).length} legitimate)`);
    return ownedNfts;
  } catch (error) {
    console.error(`    ✗ Failed:`, error);
    return [];
  }
}

async function generateUSDCNFTData() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊 GENERATING USDC NFT DATA");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const results: Result[] = [];

  // Fetch NFTs for each wallet
  for (const address of USDC_WALLETS) {
    const ownedNfts = await getWalletNFTsWithMetadata(address);
    
    results.push({
      address,
      data: {
        nfts: {
          ownedNfts,
          totalCount: ownedNfts.length,
        },
        transfers: [],
        tokenBalances: {
          data: {
            tokens: [],
            pageKey: null,
          },
        },
      },
    });

    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📈 GENERATING ANALYTICS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const analytics = getNFTAnalytics(results);

  console.log("NFT Analytics Summary:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Wallets with NFTs: ${analytics.adoption.walletsWithNFTs}`);
  console.log(`Total NFTs: ${analytics.adoption.totalNFTs}`);
  console.log(`Legitimate NFTs: ${analytics.adoption.totalLegitimateNFTs}`);
  console.log(`Spam NFTs: ${analytics.spamAnalysis.totalSpam}`);
  console.log(`Spam Percentage: ${analytics.spamAnalysis.spamPercentage.toFixed(1)}%`);
  console.log(`Adoption Rate: ${analytics.adoption.adoptionRate.toFixed(1)}%`);
  console.log(`Unique Collections: ${analytics.diversityMetrics.uniqueCollections}`);
  console.log(`Top Collections: ${analytics.topCollections.length}`);
  console.log(`Recent Acquisitions: ${analytics.recentAcquisitions.length}`);

  if (analytics.topCollections.length > 0) {
    console.log("\nTop 5 Legitimate Collections:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    analytics.topCollections.slice(0, 5).forEach((col, idx) => {
      console.log(`${idx + 1}. ${col.name}`);
      console.log(`   - Total Owned: ${col.totalOwned}`);
      console.log(`   - Unique Holders: ${col.uniqueHolders}`);
      console.log(`   - Floor Price: ${col.floorPrice} ETH`);
    });
  }

  if (analytics.spamAnalysis.topSpamCollections.length > 0) {
    console.log("\nTop 5 Spam Collections:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    analytics.spamAnalysis.topSpamCollections.slice(0, 5).forEach((col, idx) => {
      console.log(`${idx + 1}. ${col.name} (${col.count} NFTs, ${col.affectedWallets} wallets affected)`);
    });
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📝 FORMATTED OUTPUT FOR MOCK DATA");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Output formatted for copy-paste into mock-dapp-data.ts
  console.log("nftAnalytics: {");
  console.log(`  topCollections: ${JSON.stringify(analytics.topCollections, null, 2)},`);
  console.log(`  adoption: ${JSON.stringify(analytics.adoption, null, 2)},`);
  console.log(`  spamAnalysis: ${JSON.stringify(analytics.spamAnalysis, null, 2)},`);
  console.log(`  recentAcquisitions: ${JSON.stringify(analytics.recentAcquisitions, null, 2)},`);
  console.log(`  diversityMetrics: ${JSON.stringify(analytics.diversityMetrics, null, 2)},`);
  console.log("},");

  console.log("\n✅ NFT data generation complete!");
}

generateUSDCNFTData().catch((error) => {
  console.error("Generation failed:", error);
  process.exit(1);
});
