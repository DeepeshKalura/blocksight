import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateJobStatus, getJobStatus } from "@/lib/queue/job-creator";
import { db } from "@/lib/db";
import { indexedProjects, userDapps } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { processContractIndexing } from "@/lib/indexing/data-processor";
import { generateSlug } from "@/lib/indexing/slug-generator";

export const maxDuration = 300; // 5 minutes

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId, userId, contractAddress, chain, type } = body;

    if (!jobId || !contractAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    console.log(`Processing job ${jobId} for ${contractAddress}`);

    // Update job status to processing
    await updateJobStatus(jobId, "processing");

    try {
      // Process the contract
      const dashboardData = await processContractIndexing({
        contractAddress,
        chain,
      });

      // Generate slug and get metadata
      const { slug, tokenName, tokenSymbol } =
        await generateSlug(contractAddress);

      // Check if project already exists
      const existingProject = await db
        .select({ id: indexedProjects.id })
        .from(indexedProjects)
        .where(
          eq(indexedProjects.contractAddress, contractAddress.toLowerCase()),
        )
        .limit(1);

      if (existingProject.length === 0) {
        // Insert new project
        await db.insert(indexedProjects).values({
          contractAddress: contractAddress.toLowerCase(),
          slug,
          tokenName,
          tokenSymbol,
          dashboardData,
          totalTransactions: dashboardData.overviewStats.totalTransactions,
          totalWallets: dashboardData.overviewStats.totalWallets,
        });
      } else {
        // Update existing project
        await db
          .update(indexedProjects)
          .set({
            dashboardData,
            updatedAt: new Date(),
            totalTransactions: dashboardData.overviewStats.totalTransactions,
            totalWallets: dashboardData.overviewStats.totalWallets,
          })
          .where(eq(indexedProjects.id, existingProject[0].id));
      }

      // Add to user_dapps if not already there
      await db
        .insert(userDapps)
        .values({
          userId,
          contractAddress: contractAddress.toLowerCase(),
          slug,
          tokenName,
          tokenSymbol,
          chain: chain || "ethereum",
          isDemo: false,
        })
        .onConflictDoNothing();

      // Mark job as completed
      await updateJobStatus(jobId, "completed");

      return NextResponse.json({
        success: true,
        jobId,
        slug,
        contractAddress,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(`Job ${jobId} failed:`, error);

      // Mark job as failed
      await updateJobStatus(jobId, "failed", errorMessage);

      return NextResponse.json(
        {
          error: "Processing failed",
          details: errorMessage,
        },
        { status: 500 },
      );
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error in process-job handler:", error);
    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 },
    );
  }
}
