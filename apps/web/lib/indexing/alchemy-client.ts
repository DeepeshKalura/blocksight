import { Alchemy, Network } from "alchemy-sdk";

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY!,
  network: Network.ETH_MAINNET,
  maxRetries: 3,
};

export const alchemy = new Alchemy(settings);

export type AlchemyTransfer = {
  blockNum: string;
  uniqueId: string;
  hash: string;
  from: string;
  to: string;
  value: number;
  erc721TokenId: string | null;
  erc1155Metadata: any | null;
  tokenId: string | null;
  asset: string;
  category: string;
  rawContract: {
    value: string;
    address: string | null;
    decimal: string;
  };
  metadata: {
    blockTimestamp: string;
  };
};

export type AlchemyTokenBalance = {
  tokenAddress: string | null;
  tokenBalance: string;
  decimals: number;
  symbol: string;
  name: string;
};

export type AlchemyNFT = {
  contract: {
    address: string;
    name: string;
    symbol: string;
    totalSupply: string;
    tokenType: "ERC721" | "ERC1155";
    contractDeployer: string;
    deployedBlockNumber: number;
    openSeaMetadata: {
      floorPrice: number;
      collectionName: string;
      collectionSlug: string;
      safelistRequestStatus: string;
      imageUrl: string;
      description: string;
      externalUrl: string | null;
      twitterUsername: string | null;
      discordUrl: string | null;
      bannerImageUrl: string | null;
      lastIngestedAt: string;
    };
    isSpam: boolean;
    spamClassifications: string[];
  };
  tokenId: string;
  tokenType: "ERC721" | "ERC1155";
  name: string;
  description: string;
  tokenUri: string;
  image: {
    cachedUrl: string;
    thumbnailUrl: string;
    pngUrl: string;
    contentType: string;
    size: number;
    originalUrl: string;
  };
  raw: {
    tokenUri: string;
    metadata: {
      name: string;
      description: string;
      image: string;
    };
    error: string | null;
  };
  collection: {
    name: string;
    slug: string;
    externalUrl: string | null;
    bannerImageUrl: string | null;
  };
  mint: {
    mintAddress: string | null;
    blockNumber: number | null;
    timestamp: string | null;
    transactionHash: string | null;
  };
  timeLastUpdated: string;
  balance: string;
  acquiredAt: {
    blockTimestamp: string | null;
    blockNumber: number | null;
  };
};

/**
 * Get token transfers for a contract address
 */
export async function getContractTransfers(
  contractAddress: string,
  fromBlock: number = 0,
  maxCount: number = 1000,
): Promise<AlchemyTransfer[]> {
  const transfers: AlchemyTransfer[] = [];
  let pageKey: string | null = null;

  do {
    const response: any = await alchemy.core.getAssetTransfers({
      fromBlock: fromBlock.toString(),
      toBlock: "latest",
      contractAddresses: [contractAddress],
      category: ["erc20", "erc721", "erc1155"] as any,
      maxCount: Math.min(maxCount - transfers.length, 1000),
      pageKey: pageKey || undefined,
      withMetadata: true,
    });

    const results = response.transfers || [];
    transfers.push(...(results as unknown as AlchemyTransfer[]));
    pageKey = response.pageKey || null;

    if (transfers.length >= maxCount) {
      break;
    }
  } while (pageKey);

  return transfers;
}

/**
 * Get token metadata
 */
export async function getTokenMetadata(contractAddress: string): Promise<{
  name: string | null;
  symbol: string | null;
  decimals: number | null;
  logo: string | null;
}> {
  try {
    const metadata = await alchemy.core.getTokenMetadata(contractAddress);
    return {
      name: metadata.name || null,
      symbol: metadata.symbol || null,
      decimals: metadata.decimals || null,
      logo: metadata.logo || null,
    };
  } catch (error) {
    console.error(
      `Failed to fetch token metadata for ${contractAddress}:`,
      error,
    );
    return {
      name: null,
      symbol: null,
      decimals: null,
      logo: null,
    };
  }
}

/**
 * Get wallet token balances
 */
export async function getWalletTokenBalances(
  address: string,
): Promise<AlchemyTokenBalance[]> {
  try {
    const response: any = await alchemy.core.getTokenBalances(address);
    const tokens: AlchemyTokenBalance[] = [];

    // Add native ETH
    const ethBalance = await alchemy.core.getBalance(address);
    tokens.push({
      tokenAddress: null,
      tokenBalance: ethBalance.toHexString(),
      decimals: 18,
      symbol: "ETH",
      name: "Ethereum",
    });

    // Add ERC-20 tokens
    for (const token of response.tokenBalances || []) {
      if (token.tokenBalance === "0") continue;

      const metadata = await alchemy.core.getTokenMetadata(
        token.contractAddress,
      );
      tokens.push({
        tokenAddress: token.contractAddress,
        tokenBalance: token.tokenBalance,
        decimals: metadata.decimals || 18,
        symbol: metadata.symbol || "",
        name: metadata.name || "",
      });
    }

    return tokens;
  } catch (error) {
    console.error(`Failed to fetch token balances for ${address}:`, error);
    return [];
  }
}

/**
 * Get NFTs for a wallet with complete metadata including spam classification
 */
export async function getWalletNFTs(address: string): Promise<AlchemyNFT[]> {
  try {
    const response = await alchemy.nft.getNftsForOwner(address, {
      pageSize: 100,
      excludeFilters: [], // Include spam NFTs for classification
    });

    return (response.ownedNfts || []).map((nft) => ({
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
      timeLastUpdated: nft.timeLastUpdated || "",
      balance: nft.balance?.toString() || "1",
      acquiredAt: {
        blockTimestamp: nft.acquiredAt?.blockTimestamp || null,
        blockNumber: nft.acquiredAt?.blockNumber || null,
      },
    }));
  } catch (error) {
    console.error(`Failed to fetch NFTs for ${address}:`, error);
    return [];
  }
}
