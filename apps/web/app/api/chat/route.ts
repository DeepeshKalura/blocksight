import { mockDapps } from "@/app/dapp/mock-dapp-data";
import Groq from "groq-sdk";

export const maxDuration = 60;

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

// Tool definitions in Groq format
const tools: Groq.Chat.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "getDappStats",
      description: "Get overview stats for a dApp including total wallets, transaction volume, and activity metrics",
      parameters: {
        type: "object",
        properties: {
          dappId: {
            type: "string",
            description: "The contract address/ID of the dApp",
          },
        },
        required: ["dappId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getTopWallets",
      description: "Get list of top active wallets (whales) for a dApp",
      parameters: {
        type: "object",
        properties: {
          dappId: {
            type: "string",
            description: "The contract address/ID of the dApp",
          },
          limit: {
            type: "number",
            description: "Number of wallets to return (default 5)",
          },
        },
        required: ["dappId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getTokenDistribution",
      description: "Get token distribution analysis including whale concentration and balance stats",
      parameters: {
        type: "object",
        properties: {
          dappId: {
            type: "string",
            description: "The contract address/ID of the dApp",
          },
        },
        required: ["dappId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getGasAnalysis",
      description: "Get gas usage and transaction cost analysis including total gas spent, average gas per transaction, estimated USD cost, and highest gas transaction",
      parameters: {
        type: "object",
        properties: {
          dappId: {
            type: "string",
            description: "The contract address/ID of the dApp",
          },
        },
        required: ["dappId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getNFTAnalytics",
      description: "Get NFT holdings analysis including adoption rates, top collections, spam analysis, and diversity metrics",
      parameters: {
        type: "object",
        properties: {
          dappId: {
            type: "string",
            description: "The contract address/ID of the dApp",
          },
        },
        required: ["dappId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getTransactionPatterns",
      description: "Get transaction flow patterns including incoming/outgoing counts and volumes, internal vs external transactions",
      parameters: {
        type: "object",
        properties: {
          dappId: {
            type: "string",
            description: "The contract address/ID of the dApp",
          },
        },
        required: ["dappId"],
      },
    },
  },
];

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

// Tool execution functions
function createToolFunctions(slug: string | null, isDemo: boolean, cookie: string | null) {
  return {
    getDappStats: async (args: { dappId: string }) => {
      console.log("--- TOOL CALL: getDappStats ---");
      console.log("Input:", args);
      try {
        // Try to fetch real data first
        if (slug && !isDemo) {
          const realDapp = await fetchRealDappData(slug, cookie);
          if (realDapp?.dashboardData?.overviewStats) {
            return realDapp.dashboardData.overviewStats;
          }
        }

        // Fallback to demo data
        const dapp = mockDapps.find((d) => d.id === args.dappId);
        const result = dapp?.dashboardData.overviewStats || {
          error: "dApp not found",
        };
        console.log("Result:", result);
        return result;
      } catch (error) {
        console.error("Error in getDappStats:", error);
        return { error: "Failed to fetch dapp stats" };
      }
    },

    getTopWallets: async (args: { dappId: string; limit?: number }) => {
      console.log("--- TOOL CALL: getTopWallets ---");
      console.log("Input:", args);
      try {
        const limit = args.limit || 5;

        // Try to fetch real data first
        if (slug && !isDemo) {
          const realDapp = await fetchRealDappData(slug, cookie);
          if (realDapp?.dashboardData?.walletsWithActivity) {
            return realDapp.dashboardData.walletsWithActivity.slice(0, limit);
          }
        }

        // Fallback to demo data
        const dapp = mockDapps.find((d) => d.id === args.dappId);
        const result = dapp?.dashboardData.walletsWithActivity.slice(0, limit) || {
          error: "dApp not found",
        };
        console.log("Result:", result);
        return result;
      } catch (error) {
        console.error("Error in getTopWallets:", error);
        return { error: "Failed to fetch top wallets" };
      }
    },

    getTokenDistribution: async (args: { dappId: string }) => {
      console.log("--- TOOL CALL: getTokenDistribution ---");
      console.log("Input:", args);
      try {
        // Try to fetch real data first
        if (slug && !isDemo) {
          const realDapp = await fetchRealDappData(slug, cookie);
          if (realDapp?.dashboardData?.tokenDistribution) {
            return realDapp.dashboardData.tokenDistribution;
          }
        }

        // Fallback to demo data
        const dapp = mockDapps.find((d) => d.id === args.dappId);
        const result = dapp?.dashboardData.tokenDistribution || {
          error: "dApp not found",
        };
        console.log("Result:", result);
        return result;
      } catch (error) {
        console.error("Error in getTokenDistribution:", error);
        return { error: "Failed to fetch token distribution" };
      }
    },

    getGasAnalysis: async (args: { dappId: string }) => {
      console.log("--- TOOL CALL: getGasAnalysis ---");
      console.log("Input:", args);
      try {
        // Try to fetch real data first
        if (slug && !isDemo) {
          const realDapp = await fetchRealDappData(slug, cookie);
          if (realDapp?.dashboardData?.transactionInsights?.gasAnalysis) {
            return realDapp.dashboardData.transactionInsights.gasAnalysis;
          }
        }

        // Fallback to demo data
        const dapp = mockDapps.find((d) => d.id === args.dappId);
        const result = dapp?.dashboardData.transactionInsights?.gasAnalysis || {
          error: "Gas analysis data not found",
        };
        console.log("Result:", result);
        return result;
      } catch (error) {
        console.error("Error in getGasAnalysis:", error);
        return { error: "Failed to fetch gas analysis" };
      }
    },

    getNFTAnalytics: async (args: { dappId: string }) => {
      console.log("--- TOOL CALL: getNFTAnalytics ---");
      console.log("Input:", args);
      try {
        // Try to fetch real data first
        if (slug && !isDemo) {
          const realDapp = await fetchRealDappData(slug, cookie);
          if (realDapp?.dashboardData?.nftAnalytics) {
            return realDapp.dashboardData.nftAnalytics;
          }
        }

        // Fallback to demo data
        const dapp = mockDapps.find((d) => d.id === args.dappId);
        const result = dapp?.dashboardData.nftAnalytics || {
          error: "NFT analytics data not found",
        };
        console.log("Result:", result);
        return result;
      } catch (error) {
        console.error("Error in getNFTAnalytics:", error);
        return { error: "Failed to fetch NFT analytics" };
      }
    },

    getTransactionPatterns: async (args: { dappId: string }) => {
      console.log("--- TOOL CALL: getTransactionPatterns ---");
      console.log("Input:", args);
      try {
        // Try to fetch real data first
        if (slug && !isDemo) {
          const realDapp = await fetchRealDappData(slug, cookie);
          if (realDapp?.dashboardData?.transactionInsights?.patterns) {
            return realDapp.dashboardData.transactionInsights.patterns;
          }
        }

        // Fallback to demo data
        const dapp = mockDapps.find((d) => d.id === args.dappId);
        const result = dapp?.dashboardData.transactionInsights?.patterns || {
          error: "Transaction patterns data not found",
        };
        console.log("Result:", result);
        return result;
      } catch (error) {
        console.error("Error in getTransactionPatterns:", error);
        return { error: "Failed to fetch transaction patterns" };
      }
    },
  };
}

// SSE helper to write events
function writeSSE(controller: ReadableStreamDefaultController, data: object | string) {
  const encoder = new TextEncoder();
  const message = typeof data === "string" ? data : JSON.stringify(data);
  controller.enqueue(encoder.encode(`data: ${message}\n\n`));
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
        const realDapp = await fetchRealDappData(slug, req.headers.get("cookie"));
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
The current dApp ID is: ${activeDapp.id || "Unknown"}.

AVAILABLE TOOLS - Use these to answer user questions:
- getDappStats: Overall metrics (total wallets, transaction count, volume, active/inactive wallets)
- getGasAnalysis: Gas costs (total gas spent, average per transaction, USD estimate, highest gas tx)
- getNFTAnalytics: NFT data (adoption rates, top collections, spam analysis, diversity metrics)
- getTopWallets: Most active wallet addresses with their activity stats
- getTokenDistribution: Token concentration, whale analysis, balance distribution
- getTransactionPatterns: Transaction flow (incoming/outgoing counts and volumes)

RULES:
1. When user asks about ANY data, ALWAYS call the relevant tool first - never say "I don't have data"
2. Before calling a tool, output: <thinking>Fetching [data type]...</thinking>
3. After getting results, summarize clearly WITHOUT thinking tags
4. Format numbers nicely ($1.2M instead of 1200000, 1,234 txs)

Example:
User: "What's the gas usage?"
You: <thinking>Fetching gas analysis...</thinking>
[call getGasAnalysis]
[then provide summary of results]`
      : `You are a helpful AI assistant for BlockSight.
Users can ask about various dApps.
If they ask about a specific dApp stats, ask them to navigate to that dApp's dashboard or chat.
Available dApps: ${mockDapps.map((d) => d.name).join(", ")}.

When you need to call a tool, first output: <thinking>Fetching data...</thinking>
After receiving tool results, provide your full response WITHOUT thinking tags.`;

    console.log("--- SYSTEM MESSAGE ---");
    console.log(systemMessage);

    // Transform messages from AI SDK format to Groq format
    const transformedMessages: Groq.Chat.ChatCompletionMessageParam[] = messages.map((message: any) => {
      let content = "";
      if (message.parts && Array.isArray(message.parts)) {
        content = message.parts
          .filter((part: any) => part.type === "text")
          .map((part: any) => part.text)
          .join("");
      } else if (message.content) {
        content = typeof message.content === "string" ? message.content : JSON.stringify(message.content);
      }
      return {
        role: message.role as "user" | "assistant",
        content,
      };
    });

    const modelId = process.env.GROQ_MODEL || "moonshotai/kimi-k2-instruct-0905";
    console.log(`Using Groq model: ${modelId}`);

    const toolFunctions = createToolFunctions(slug, isDemo, req.headers.get("cookie"));

    // Create streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Build conversation messages
          const allMessages: Groq.Chat.ChatCompletionMessageParam[] = [
            { role: "system", content: systemMessage },
            ...transformedMessages,
          ];

          let textId = 0;
          let iteration = 0;
          const maxIterations = 5;

          // Write initial SSE events
          writeSSE(controller, { type: "start" });
          writeSSE(controller, { type: "start-step" });

          // Tool-calling loop
          while (iteration < maxIterations) {
            iteration++;
            console.log(`--- Iteration ${iteration} ---`);

            const response = await groq.chat.completions.create({
              model: modelId,
              messages: allMessages,
              tools,
              tool_choice: "auto",
              stream: true,
            });

            let assistantContent = "";
            const toolCalls: Array<{
              id: string;
              type: "function";
              function: { name: string; arguments: string };
            }> = [];
            const toolCallDeltas: Map<number, { id: string; name: string; arguments: string }> = new Map();
            let pendingTextBuffer = "";
            let hasToolCalls = false;

            // Process streamed response - buffer text until we know if tool calls follow
            for await (const chunk of response) {
              const delta = chunk.choices[0]?.delta;
              const finishReason = chunk.choices[0]?.finish_reason;

              // Handle text content - buffer it first
              if (delta?.content) {
                pendingTextBuffer += delta.content;
              }

              // Handle tool calls
              if (delta?.tool_calls) {
                hasToolCalls = true;
                for (const toolCallDelta of delta.tool_calls) {
                  const index = toolCallDelta.index;
                  
                  if (!toolCallDeltas.has(index)) {
                    toolCallDeltas.set(index, {
                      id: toolCallDelta.id || "",
                      name: toolCallDelta.function?.name || "",
                      arguments: "",
                    });
                  }
                  
                  const existing = toolCallDeltas.get(index)!;
                  if (toolCallDelta.id) existing.id = toolCallDelta.id;
                  if (toolCallDelta.function?.name) existing.name = toolCallDelta.function.name;
                  if (toolCallDelta.function?.arguments) {
                    existing.arguments += toolCallDelta.function.arguments;
                  }
                }
              }

              // Handle finish - now we know if there are tool calls
              if (finishReason === "stop" || finishReason === "tool_calls") {
                if (pendingTextBuffer.trim()) {
                  // Check if text already has thinking tags
                  const hasThinkingTags = /<thinking>[\s\S]*?<\/thinking>/.test(pendingTextBuffer);
                  
                  if ((hasToolCalls || finishReason === "tool_calls") && !hasThinkingTags) {
                    // Text before tool calls without thinking tags - wrap it
                    const wrappedText = `<thinking>${pendingTextBuffer.trim()}</thinking>`;
                    writeSSE(controller, { type: "text-start", id: `txt-${textId}` });
                    writeSSE(controller, { type: "text-delta", id: `txt-${textId}`, delta: wrappedText });
                    writeSSE(controller, { type: "text-end", id: `txt-${textId}` });
                    textId++;
                    assistantContent = pendingTextBuffer;
                  } else {
                    // Final response or already has thinking tags - stream as-is
                    writeSSE(controller, { type: "text-start", id: `txt-${textId}` });
                    writeSSE(controller, { type: "text-delta", id: `txt-${textId}`, delta: pendingTextBuffer });
                    writeSSE(controller, { type: "text-end", id: `txt-${textId}` });
                    textId++;
                    assistantContent = pendingTextBuffer;
                  }
                }
                break;
              }
            }

            // Convert accumulated tool call deltas to tool calls array
            for (const [, toolCallData] of toolCallDeltas) {
              if (toolCallData.name) {
                toolCalls.push({
                  id: toolCallData.id,
                  type: "function",
                  function: {
                    name: toolCallData.name,
                    arguments: toolCallData.arguments,
                  },
                });
              }
            }

            // If no tool calls, we're done
            if (toolCalls.length === 0) {
              console.log("No tool calls, finishing");
              break;
            }

            console.log(`Tool calls: ${toolCalls.map(tc => tc.function.name).join(", ")}`);

            // Add assistant message with tool calls to conversation
            allMessages.push({
              role: "assistant",
              content: assistantContent || null,
              tool_calls: toolCalls,
            } as Groq.Chat.ChatCompletionMessageParam);

            // Execute tools and add results
            for (const toolCall of toolCalls) {
              const functionName = toolCall.function.name as keyof typeof toolFunctions;
              const functionArgs = JSON.parse(toolCall.function.arguments || "{}");
              
              let result: any;
              if (toolFunctions[functionName]) {
                result = await toolFunctions[functionName](functionArgs);
              } else {
                result = { error: `Unknown function: ${functionName}` };
              }

              // Add tool result to conversation
              allMessages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content: JSON.stringify(result),
              } as Groq.Chat.ChatCompletionMessageParam);
            }

            // Continue loop to get final response after tool execution
          }

          // Finish SSE stream
          writeSSE(controller, { type: "finish-step" });
          writeSSE(controller, { type: "finish", finishReason: "stop" });
          writeSSE(controller, "[DONE]");
          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          writeSSE(controller, { type: "error", message: String(error) });
          writeSSE(controller, "[DONE]");
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Chat service unavailable" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
