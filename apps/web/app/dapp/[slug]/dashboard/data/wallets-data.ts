export type Wallet = {
  id: string; // The wallet address
  ensName: string | null;
  avatarUrl: string;
  balanceUSD: number;
  nftCount: number;
  rank: number;
  userType: "Long-Term Holder" | "Active Trader" | "New User" | "Inactive";
};

export const mockWallets: Wallet[] = [
  {
    id: "0xmino...eth",
    ensName: "minooor.eth",
    avatarUrl: "/avatars/mino.png",
    balanceUSD: 2200000,
    nftCount: 450,
    rank: 100,
    userType: "Long-Term Holder",
  },
  {
    id: "0x959...A35",
    ensName: "0x959...4A35",
    avatarUrl: "/avatars/0x959.png",
    balanceUSD: 1700000,
    nftCount: 450,
    rank: 100,
    userType: "Active Trader",
  },
  {
    id: "0xH9f...9k73",
    ensName: "0xH9f...9K73",
    avatarUrl: "/avatars/0xH9f.png",
    balanceUSD: 860500,
    nftCount: 450,
    rank: 100,
    userType: "Active Trader",
  },
  {
    id: "0xcryp...eth",
    ensName: "cryptoboss.eth",
    avatarUrl: "/avatars/cryptoboss.png",
    balanceUSD: 739000,
    nftCount: 450,
    rank: 100,
    userType: "Active Trader",
  },
  {
    id: "0xnons...eth",
    ensName: "nonstopgamer.eth",
    avatarUrl: "/avatars/nonstopgamer.png",
    balanceUSD: 724300,
    nftCount: 450,
    rank: 100,
    userType: "Active Trader",
  },
  // Add a few more to fill out the grid
  {
    id: "0x0x9...A35_2",
    ensName: "0x959...4A35",
    avatarUrl: "/avatars/0x959_2.png",
    balanceUSD: 860500,
    nftCount: 450,
    rank: 100,
    userType: "Long-Term Holder",
  },
  {
    id: "0x0xE...4J9H",
    ensName: "0xE8d...4J9H",
    avatarUrl: "/avatars/0xE8d.png",
    balanceUSD: 860500,
    nftCount: 450,
    rank: 100,
    userType: "New User",
  },
  {
    id: "0xmem...eth",
    ensName: "memelord.eth",
    avatarUrl: "/avatars/memelord.png",
    balanceUSD: 860500,
    nftCount: 450,
    rank: 100,
    userType: "Inactive",
  },
  {
    id: "0x0xH...u9h6",
    ensName: "0xH7j...u9h6",
    avatarUrl: "/avatars/0xH7j.png",
    balanceUSD: 860500,
    nftCount: 450,
    rank: 100,
    userType: "Active Trader",
  },
];