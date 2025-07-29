import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { env } from "@/env";
import { streamText, tool, type Message } from "ai";
import z from "zod";
import { Index } from "@upstash/vector";

const openrouter = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
});

type Metadata = {};

const index = new Index<Metadata>({
  url: env.UPSTASH_VECTOR_REST_URL,
  token: env.UPSTASH_VECTOR_REST_READONLY_TOKEN,
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
        description: "search knowledge base",
        parameters: z.object({
          query: z.string(),
        }),
        
        execute: async (params) => {
          const results = await index.query({
            data: params.query,
            topK: 5,
            includeData: true,
          });


          return results;
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
