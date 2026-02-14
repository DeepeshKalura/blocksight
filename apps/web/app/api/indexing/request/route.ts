// Indexing API disabled for demo version
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Indexing features disabled for demo" },
    { status: 403 },
  );
}

export async function GET() {
  return NextResponse.json(
    { error: "Indexing features disabled for demo" },
    { status: 403 },
  );
}
