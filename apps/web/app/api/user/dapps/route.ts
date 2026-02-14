import { NextRequest, NextResponse } from "next/server";
// import { auth } from "@/lib/auth";
// import { getUserDapps } from "@/lib/db/queries";

export async function GET(req: NextRequest) {
  try {
    // Authentication disabled for demo
    // const session = await auth();
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // Return empty array for demo
    return NextResponse.json({
      success: true,
      dapps: [],
      message: "User dApps features disabled for demo",
    });
  } catch (error) {
    console.error("Error fetching user dapps:", error);
    return NextResponse.json(
      { error: "Failed to fetch dApps" },
      { status: 500 },
    );
  }
}
