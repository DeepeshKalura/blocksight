import { NextRequest, NextResponse } from "next/server";
// import { auth } from "@/lib/auth";
// import { db } from "@/lib/db";
// import { indexedProjects, userDapps, mockDapps } from "@/lib/db/schema";
// import { eq, and } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    // Demo version - return mock data for demo dapps
    const mockDapps = [
      {
        slug: "uniswap",
        name: "Uniswap",
        logoUrl: "/logos/uniswap-uni-logo.png",
        chain: "ethereum",
        contractAddress: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
        dashboardData: {
          overviewStats: {
            totalTransactions: 4500000,
            totalWallets: 435000,
            volume24h: 850000000,
          },
        },
      },
      {
        slug: "puck",
        name: "Puck",
        logoUrl: "/puck-logo.png",
        chain: "ethereum",
        contractAddress: "0x8d5a34...",
        dashboardData: {
          overviewStats: {
            totalTransactions: 120000,
            totalWallets: 89000,
            volume24h: 45000000,
          },
        },
      },
    ];

    const project = mockDapps.find((d) => d.slug === slug);

    if (!project) {
      return NextResponse.json({ error: "dApp not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...project.dashboardData,
        id: project.contractAddress,
        name: project.name,
        logo_url: project.logoUrl,
        chain: project.chain,
        contract_address: project.contractAddress,
        slug: project.slug,
        isUserProject: false,
      },
    });
  } catch (error) {
    console.error("Error fetching dapp data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
