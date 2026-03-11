"use server";

import { logger } from "@/lib/logger"; 
import { SYSTEM_PROMPT, generateQuestionsPrompt } from "@/lib/prompts/generate-questions";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

export const maxDuration = 60;

export async function POST(req: Request) {
  logger.info("generate-interview-questions request received");
  const body = await req.json();

  const cerebras = new OpenAI({
    apiKey: process.env.CEREBRAS_API_KEY,
    baseURL: "https://api.cerebras.ai/v1",
    maxRetries: 5,
    dangerouslyAllowBrowser: true,
  });

  try {
    const completion = await cerebras.chat.completions.create({
      model: "gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: generateQuestionsPrompt(body),
        },
      ],
      response_format: { type: "json_object" },
    });

    const output = completion.choices[0] || {};
    const content = output.message?.content;

    logger.info("Interview questions generated successfully");

    return NextResponse.json(
      {
        response: content,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Error generating interview questions", error);

    return NextResponse.json({ error: "internal server error" }, { status: 500 });
  }
}
