import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { indexingRequests, indexedProjects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = params;

    // Try to find indexed project by contract address
    // First try exact match
    let project = await db
      .select()
      .from(indexedProjects)
      .where(eq(indexedProjects.contractAddress, slug))
      .limit(1);

    // If not found, try with 0x prefix
    if (project.length === 0) {
      project = await db
        .select()
        .from(indexedProjects)
        .where(eq(indexedProjects.contractAddress, `0x${slug}`))
        .limit(1);
    }

    // If still not found, try case-insensitive search
    if (project.length === 0) {
      const allProjects = await db.select().from(indexedProjects);
      const foundProject = allProjects.find(
        (p) =>
          p.contractAddress.toLowerCase() === slug.toLowerCase() ||
          p.contractAddress.toLowerCase() === `0x${slug.toLowerCase()}`,
      );
      if (foundProject) {
        project = [foundProject];
      }
    }

    if (project.length === 0) {
      return NextResponse.json({
        success: false,
        message: "dApp not found or not indexed yet",
      });
    }

    const indexedProject = project[0];
    if (!indexedProject) {
      return NextResponse.json({
        success: false,
        message: "dApp not found",
      });
    }

    // Check if user has access to this dApp
    const userRequest = await db
      .select()
      .from(indexingRequests)
      .where(eq(indexingRequests.id, indexedProject.requestId));

    if (
      userRequest.length === 0 ||
      !userRequest[0]?.userId ||
      userRequest[0].userId !== session.user.id
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "You don't have access to this dApp",
        },
        { status: 403 },
      );
    }

    // Parse dashboard data
    const dashboardData = indexedProject.dashboardData as any;

    // Transform to match DemoDapp interface
    const dapp = {
      id: indexedProject.contractAddress,
      name: dashboardData?.name || "Unnamed dApp",
      logo_url: dashboardData?.logoUrl || "/puck-logo.png",
      chain: dashboardData?.chain || "ethereum",
      contract_address: indexedProject.contractAddress,
      description: dashboardData?.description || "No description available",
      slug: indexedProject.contractAddress.slice(2, 10).toLowerCase(), // Simple slug from address
      status: "COMPLETED" as const,
      dashboardData: dashboardData || {},
    };

    return NextResponse.json({
      success: true,
      dapp,
      isDemo: false,
    });
  } catch (error) {
    console.error("Error fetching dApp data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch dApp data",
      },
      { status: 500 },
    );
  }
}
