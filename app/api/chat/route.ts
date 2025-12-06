import { NextRequest, NextResponse } from "next/server";
import { streamAIResponse } from "@/lib/ai-service";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { message, walletAddress, balances } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const aiStream = streamAIResponse(message, walletAddress, balances);
          let intent: any = null;
          
          while (true) {
            const { done, value } = await aiStream.next();
            
            if (done) {
              intent = value;
              if (intent) {
                const intentData = JSON.stringify({ intent });
                controller.enqueue(encoder.encode(`data: ${intentData}\n\n`));
              }
              break;
            }
            
            const data = JSON.stringify({ content: value });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
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
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
