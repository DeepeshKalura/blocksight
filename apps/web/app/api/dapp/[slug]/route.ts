import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { indexedProjects, userDapps, mockDapps } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const session = await auth();
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    // First, check if this is a user-indexed project
    let project = null;
    let isUserProject = false;

    if (session?.user?.id) {
      // Check if user has this dapp
      const userDapp = await db
        .select({ contractAddress: userDapps.contractAddress })
        .from(userDapps)
        .where(
          and(eq(userDapps.userId, session.user.id), eq(userDapps.slug, slug)),
        )
        .limit(1);

      if (userDapp.length > 0) {
        // User has this dapp, get the indexed project
        const indexedProject = await db
          .select()
          .from(indexedProjects)
          .where(
            eq(indexedProjects.contractAddress, userDapp[0].contractAddress),
          )
          .limit(1);

        if (indexedProject.length > 0) {
          project = indexedProject[0];
          isUserProject = true;
        }
      }
    }

    // If not found as user project, check mock dapps
    if (!project) {
      const mockDapp = await db
        .select()
        .from(mockDapps)
        .where(eq(mockDapps.slug, slug))
        .limit(1);

      if (mockDapp.length > 0) {
        project = mockDapp[0];
      }
    }

    if (!project) {
      return NextResponse.json({ error: "dApp not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...project.dashboardData,
        id: project.contractAddress,
        name: project.tokenName || project.name,
        logo_url: project.logoUrl,
        chain: project.chain || "ethereum",
        contract_address: project.contractAddress,
        slug: project.slug,
        isUserProject,
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
