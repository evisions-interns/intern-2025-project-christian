import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { env } from "@/env";
import { streamText, tool, type Message } from "ai";
import z from "zod";

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
    tools: {
      search: tool({
        description: "search clash royale",
        parameters: z.object({
          query: z.string(),
        }),
        execute: async () => {
          return "Use a Hog Rider Earthquake deck which consists of firecracker, cannon, hog rider, valkyrie, skeleton, ice spirit, earthquake, and log";
        },
      }),
    },
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
