import { mockDapps } from "@/app/dapp/mock-dapp-data";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, tool } from "ai";
import { z } from "zod";

export const maxDuration = 30;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY || "",
});

export async function POST(req: Request) {
  const { messages, id } = await req.json();

  const activeDapp = id ? mockDapps.find((d) => d.id === id) : null;

  const systemMessage = activeDapp
    ? `You are a helpful AI assistant for the ${activeDapp.name} dApp on ${activeDapp.chain}.
       You handle queries about transaction volume, wallet activity, and token distribution.
       The current dApp ID is: ${activeDapp.id}.
       Always format numbers nicely (e.g., $1.2M, 1,234 txs).`
    : `You are a helpful AI assistant for BlockSight.
       Users can ask about various dApps.
       If they ask about a specific dApp stats, ask them to navigate to that dApp's dashboard or chat.
       Available dApps: ${mockDapps.map((d) => d.name).join(", ")}.`;

  // Transform messages from AI SDK v6 format to Google AI format
  const transformedMessages = messages.map((message: any) => {
    // If message has parts (AI SDK v6 format), extract content
    if (message.parts && Array.isArray(message.parts)) {
      const textContent = message.parts
        .filter((part: any) => part.type === "text")
        .map((part: any) => part.text)
        .join("");
      return {
        role: message.role,
        content: textContent,
      };
    }
    // If message already has content (Google AI format), pass through
    if (message.content) {
      return {
        role: message.role,
        content: message.content,
      };
    }
    // Fallback for any other format
    return {
      role: message.role,
      content:
        typeof message.content === "string"
          ? message.content
          : JSON.stringify(message.content),
    };
  });

  const result = streamText({
    model: google("gemini-flash-latest"),
    system: systemMessage,
    messages: transformedMessages,
    tools: {
      getDappStats: tool({
        description: "Get overview stats for a dApp",
        inputSchema: z.object({
          dappId: z.string().describe("The ID of the dApp"),
        }),
        execute: async (input: unknown) => {
          const { dappId } = input as { dappId: string };
          const dapp = mockDapps.find((d) => d.id === dappId);
          return (
            dapp?.dashboardData.overviewStats || { error: "dApp not found" }
          );
        },
      }),
      getTopWallets: tool({
        description: "Get list of top active wallets (whales)",
        inputSchema: z.object({
          dappId: z.string().describe("The ID of the dApp"),
          limit: z
            .number()
            .optional()
            .describe("Number of wallets to return (default 5)"),
        }),
        execute: async (input: unknown) => {
          const { dappId, limit = 5 } = input as {
            dappId: string;
            limit?: number;
          };
          const dapp = mockDapps.find((d) => d.id === dappId);
          return (
            dapp?.dashboardData.walletsWithActivity.slice(0, limit) || {
              error: "dApp not found",
            }
          );
        },
      }),
      getTokenDistribution: tool({
        description: "Get token distribution analysis (whales, concentration)",
        inputSchema: z.object({
          dappId: z.string().describe("The ID of the dApp"),
        }),
        execute: async (input: unknown) => {
          const { dappId } = input as { dappId: string };
          const dapp = mockDapps.find((d) => d.id === dappId);
          return (
            dapp?.dashboardData.tokenDistribution || { error: "dApp not found" }
          );
        },
      }),
    },
  });

  return result.toTextStreamResponse();
}
