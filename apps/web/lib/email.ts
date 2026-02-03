import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "BlockSight <noreply@blocksight.deepesh.io>"; // Update with your domain

export async function sendIndexingCompleteEmail(
    to: string,
    contractAddress: string,
    dashboardUrl: string
) {
    if (!process.env.RESEND_API_KEY) {
        console.log("Resend API key missing, skipping email");
        return;
    }

    await resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject: "Your dApp indexing is complete! 🎉",
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Indexing Complete</h2>
        <p>Your dApp at <code>${contractAddress}</code> has been successfully indexed.</p>
        <p>You can now view detailed analytics and insights on your dashboard.</p>
        <div style="margin: 20px 0;">
          <a href="${dashboardUrl}" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Dashboard →</a>
        </div>
        <p>Thank you for using BlockSight!</p>
      </div>
    `,
    });
}

export async function sendIndexingFailedEmail(
    to: string,
    contractAddress: string,
    error: string
) {
    if (!process.env.RESEND_API_KEY) {
        console.log("Resend API key missing, skipping email");
        return;
    }

    await resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject: "dApp indexing failed",
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Indexing Failed</h2>
        <p>We encountered an error indexing your dApp at <code>${contractAddress}</code>.</p>
        <div style="background-color: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px; margin: 20px 0;">
          Error: ${error}
        </div>
        <p>Please try again or contact support if the issue persists.</p>
      </div>
    `,
    });
}
