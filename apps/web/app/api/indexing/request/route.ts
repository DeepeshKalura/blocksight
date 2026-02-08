import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { indexingRequests } from "@/lib/db/schema";
import { z, ZodError } from "zod";

import { eq, desc } from "drizzle-orm";

const requestSchema = z.object({
  contractAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid contract address format"),
  chain: z.string().default("ethereum"),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = requestSchema.parse(body);

    const [request] = await db
      .insert(indexingRequests)
      .values({
        userId: session.user.id,
        contractAddress: validated.contractAddress.toLowerCase(),
        chain: validated.chain,
        status: "PENDING",
      })
      .returning();

    return NextResponse.json({ success: true, request });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: (error as any).issues[0].message },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const requests = await db
      .select()
      .from(indexingRequests)
      .where(eq(indexingRequests.userId, session.user.id))
      .orderBy(desc(indexingRequests.createdAt));

    return NextResponse.json({ success: true, requests });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
