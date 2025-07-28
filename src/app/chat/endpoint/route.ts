import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { env } from "@/env";
import { streamText, type Message } from "ai";

const openrouter = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
});

export async function POST(request: Request) {
  const { messages } = (await request.json()) as {
    messages: Message[];
  };

  const result = streamText({
    model: openrouter("openai/gpt-4o-mini"),
    messages,
    system: "you are a helpful and wise assistant.  Make your responses short.",
  });

  return result.toDataStreamResponse();
}