export const SYSTEM_PROMPT = `你是一名擅长分析面试沟通能力的专家。你的任务是：
1. 分析面试转录内容中体现出的沟通能力
2. 找出能支持分析结论的具体原话引用
3. 详细拆解沟通方面的优势与待提升点
4. 所有输出内容必须使用简体中文
5. 除非用户明确要求，否则不要使用英文`;

export const getCommunicationAnalysisPrompt = (
  transcript: string,
) => `请分析以下面试转录内容中体现出的沟通能力：

面试转录：${transcript}

请严格遵循以下要求：
- 所有输出内容必须使用简体中文。
- JSON 中的所有字符串字段都必须是中文。
- supportingQuotes.quote 字段可以保留转录中的原话；如果原话本身是英文，则允许保留英文原句，但 analysis 必须使用简体中文。
- "type" 字段也必须使用中文，只能填写："优势" 或 "待提升"。
- overallFeedback 请写 2-3 句中文总结。
- communicationScore 为 0-10 的数字评分。
- strengths 必须是中文数组。
- improvementAreas 必须是中文数组。
- 不要输出 markdown，不要输出代码块，不要输出 JSON 之外的任何解释。

请按照以下 JSON 格式输出：
{
  "communicationScore": number,
  "overallFeedback": string,
  "supportingQuotes": [
    {
      "quote": string,
      "analysis": string,
      "type": string
    }
  ],
  "strengths": [string],
  "improvementAreas": [string]
}`;
