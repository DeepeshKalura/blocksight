import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 300; // 5 minutes

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId, contractAddress } = body;

    if (!jobId || !contractAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Queue processing disabled for demo
    return NextResponse.json(
      {
        success: false,
        error: "Queue processing features disabled for demo version",
        message: "Indexing jobs are disabled in demo mode",
      },
      { status: 403 },
    );
  } catch (error) {
    console.error("Error in process-job endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
