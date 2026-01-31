import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createIndexingJob } from "@/lib/queue/job-creator";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const session = await auth();
    const { slug } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get contract address from body
    const body = await req.json();
    const { contractAddress, chain = "ethereum" } = body;

    if (!contractAddress) {
      return NextResponse.json(
        { error: "Contract address is required" },
        { status: 400 },
      );
    }

    // Create a new indexing job for update
    const result = await createIndexingJob({
      userId: session.user.id,
      contractAddress,
      chain,
      type: "update",
      priority: 1, // High priority for manual updates
    });

    return NextResponse.json({
      success: true,
      jobId: result.jobId,
      status: result.status,
      message: "Update requested. Data will be refreshed shortly.",
    });
  } catch (error) {
    console.error("Error requesting update:", error);
    return NextResponse.json(
      { error: "Failed to request update" },
      { status: 500 },
    );
  }
}
