import {
  agentRegistry,
  executeAgentsParallel,
  getAgentIds,
} from "@/lib/agents";
import { validateProductURL } from "@/lib/product-url";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

type RequestBody = {
  messages?: Message[];
};

export async function POST(req: Request) {
  let body: RequestBody;

  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON in request body" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const { messages } = body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return new Response(
      JSON.stringify({ error: "Missing or invalid messages array" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const lastMessage = messages[messages.length - 1];

  if (!lastMessage || typeof lastMessage.content !== "string") {
    return new Response(JSON.stringify({ error: "Invalid message format" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const rawURL = lastMessage.content.trim();

  const validation = validateProductURL(rawURL);

  if (validation.isErr()) {
    const error = validation.error;
    const errorMessages: Record<string, string> = {
      missing_url: "Product URL is required",
      relative_url: "Relative URLs are not allowed",
      system_path: "System paths are not allowed",
      invalid_domain: "Invalid domain name",
      invalid_protocol: "Only HTTP and HTTPS protocols are allowed",
      invalid_format: "Invalid URL format",
    };

    return new Response(
      JSON.stringify({
        error: errorMessages[error.type] || "Invalid product URL",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const productURL = validation.value;

  console.log(`[Product API] Analyzing product: ${productURL}`);

  const agentPromises = executeAgentsParallel(agentRegistry, productURL);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const sendMessage = (data: unknown) => {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      sendMessage({
        type: "status",
        message: "Starting product analysis...",
      });

      const agentIds = getAgentIds();
      const agentNames: Record<string, string> = {
        "basic-info": "Basic Information",
        overview: "Product Overview",
        features: "Key Features",
        "pros-cons": "Pros & Cons",
        reviews: "Reviews Analysis",
      };

      await Promise.allSettled(
        agentIds.map(async (agentId) => {
          try {
            sendMessage({
              type: "agent-start",
              agentId,
              name: agentNames[agentId] || agentId,
            });

            const result = await agentPromises.get(agentId)!;

            if (result.error) {
              throw result.error;
            }

            console.log(
              `[Product API] ${agentId} completed in ${result.duration.toFixed(0)}ms`,
            );

            sendMessage({
              type: agentId,
              data: result.data,
            });
          } catch (error) {
            console.error(`[Product API] ${agentId} failed:`, error);
            sendMessage({
              type: "error",
              agentId,
              error: error instanceof Error ? error.message : String(error),
            });
          }
        }),
      );

      sendMessage({
        type: "complete",
        message: "Analysis complete",
      });

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
