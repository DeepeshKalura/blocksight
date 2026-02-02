import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  indexingRequests,
  indexedProjects,
  users,
  userDapps,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateSlug } from "@/lib/indexing/slug-generator";
import {
  sendIndexingCompleteEmail,
  sendIndexingFailedEmail,
} from "@/lib/email";
import { processContractIndexing } from "@/lib/indexing/data-processor";

export const maxDuration = 300; // 5 minutes

export async function GET(req: Request) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get pending requests
    const pending = await db
      .select({
        id: indexingRequests.id,
        userId: indexingRequests.userId,
        contractAddress: indexingRequests.contractAddress,
        chain: indexingRequests.chain,
        userEmail: users.email,
      })
      .from(indexingRequests)
      .innerJoin(users, eq(indexingRequests.userId, users.id))
      .where(eq(indexingRequests.status, "PENDING"))
      .limit(5);

    const results: { id: string; status: string; error?: string }[] = [];

    for (const request of pending) {
      try {
        // Update to INDEXING
        await db
          .update(indexingRequests)
          .set({ status: "PROCESSING" })
          .where(eq(indexingRequests.id, request.id));

        // Generate slug
        const { slug, tokenName, tokenSymbol } = await generateSlug(
          request.contractAddress,
        );

        // Process indexing
        const dashboardData = await processContractIndexing({
          contractAddress: request.contractAddress,
          chain: request.chain,
        });

        // Check if contract already exists in indexed_projects
        const existingProject = await db
          .select({ id: indexedProjects.id })
          .from(indexedProjects)
          .where(
            eq(
              indexedProjects.contractAddress,
              request.contractAddress.toLowerCase(),
            ),
          )
          .limit(1);

        if (existingProject.length === 0) {
          // Insert new indexed project
          await db.insert(indexedProjects).values({
            contractAddress: request.contractAddress.toLowerCase(),
            slug,
            tokenName,
            tokenSymbol,
            dashboardData,
            totalTransactions:
              dashboardData.overviewStats?.totalTransactions || 0,
            totalWallets: dashboardData.overviewStats?.totalWallets || 0,
          });
        } else {
          // Update existing project
          await db
            .update(indexedProjects)
            .set({
              dashboardData,
              updatedAt: new Date(),
              totalTransactions:
                dashboardData.overviewStats?.totalTransactions || 0,
              totalWallets: dashboardData.overviewStats?.totalWallets || 0,
            })
            .where(eq(indexedProjects.id, existingProject[0].id));
        }

        // Add to user_dapps
        await db
          .insert(userDapps)
          .values({
            userId: request.userId,
            contractAddress: request.contractAddress.toLowerCase(),
            slug,
            tokenName,
            tokenSymbol,
            chain: request.chain,
            isDemo: false,
          })
          .onConflictDoNothing();

        // Update request to COMPLETED
        await db
          .update(indexingRequests)
          .set({ status: "COMPLETED", completedAt: new Date() })
          .where(eq(indexingRequests.id, request.id));

        // Send success email
        await sendIndexingCompleteEmail(
          request.userEmail,
          request.contractAddress,
          `${process.env.NEXT_PUBLIC_APP_URL}/dapp/${slug}`,
        );

        results.push({ id: request.id, status: "success" });
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        console.error(`Error processing request ${request.id}:`, error);

        // Update to FAILED
        await db
          .update(indexingRequests)
          .set({
            status: "FAILED",
            errorMessage: errorMessage,
            completedAt: new Date(),
          })
          .where(eq(indexingRequests.id, request.id));

        // Send failure email
        await sendIndexingFailedEmail(
          request.userEmail,
          request.contractAddress,
          errorMessage,
        );

        results.push({ id: request.id, status: "failed", error: errorMessage });
      }
    }

    return NextResponse.json({ processed: results.length, results });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
