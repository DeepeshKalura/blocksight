import { mockDapps } from "@/app/dapp/mock-dapp-data";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, tool } from "ai";
import { z } from "zod";

export const maxDuration = 30;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY || "",
});

async function fetchRealDappData(slug: string, cookie: string | null) {
  try {
    const dappResponse = await fetch(
      `${process.env.NEXTAUTH_URL}/api/dapp/${slug}/data`,
      {
        headers: {
          Cookie: cookie || "",
        },
      },
    );
    if (dappResponse.ok) {
      const data = await dappResponse.json();
      if (data.success && data.dapp) {
        return data.dapp;
      }
    }
  } catch (error) {
    console.log("Failed to fetch real dApp data:", error);
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");
    const { messages } = await req.json();

    // Validate input
    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid messages format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    console.log("--- CHAT API REQUEST ---");
    console.log(`DApp Slug: ${slug || "None"}`);
    console.log(`Message count: ${messages.length}`);

    let activeDapp = slug ? mockDapps.find((d) => d.slug === slug) : null;
    let isDemo = true;

    // Try to fetch real dApp data if available
    if (slug && !activeDapp) {
      try {
        const realDapp = await fetchRealDappData(
          slug,
          req.headers.get("cookie"),
        );
        if (realDapp) {
          activeDapp = realDapp;
          isDemo = false;
          console.log(`Using real dApp data for: ${activeDapp?.name}`);
        }
      } catch (error) {
        console.log("Using demo data, real data fetch failed:", error);
      }
    }

    const systemMessage = activeDapp
      ? `You are a helpful AI assistant for the ${activeDapp.name || "Unknown"} dApp on ${activeDapp.chain || "Ethereum"}.
       ${isDemo ? "NOTE: This is DEMO DATA showing sample analytics." : "NOTE: This is REAL USER DATA from indexed blockchain data."}
       You handle queries about transaction volume, wallet activity, and token distribution.
       The current dApp ID is: ${activeDapp.id || "Unknown"}.
       Always format numbers nicely (e.g., $1.2M, 1,234 txs).
       Always provide a helpful response summarizing the information from any tools you use.`
      : `You are a helpful AI assistant for BlockSight.
       Users can ask about various dApps.
       If they ask about a specific dApp stats, ask them to navigate to that dApp's dashboard or chat.
       Available dApps: ${mockDapps.map((d) => d.name).join(", ")}.
       Always provide helpful responses.`;

    console.log("--- SYSTEM MESSAGE ---");
    console.log(systemMessage);

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
      model: google("gemini-3-flash-preview"),
      system: systemMessage,
      messages: transformedMessages,
      stopWhen: [],
      tools: {
        getDappStats: tool({
          description: "Get overview stats for a dApp",
          inputSchema: z.object({
            dappId: z.string().describe("The ID of the dApp"),
          }),
          execute: async (input: unknown) => {
            console.log("--- TOOL CALL: getDappStats ---");
            console.log("Input:", input);
            try {
              const { dappId } = input as { dappId: string };

              // Try to fetch real data first
              let realDapp = null;
              if (slug && !isDemo) {
                realDapp = await fetchRealDappData(
                  slug,
                  req.headers.get("cookie"),
                );
              }

              if (realDapp && realDapp.dashboardData?.overviewStats) {
                return realDapp.dashboardData.overviewStats;
              }

              // Fallback to demo data
              const dapp = mockDapps.find((d) => d.id === dappId);
              const result = dapp?.dashboardData.overviewStats || {
                error: "dApp not found",
              };
              console.log("Result:", result);
              return result;
            } catch (error) {
              console.error("Error in getDappStats:", error);
              return {
                error: "Failed to fetch dapp stats",
                details: String(error),
              };
            }
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
            console.log("--- TOOL CALL: getTopWallets ---");
            console.log("Input:", input);
            try {
              const { dappId, limit = 5 } = input as {
                dappId: string;
                limit?: number;
              };

              // Try to fetch real data first
              let realDapp = null;
              if (slug && !isDemo) {
                realDapp = await fetchRealDappData(
                  slug,
                  req.headers.get("cookie"),
                );
              }

              if (realDapp && realDapp.dashboardData?.walletsWithActivity) {
                return realDapp.dashboardData.walletsWithActivity.slice(
                  0,
                  limit,
                );
              }

              // Fallback to demo data
              const dapp = mockDapps.find((d) => d.id === dappId);
              const result = dapp?.dashboardData.walletsWithActivity.slice(
                0,
                limit,
              ) || {
                error: "dApp not found",
              };
              console.log("Result:", result);
              return result;
            } catch (error) {
              console.error("Error in getTopWallets:", error);
              return {
                error: "Failed to fetch top wallets",
                details: String(error),
              };
            }
          },
        }),
        getTokenDistribution: tool({
          description:
            "Get token distribution analysis (whales, concentration)",
          inputSchema: z.object({
            dappId: z.string().describe("The ID of the dApp"),
          }),
          execute: async (input: unknown) => {
            console.log("--- TOOL CALL: getTokenDistribution ---");
            console.log("Input:", input);
            try {
              const { dappId } = input as { dappId: string };

              // Try to fetch real data first
              let realDapp = null;
              if (slug && !isDemo) {
                realDapp = await fetchRealDappData(
                  slug,
                  req.headers.get("cookie"),
                );
              }

              if (realDapp && realDapp.dashboardData?.tokenDistribution) {
                return realDapp.dashboardData.tokenDistribution;
              }

              // Fallback to demo data
              const dapp = mockDapps.find((d) => d.id === dappId);
              const result = dapp?.dashboardData.tokenDistribution || {
                error: "dApp not found",
              };
              console.log("Result:", result);
              return result;
            } catch (error) {
              console.error("Error in getTokenDistribution:", error);
              return {
                error: "Failed to fetch token distribution",
                details: String(error),
              };
            }
          },
        }),
      },
    });

    console.log("--- STARTING STREAM RESPONSE ---");
    console.log("Stream format: UI message stream for useChat hook");

    // @ts-ignore - AI SDK typing issue
    const response = result.toUIMessageStreamResponse();

    console.log("Response headers:", {
      contentType: response.headers.get("Content-Type"),
      cacheControl: response.headers.get("Cache-Control"),
      connection: response.headers.get("Connection"),
    });

    return response;
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Chat service unavailable" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
