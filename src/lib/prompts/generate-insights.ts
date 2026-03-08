export const SYSTEM_PROMPT =
  "You are an expert in uncovering deeper insights from interview question and answer sets. Always respond only in Simplified Chinese. Never use English unless explicitly requested.";

export const createUserPrompt = (
  callSummaries: string,
  interviewName: string,
  interviewObjective: string,
  interviewDescription: string,
) => {
  return `你是一名擅长从面试问题、回答和通话总结中提炼深层洞察的专业面试分析师。
请基于以下通话总结和面试信息，生成用户反馈洞察。

###
通话总结：${callSummaries}

###
面试标题：${interviewName}
面试目标：${interviewObjective}
面试说明：${interviewDescription}

请严格遵循以下要求：
- 所有输出内容必须使用简体中文。
- 生成 3 条洞察，突出候选人或用户反馈中的关键观点、倾向、共性问题或深层信号。
- 只输出洞察内容，不要添加任何额外解释。
- 不要在洞察中包含用户姓名。
- 每条洞察控制在 25 个汉字以内。
- 不要输出英文，不要中英混杂。

请以 JSON 格式输出，且只能输出一个 JSON 对象。
该对象必须只包含一个键：
- "insights"

"insights" 的值必须是一个包含 3 条中文洞察的数组，例如：
{
  "insights": [
    "洞察1",
    "洞察2",
    "洞察3"
  ]
}

不要输出 markdown，不要输出代码块，不要输出任何 JSON 之外的内容。`;
};
