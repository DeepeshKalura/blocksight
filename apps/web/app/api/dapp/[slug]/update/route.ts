import { NextRequest, NextResponse } from "next/server";
// import { auth } from "@/lib/auth";
// import { createIndexingJob } from "@/lib/queue/job-creator";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    // Authentication and indexing disabled for demo
    const session = null;
    const { slug } = await params;

    // Demo version - indexing features disabled
    return NextResponse.json(
      {
        error: "Indexing features disabled for demo version",
        message: "Cannot update dApp data in demo mode",
      },
      { status: 403 },
    );
  } catch (error) {
    console.error("Error updating dapp:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
