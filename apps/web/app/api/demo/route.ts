import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
    try {
        const demoPath = path.join(process.cwd(), "public", "wallet_activities.json");
        const data = await fs.readFile(demoPath, "utf-8");
        const demoData = JSON.parse(data);

        return NextResponse.json({
            success: true,
            data: demoData,
            isDemo: true,
        });
    } catch (error) {
        console.error("Error loading demo data:", error);
        return NextResponse.json({ error: "Failed to load demo data" }, { status: 500 });
    }
}
