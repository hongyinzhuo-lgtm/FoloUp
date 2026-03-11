"use server";

import { SYSTEM_PROMPT, getInterviewAnalyticsPrompt } from "@/lib/prompts/analytics";
import { InterviewService } from "@/services/interviews.service";
import { ResponseService } from "@/services/responses.service";
import type { Question } from "@/types/interview";
import type { Analytics } from "@/types/response";
import { OpenAI } from "openai";

export const generateInterviewAnalytics = async (payload: {
  callId: string;
  interviewId: string;
  transcript: string;
}) => {
  const { callId, interviewId, transcript } = payload;

  try {
    const response = await ResponseService.getResponseByCallId(callId);
    const interview = await InterviewService.getInterviewById(interviewId);

    if (response.analytics) {
      return { analytics: response.analytics as Analytics, status: 200 };
    }

    const interviewTranscript = transcript || response.details?.transcript;
    const questions = interview?.questions || [];
    const mainInterviewQuestions = questions
      .map((q: Question, index: number) => `${index + 1}. ${q.question}`)
      .join("\n");

    const cerebras = new OpenAI({
      apiKey: process.env.CEREBRAS_API_KEY,
      baseURL: "https://api.cerebras.ai/v1",
      maxRetries: 5,
      dangerouslyAllowBrowser: true,
    });

    const prompt = getInterviewAnalyticsPrompt(interviewTranscript, mainInterviewQuestions);

    const completion = await cerebras.chat.completions.create({
      model: process.env.CEREBRAS_MODEL as string,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const output = completion.choices[0] || {};
    const content = output.message?.content || "";
    const analyticsResponse = JSON.parse(content);

    analyticsResponse.mainInterviewQuestions = questions.map((q: Question) => q.question);

    return { analytics: analyticsResponse, status: 200 };
  } catch (error) {
    console.error("Error in Cerebras request:", error);

    return { error: "internal server error", status: 500 };
  }
};
