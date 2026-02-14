import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    // Indexing features disabled for demo
    return NextResponse.json({
      success: false,
      message: "dApp indexing features disabled for demo version",
      isDemo: true,
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
