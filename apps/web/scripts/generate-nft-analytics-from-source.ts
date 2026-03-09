import { alchemy } from "../lib/indexing/alchemy-client.js";
import { getNFTAnalytics } from "../app/aux/nftAnalysis.js";
import { Result, type OwnedNFT } from "../app/types/result.js";
import type { NFTAnalytics } from "../app/types/nft.js";
import * as fs from "fs";
import * as path from "path";

const DEFAULT_MAX_WALLETS = 10;
const WALLET_FETCH_DELAY_MS = 300;
const DAPP_DELAY_MS = 1000;

const args = process.argv.slice(2);
const getArg = (name: string): string | undefined => {
  const arg = args.find((a) => a.startsWith(`--${name}=`));
  return arg?.split("=")[1];
};

const MAX_WALLETS = parseInt(
  getArg("max-wallets") || String(DEFAULT_MAX_WALLETS),
  10,
);
const SOURCE_PATH = getArg("source") || "scripts/canonical-mock-dapps.json";

type SourceDapp = {
  name: string;
  slug: string;
  dashboardData: {
    walletsWithActivity: { address: string }[];
  };
};

async function fetchWalletNFTs(address: string): Promise<OwnedNFT[]> {
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
          safelistRequestStatus:
            nft.contract.openSeaMetadata?.safelistRequestStatus || "",
          imageUrl: nft.contract.openSeaMetadata?.imageUrl || "",
          description: nft.contract.openSeaMetadata?.description || "",
          externalUrl: nft.contract.openSeaMetadata?.externalUrl || null,
          twitterUsername:
            nft.contract.openSeaMetadata?.twitterUsername || null,
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
    console.error(`  Failed to fetch NFTs for ${address.substring(0, 10)}...`);
    return [];
  }
}

async function generateAnalyticsForDapp(
  dapp: SourceDapp,
): Promise<NFTAnalytics> {
  console.log(`\nProcessing ${dapp.name} (${dapp.slug})...`);
  const results: Result[] = [];
  const wallets = dapp.dashboardData.walletsWithActivity
    .slice(0, MAX_WALLETS)
    .map((wallet) => wallet.address.toLowerCase());

  for (const address of wallets) {
    process.stdout.write(`  Fetching ${address.substring(0, 10)}... `);
    const ownedNfts = await fetchWalletNFTs(address);
    const legitimate = ownedNfts.filter((nft) => !nft.contract.isSpam).length;
    console.log(`${ownedNfts.length} NFTs (${legitimate} legit)`);

    results.push({
      address,
      data: {
        nfts: { ownedNfts, totalCount: ownedNfts.length },
        transfers: [],
        tokenBalances: { data: { tokens: [], pageKey: null } },
      },
    });

    await new Promise((resolve) => setTimeout(resolve, WALLET_FETCH_DELAY_MS));
  }

  const analytics = getNFTAnalytics(results);
  console.log(
    `  Summary: ${analytics.adoption.totalNFTs} total, ${analytics.adoption.totalLegitimateNFTs} legit, ${analytics.spamAnalysis.spamPercentage.toFixed(1)}% spam`,
  );
  return analytics;
}

async function main() {
  const sourceFilePath = path.join(process.cwd(), SOURCE_PATH);
  const sourceDapps = JSON.parse(
    fs.readFileSync(sourceFilePath, "utf-8"),
  ) as SourceDapp[];

  console.log(`Loaded ${sourceDapps.length} dapps from ${sourceFilePath}`);
  const analyticsBySlug: Record<string, NFTAnalytics> = {};

  for (const dapp of sourceDapps) {
    analyticsBySlug[dapp.slug] = await generateAnalyticsForDapp(dapp);
    if (sourceDapps.indexOf(dapp) < sourceDapps.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, DAPP_DELAY_MS));
    }
  }

  const outputPath = path.join(
    process.cwd(),
    "scripts/nft-analytics-output.json",
  );
  fs.writeFileSync(outputPath, JSON.stringify(analyticsBySlug, null, 2));
  console.log(`\nSaved analytics to ${outputPath}`);
}

main().catch((error) => {
  console.error("Script failed:", error);
  process.exit(1);
});
