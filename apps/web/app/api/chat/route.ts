import { mockDapps } from "@/app/dapp/mock-dapp-data";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, tool } from "ai";
import { z } from "zod";

export const maxDuration = 30;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const { messages, id } = await req.json();

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
    console.log(`DApp ID: ${id || "None"}`);
    console.log(`Message count: ${messages.length}`);

    const lastUserMessage = messages
      .reverse()
      .find((m: any) => m.role === "user");
    if (lastUserMessage) {
      // Extract text content from either AI SDK v6 parts format or legacy content format
      let content = lastUserMessage.content;

      if (!content && lastUserMessage.parts) {
        content = lastUserMessage.parts
          .filter((part: any) => part.type === "text")
          .map((part: any) => part.text)
          .join("");
      }

      if (content) {
        console.log(`Last User Message: ${content.substring(0, 100)}...`);
      } else {
        console.log("Last User Message: [No text content found]");
      }
    } else {
      console.log("No user message found.");
    }

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
