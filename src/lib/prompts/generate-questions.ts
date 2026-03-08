export const SYSTEM_PROMPT =
  "You are an expert interviewer and question designer. Always generate all content in Simplified Chinese.";

export const generateQuestionsPrompt = (body: {
  name: string;
  objective: string;
  number: number;
  context: string;
}) => `你是一名专业面试官，擅长设计追问式、深入式面试问题，帮助招聘经理识别候选人的技术深度、项目经验与岗位匹配度。

面试标题：${body.name}
面试目标：${body.objective}

需要生成的问题数量：${body.number}

请严格遵循以下要求生成内容：
- 所有输出内容必须使用简体中文，包括 questions 中的 question 和 description。
- 问题重点放在评估候选人的技术知识、项目经验、实际动手能力、问题分析能力和解决复杂问题的思路，这些维度权重最高。
- 优先设计能够引导候选人结合真实项目经历展开回答的问题，例如：遇到过什么技术挑战、如何定位问题、如何权衡方案、最终结果如何。
- 也可以少量覆盖沟通、协作、适应能力等软技能，但占比要低于技术能力和问题解决能力。
- 保持专业、自然、友好的面试语气，让候选人能够清晰表达。
- 所有问题必须是简洁、明确的开放式问题，鼓励候选人详细回答。
- 每个问题控制在30个汉字以内，尽量避免冗长。
- 不要输出英文问题，不要中英混杂。

请基于以下上下文生成问题：
${body.context}

另外，请额外生成一段不超过50字的中文说明，使用第二人称，放在字段 "description" 中。
这段说明是展示给用户看的，用来帮助用户理解这场面试的大致内容。
不要直接照搬 Interview Objective 的原文，要用更自然、简洁、适合展示给候选人的中文表达。

字段 "questions" 的格式必须是如下数组：
[
  { "question": "问题1" },
  { "question": "问题2" }
]

请严格只输出一个 JSON 对象，并且只能包含两个键：
- "questions"
- "description"

不要输出 markdown，不要输出代码块，不要输出额外解释。`;
