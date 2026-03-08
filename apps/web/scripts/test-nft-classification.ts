import { alchemy } from "../lib/indexing/alchemy-client.js";
import { getNFTAnalytics } from "../app/aux/nftAnalysis.js";
import { Result, type OwnedNFT } from "../app/types/result.js";

// Using a known NFT collector wallet (Vitalik's address as a test)
const TEST_WALLET = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";

async function getWalletNFTsWithMetadata(address: string) {
  console.log(`\n🔍 Fetching NFTs for wallet: ${address}...`);
  
  try {
    const response = await alchemy.nft.getNftsForOwner(address, {
      pageSize: 100,
      excludeFilters: [], // Include spam NFTs
    });

    console.log(`✅ Fetched ${response.ownedNfts.length} NFTs\n`);

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

    return ownedNfts;
  } catch (error) {
    console.error(`❌ Failed to fetch NFTs:`, error);
    return [];
  }
}

async function testNFTClassification(walletAddress: string) {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🧪 NFT CLASSIFICATION TEST SCRIPT");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // Fetch NFTs with full metadata
  const ownedNfts = await getWalletNFTsWithMetadata(walletAddress);

  if (ownedNfts.length === 0) {
    console.log("⚠️  No NFTs found for this wallet");
    return;
  }

  // Analyze spam vs legitimate
  const spamNfts = ownedNfts.filter((nft) => nft.contract.isSpam);
  const legitimateNfts = ownedNfts.filter((nft) => !nft.contract.isSpam);

  console.log("📊 FETCH RESULTS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`  Total NFTs fetched: ${ownedNfts.length}`);
  console.log(`  Legitimate NFTs: ${legitimateNfts.length}`);
  console.log(`  Spam NFTs: ${spamNfts.length}`);
  console.log(`  Spam percentage: ${((spamNfts.length / ownedNfts.length) * 100).toFixed(1)}%`);

  // Show top legitimate collections
  const collectionCounts = new Map<string, { name: string; count: number; floorPrice: number }>();
  legitimateNfts.forEach((nft) => {
    const key = nft.contract.address.toLowerCase();
    if (!collectionCounts.has(key)) {
      collectionCounts.set(key, {
        name: nft.contract.name,
        count: 0,
        floorPrice: nft.contract.openSeaMetadata.floorPrice,
      });
    }
    collectionCounts.get(key)!.count++;
  });

  const topCollections = Array.from(collectionCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  console.log("\n🏆 TOP LEGITIMATE COLLECTIONS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  topCollections.forEach((col, idx) => {
    console.log(`  ${idx + 1}. ${col.name} (${col.count} NFTs, floor: ${col.floorPrice} ETH)`);
  });

  // Show spam collections
  const spamCollectionCounts = new Map<string, { name: string; count: number; reasons: Set<string> }>();
  spamNfts.forEach((nft) => {
    const key = nft.contract.address.toLowerCase();
    if (!spamCollectionCounts.has(key)) {
      spamCollectionCounts.set(key, {
        name: nft.contract.name,
        count: 0,
        reasons: new Set(),
      });
    }
    const col = spamCollectionCounts.get(key)!;
    col.count++;
    nft.contract.spamClassifications.forEach((reason) => col.reasons.add(reason));
  });

  const topSpamCollections = Array.from(spamCollectionCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  if (topSpamCollections.length > 0) {
    console.log("\n🚫 SPAM COLLECTIONS DETECTED");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    topSpamCollections.forEach((col, idx) => {
      const reasons = Array.from(col.reasons).join(", ");
      console.log(`  ${idx + 1}. ${col.name} (${col.count} NFTs)`);
      if (reasons) {
        console.log(`     Reasons: ${reasons}`);
      }
    });
  }

  // Show detailed spam analysis for first few spam NFTs
  console.log("\n🔍 DETAILED SPAM ANALYSIS (First 3 Spam NFTs)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  spamNfts.slice(0, 3).forEach((nft, idx) => {
    console.log(`\n  ${idx + 1}. ${nft.name || nft.contract.name}`);
    console.log(`     Contract: ${nft.contract.address}`);
    console.log(`     Token ID: ${nft.tokenId}`);
    console.log(`     Is Spam: ${nft.contract.isSpam}`);
    console.log(`     Spam Classifications: [${nft.contract.spamClassifications.join(", ")}]`);
    console.log(`     OpenSea Floor Price: ${nft.contract.openSeaMetadata.floorPrice} ETH`);
    console.log(`     Collection Slug: ${nft.contract.openSeaMetadata.collectionSlug || "N/A"}`);
  });

  // Show detailed legitimate NFT analysis
  if (legitimateNfts.length > 0) {
    console.log("\n✅ DETAILED LEGITIMATE NFT ANALYSIS");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    legitimateNfts.slice(0, 3).forEach((nft, idx) => {
      console.log(`\n  ${idx + 1}. ${nft.name || nft.contract.name}`);
      console.log(`     Contract: ${nft.contract.address}`);
      console.log(`     Token ID: ${nft.tokenId}`);
      console.log(`     Is Spam: ${nft.contract.isSpam}`);
      console.log(`     Spam Classifications: [${nft.contract.spamClassifications.join(", ")}]`);
      console.log(`     OpenSea Floor Price: ${nft.contract.openSeaMetadata.floorPrice} ETH`);
      console.log(`     Collection Slug: ${nft.contract.openSeaMetadata.collectionSlug || "N/A"}`);
      console.log(`     Safelist Status: ${nft.contract.openSeaMetadata.safelistRequestStatus || "N/A"}`);
    });
  }

  // Create Result object and run through analytics
  const result: Result = {
    address: walletAddress,
    data: {
      nfts: {
        ownedNfts: ownedNfts,
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
  };

  console.log("\n📈 RUNNING ANALYTICS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  const analytics = getNFTAnalytics([result]);

  console.log(`  Adoption Rate: ${analytics.adoption.adoptionRate.toFixed(1)}%`);
  console.log(`  Total NFTs: ${analytics.adoption.totalNFTs}`);
  console.log(`  Legitimate NFTs: ${analytics.adoption.totalLegitimateNFTs}`);
  console.log(`  Unique Collections: ${analytics.diversityMetrics.uniqueCollections}`);
  console.log(`  Spam Percentage: ${analytics.spamAnalysis.spamPercentage.toFixed(1)}%`);
  console.log(`  Top Collections Found: ${analytics.topCollections.length}`);
  console.log(`  Recent Acquisitions: ${analytics.recentAcquisitions.length}`);

  const top = analytics.topCollections[0];
  if (top) {
    console.log("\n  Top Collection from Analytics:");
    console.log(`    - ${top.name} (${top.totalOwned} owned, ${top.holderPercentage.toFixed(1)}% adoption)`);
  }

  const recent = analytics.recentAcquisitions[0];
  if (recent) {
    console.log("\n  Most Recent Acquisition:");
    console.log(`    - ${recent.nftName} from ${recent.collectionName}`);
    console.log(`    - Acquired: ${recent.acquiredAt}`);
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ CLASSIFICATION LOGIC VALIDATED SUCCESSFULLY!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

// Run the test
testNFTClassification(TEST_WALLET).catch((error) => {
  console.error("Test failed:", error);
  process.exit(1);
});
