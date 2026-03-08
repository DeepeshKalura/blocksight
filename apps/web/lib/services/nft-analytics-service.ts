import { NFTAnalytics } from "@/app/types/nft";
import { getNFTAnalytics } from "@/app/aux/nftAnalysis";
import { Result, type OwnedNFT } from "@/app/types/result";
import { getWalletNFTs } from "@/lib/indexing/alchemy-client";

type CacheEntry = {
  data: NFTAnalytics;
  timestamp: number;
  expiresAt: number;
};

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes for demo, can be adjusted

class NFTAnalyticsCache {
  private cache: Map<string, CacheEntry> = new Map();

  get(slug: string): NFTAnalytics | null {
    const entry = this.cache.get(slug);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(slug);
      return null;
    }

    return entry.data;
  }

  set(slug: string, data: NFTAnalytics, ttlMs: number = CACHE_TTL_MS): void {
    const now = Date.now();
    this.cache.set(slug, {
      data,
      timestamp: now,
      expiresAt: now + ttlMs,
    });
  }

  invalidate(slug: string): void {
    this.cache.delete(slug);
  }

  invalidateAll(): void {
    this.cache.clear();
  }

  has(slug: string): boolean {
    const entry = this.cache.get(slug);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(slug);
      return false;
    }
    return true;
  }
}

export const nftAnalyticsCache = new NFTAnalyticsCache();

export interface WalletConfig {
  slug: string;
  walletAddresses: string[];
}

export async function fetchAndCacheNFTAnalytics(
  config: WalletConfig,
  forceRefresh: boolean = false
): Promise<NFTAnalytics> {
  const { slug, walletAddresses } = config;

  if (!forceRefresh) {
    const cached = nftAnalyticsCache.get(slug);
    if (cached) {
      console.log(`[NFT Cache] Hit for ${slug}`);
      return cached;
    }
  }

  console.log(`[NFT Cache] Miss for ${slug}, fetching from Alchemy...`);

  const results: Result[] = [];

  for (const address of walletAddresses) {
    try {
      const walletNfts = await getWalletNFTs(address);

      const ownedNfts: OwnedNFT[] = walletNfts.map((nft) => ({
        contract: {
          address: nft.contract.address,
          name: nft.contract.name,
          symbol: nft.contract.symbol,
          totalSupply: nft.contract.totalSupply,
          tokenType: nft.contract.tokenType,
          contractDeployer: nft.contract.contractDeployer,
          deployedBlockNumber: nft.contract.deployedBlockNumber,
          openSeaMetadata: nft.contract.openSeaMetadata,
          isSpam: nft.contract.isSpam,
          spamClassifications: nft.contract.spamClassifications,
        },
        tokenId: nft.tokenId,
        tokenType: nft.tokenType,
        name: nft.name,
        description: nft.description,
        tokenUri: nft.tokenUri,
        image: nft.image,
        animation: {
          cachedUrl: null,
          contentType: null,
          size: null,
          originalUrl: null,
        },
        raw: nft.raw,
        collection: nft.collection,
        mint: nft.mint,
        owners: null,
        timeLastUpdated: nft.timeLastUpdated,
        balance: nft.balance,
        acquiredAt: nft.acquiredAt,
      }));

      results.push({
        address,
        data: {
          nfts: { ownedNfts, totalCount: ownedNfts.length },
          transfers: [],
          tokenBalances: { data: { tokens: [], pageKey: null } },
        },
      });
    } catch (error) {
      console.error(`Failed to fetch NFTs for ${address}:`, error);
      results.push({
        address,
        data: {
          nfts: { ownedNfts: [], totalCount: 0 },
          transfers: [],
          tokenBalances: { data: { tokens: [], pageKey: null } },
        },
      });
    }
  }

  const analytics = getNFTAnalytics(results);

  nftAnalyticsCache.set(slug, analytics);
  console.log(`[NFT Cache] Cached analytics for ${slug}`);

  return analytics;
}

export function getCachedNFTAnalytics(slug: string): NFTAnalytics | null {
  return nftAnalyticsCache.get(slug);
}

export function preloadNFTAnalytics(
  slug: string,
  analytics: NFTAnalytics
): void {
  nftAnalyticsCache.set(slug, analytics, Infinity);
}
