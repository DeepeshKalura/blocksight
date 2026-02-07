import { Transfer, Result, TokenBalance } from "@/app/types/result";
import {
  getContractTransfers,
  getWalletTokenBalances,
  getWalletNFTs,
} from "./alchemy-client";

export interface IndexingConfig {
  contractAddress: string;
  timeWindow?: number;
  maxWallets?: number;
}

export async function fetchContractData(config: IndexingConfig): Promise<{
  transfers: Transfer[];
  tokenMetadata: { name: string | null; symbol: string | null };
  wallets: Set<string>;
}> {
  const { contractAddress } = config;

  console.log(`Fetching transfers for ${contractAddress}...`);

  // Fetch transactions
  const transfers = await getContractTransfers(contractAddress);

  // Extract unique wallet addresses
  const wallets = new Set<string>();
  transfers.forEach((t) => {
    if (t.from) wallets.add(t.from.toLowerCase());
    if (t.to) wallets.add(t.to.toLowerCase());
  });

  console.log(
    `Found ${transfers.length} transfers, ${wallets.size} unique wallets`,
  );

  return {
    transfers: transfers as unknown as Transfer[],
    tokenMetadata: { name: null, symbol: null },
    wallets,
  };
}

export async function fetchWalletDetails(walletAddresses: string[]): Promise<{
  balances: Record<string, TokenBalance>;
  nfts: Record<string, { ownedNfts: unknown[]; totalCount: number }>;
}> {
  const balances: Record<string, TokenBalance> = {};
  const nfts: Record<string, { ownedNfts: unknown[]; totalCount: number }> = {};

  console.log(`Fetching details for ${walletAddresses.length} wallets...`);

  for (const address of walletAddresses.slice(0, 50)) {
    try {
      const [tokenBalances, walletNfts] = await Promise.all([
        getWalletTokenBalances(address),
        getWalletNFTs(address),
      ]);

      balances[address] = {
        data: {
          tokens: tokenBalances,
          pageKey: null,
        },
      };

      nfts[address] = {
        ownedNfts: walletNfts as unknown[],
        totalCount: walletNfts.length,
      };
    } catch (error) {
      console.error(`Failed to fetch details for ${address}:`, error);
      balances[address] = {
        data: {
          tokens: [],
          pageKey: null,
        },
      };
      nfts[address] = {
        ownedNfts: [],
        totalCount: 0,
      };
    }
  }

  return { balances, nfts };
}

export async function buildIndexingResult(
  contractAddress: string,
  transfers: Transfer[],
  balances: Record<string, TokenBalance>,
  nfts: Record<string, { ownedNfts: unknown[]; totalCount: number }>,
): Promise<Result[]> {
  const results: Result[] = [];

  for (const address of Object.keys(balances)) {
    results.push({
      address,
      data: {
        transfers: transfers.filter(
          (t) =>
            t.from.toLowerCase() === address.toLowerCase() ||
            t.to.toLowerCase() === address.toLowerCase(),
        ),
        tokenBalances: balances[address]!,
        nfts: nfts[address] || { ownedNfts: [], totalCount: 0 },
      },
    });
  }

  return results;
}
