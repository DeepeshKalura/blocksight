import { NextResponse } from "next/server";

// Cron job disabled for demo version
export const maxDuration = 300; // 5 minutes

export async function GET(req: Request) {
  // Cron features disabled for demo
  return NextResponse.json(
    {
      error: "Cron features disabled for demo version",
      message: "Indexing cron jobs are disabled in demo mode",
    },
    { status: 403 },
  );
}
