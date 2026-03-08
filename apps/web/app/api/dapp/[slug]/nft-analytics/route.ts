import { NextResponse } from "next/server";
import {
  fetchAndCacheNFTAnalytics,
  getCachedNFTAnalytics,
  preloadNFTAnalytics,
} from "@/lib/services/nft-analytics-service";
import { mockDapps } from "@/app/dapp/mock-dapp-data";

const MAX_WALLETS_FOR_LIVE_FETCH = 10;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const url = new URL(request.url);
    const forceRefresh = url.searchParams.get("refresh") === "true";
    const useMock = url.searchParams.get("mock") !== "false";

    // Check cache first
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

    // Find the dApp in mock data
    const mockDapp = mockDapps.find((d) => d.slug === slug);

    // Return pre-generated mock analytics if available
    if (useMock && mockDapp?.dashboardData?.nftAnalytics) {
      preloadNFTAnalytics(slug, mockDapp.dashboardData.nftAnalytics);
      return NextResponse.json({
        success: true,
        data: mockDapp.dashboardData.nftAnalytics,
        cached: false,
        source: "mock",
      });
    }

    // For live fetching, get wallets dynamically from walletsWithActivity
    const walletsWithActivity = mockDapp?.dashboardData?.walletsWithActivity;
    
    if (!walletsWithActivity || walletsWithActivity.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: `No wallet data found for dApp: ${slug}`,
        },
        { status: 404 }
      );
    }

    // Extract wallet addresses from walletsWithActivity (limit to top N by activity)
    const walletAddresses = walletsWithActivity
      .slice(0, MAX_WALLETS_FOR_LIVE_FETCH)
      .map((w) => w.address);

    const analytics = await fetchAndCacheNFTAnalytics({
      slug,
      walletAddresses,
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
