import { NextResponse } from "next/server";
import { Resend } from "resend";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }
  return new Resend(apiKey);
}

export async function POST(req: Request) {
  const { email, subject, html } = await req.json();

  try {
    const resend = getResendClient();
    const data = await resend.emails.send({
      from: "BlockSight <onboarding@blocksight.dev>",
      to: email,
      subject: subject,
      html: html,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send email", details: error },
      { status: 500 },
    );
  }
}
