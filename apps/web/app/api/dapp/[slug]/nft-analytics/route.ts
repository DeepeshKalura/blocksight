import { NextResponse } from "next/server";
import {
  fetchAndCacheNFTAnalytics,
  getCachedNFTAnalytics,
  preloadNFTAnalytics,
} from "@/lib/services/nft-analytics-service";
import { mockDapps } from "@/app/dapp/mock-dapp-data";

const DAPP_WALLETS: Record<string, string[]> = {
  usdt: [
    "0x5041ed759dd4afc3a72b8192c143f72f4724081a",
    "0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503",
    "0xf977814e90da44bfa03b6295a0616a897441acec",
    "0x5a52e96bacdabb82fd05763e25335261b270efcb",
    "0x28c6c06298d514db089934071355e5743bf21d60",
  ],
  usdc: [
    "0x28c6c06298d514db089934071355e5743bf21d60",
    "0xf60c2ea62edbfe808163751dd0d8693dcb30019c",
    "0xa9d1e08c7793af67e9d92fe308d5697fb81d3e43",
    "0x46340b20830761efd32832a74d7169b29feb9758",
    "0xc94ebb328ac25b95db0e0aa968371885fa516215",
  ],
  weth: [
    "0xf70da97812cb96acdf810712aa562db8dfa3dbef",
    "0xb1b2d032aa2f52347fbcfd08e5c3cc55216e8404",
    "0xeeb17adefd06a3c67abd4adf7e42978b1f018c8e",
    "0xcfdfad7450a98654b1b874f89c1f6634a81833bf",
    "0x4976a4a02f38326660d17bf34b431dc6e2eb2327",
  ],
  uniswap: [
    "0x94b3c5fc67b0c63befcc74d7afcd333baa697b2a",
    "0x3d71d79c224998e608d03c5ec9b405e7a38505f0",
    "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
    "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45",
    "0xef1c6e67703c7bd7107eed8303fbe6ec2554bf6b",
  ],
  "0x": [
    "0x4acb6c4321253548a7d4bb9c84032cc4ee04bfd7",
    "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
    "0x000000000022d473030f116ddee9f6b43ac78ba3",
    "0x1111111254eeb25477b68fb85ed929f73a960582",
    "0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad",
  ],
  across: [
    "0x07ae8551be970cb1cca11dd7a11f47ae82e70e67",
    "0x5c7bcd6e7de5423a257d81b442095a1a6ced35c5",
    "0x4d9079bb4165aeb4084c526a32695dcfd2f77381",
    "0x9a8f92a830a5cb89a3816e3d267cb7791c16b04d",
    "0x269727f088f16e1aea52cf5a97b1cd41daa3f02d",
  ],
  metamask: [
    "0xa566f4c0ceea9b7113151f4a5e44a15af30d4124",
    "0x881d40237659c251811cec9c364ef91dc08d300c",
    "0x74de5d4fcbf63e00296fd95d33236b9794016631",
    "0x220bda5c8994804ac96ebe4df184d25e5c2196d4",
    "0x1a1ec25dc08e98e5e93f1104b5e5cdd298707d31",
  ],
  "1inch": [
    "0xca74f404e0c7bfa35b13b511097df966d5a65597",
    "0x111111125421ca6dc452d289314280a0f8842a65",
    "0x1111111254eeb25477b68fb85ed929f73a960582",
    "0x11111112542d85b3ef69ae05771c2dccff4faa26",
    "0x220bda5c8994804ac96ebe4df184d25e5c2196d4",
  ],
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const url = new URL(request.url);
    const forceRefresh = url.searchParams.get("refresh") === "true";
    const useMock = url.searchParams.get("mock") !== "false";

    if (!forceRefresh) {
      const cached = getCachedNFTAnalytics(slug);
      if (cached) {
        return NextResponse.json({
          success: true,
          data: cached,
          cached: true,
          source: "cache",
        });
      }
    }

    if (useMock) {
      const mockDapp = mockDapps.find((d) => d.slug === slug);
      if (mockDapp?.dashboardData?.nftAnalytics) {
        preloadNFTAnalytics(slug, mockDapp.dashboardData.nftAnalytics);
        return NextResponse.json({
          success: true,
          data: mockDapp.dashboardData.nftAnalytics,
          cached: false,
          source: "mock",
        });
      }
    }

    const wallets = DAPP_WALLETS[slug];
    if (!wallets) {
      return NextResponse.json(
        {
          success: false,
          error: `No wallet configuration found for dApp: ${slug}`,
        },
        { status: 404 }
      );
    }

    const analytics = await fetchAndCacheNFTAnalytics({
      slug,
      walletAddresses: wallets,
    }, forceRefresh);

    return NextResponse.json({
      success: true,
      data: analytics,
      cached: false,
      source: "alchemy",
    });
  } catch (error) {
    console.error("Error fetching NFT analytics:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch NFT analytics",
      },
      { status: 500 }
    );
  }
}
