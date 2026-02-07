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
    tokenType: "ERC721" | "ERC1155";
  };
  tokenId: string;
  balance: string;
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
    const response = await alchemy.core.getAssetTransfers({
      fromBlock: fromBlock.toString(),
      toBlock: "latest",
      contractAddresses: [contractAddress],
      category: ["erc20", "erc721", "erc1155"],
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
    const response = await alchemy.core.getTokenBalances(address);
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
 * Get NFTs for a wallet
 */
export async function getWalletNFTs(address: string): Promise<AlchemyNFT[]> {
  try {
    const response = await alchemy.nft.getNftsForOwner(address, {
      pageSize: 100,
    });

    return (response.ownedNfts || []).map((nft) => ({
      contract: {
        address: nft.contract.address,
        name: nft.contract.name || "",
        symbol: nft.contract.symbol || "",
        tokenType: (nft.contract.tokenType as "ERC721" | "ERC1155") || "ERC721",
      },
      tokenId: nft.tokenId,
      balance: nft.balance || "1",
    }));
  } catch (error) {
    console.error(`Failed to fetch NFTs for ${address}:`, error);
    return [];
  }
}
