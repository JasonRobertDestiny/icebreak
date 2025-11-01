/**
 * 信心评分 - 语义分析Prompt工程
 * 用于DeepSeek API评估消息的真诚度、创意性、成功率
 */

export interface SemanticScoreRequest {
  message: string;           // 用户输入的开场白
  targetInterests?: string[]; // 对方兴趣标签（可选）
  targetProfile?: string;    // 对方简介（可选）
}

export interface SemanticScoreResponse {
  sincerity: number;         // 真诚度 0-100
  creativity: number;        // 创意性 0-100
  relevance: number;         // 相关性 0-100（与对方兴趣匹配度）
  successRate: number;       // 预估成功率 0-100
  feedback: string[];        // 改进建议
  strengths: string[];       // 优点
}

/**
 * 构建语义评分的System Prompt
 */
export function buildSemanticScoreSystemPrompt(): string {
  return `你是一位资深社交破冰专家，擅长评估陌生人社交场景中的开场白质量。

**评估维度**：
1. **真诚度 (Sincerity)**：是否展示真实的自我，避免套路化表达
2. **创意性 (Creativity)**：是否有个性化的表达，避免千篇一律
3. **相关性 (Relevance)**：是否基于对方兴趣/资料，展示genuine interest
4. **成功率 (Success Rate)**：对方回复的概率（综合以上三个维度）

**评分标准**：
- **90-100分**：极具个性，真诚分享，精准切入对方兴趣点
- **70-89分**：有一定个性，展示好奇心，基本相关
- **50-69分**：中规中矩，无明显亮点但也无禁忌
- **30-49分**：略显套路，缺乏具体性
- **0-29分**：无效开场白，纯套路或冒犯性

**严格禁止的开场白特征**（直接<30分）：
- 无效问候："你好"、"在吗"、"干嘛呢"
- 空洞赞美："你好漂亮"、"我们很match"
- 低质疑问："有空吗"、"睡了吗"

**高分开场白特征**（>80分）：
- 分享个人真实经历/感受
- 提出有深度的问题
- 精准关联对方兴趣点
- 展示vulnerability（适度自嘲/坦诚）

你必须以JSON格式返回评估结果，不要有任何其他文字。`;
}

/**
 * 构建语义评分的User Prompt
 */
export function buildSemanticScoreUserPrompt(request: SemanticScoreRequest): string {
  const { message, targetInterests, targetProfile } = request;

  let prompt = `请评估以下开场白的质量：\n\n`;
  prompt += `**开场白内容**：\n${message}\n\n`;

  if (targetInterests && targetInterests.length > 0) {
    prompt += `**对方兴趣标签**：${targetInterests.join('、')}\n\n`;
  }

  if (targetProfile) {
    prompt += `**对方简介**：${targetProfile}\n\n`;
  }

  prompt += `请返回JSON格式评估，包含以下字段：
{
  "sincerity": <0-100>,
  "creativity": <0-100>,
  "relevance": <0-100>,
  "successRate": <0-100>,
  "feedback": ["改进建议1", "改进建议2", ...],
  "strengths": ["优点1", "优点2", ...]
}`;

  return prompt;
}

/**
 * 解析DeepSeek返回的语义评分
 */
export function parseSemanticScoreResponse(jsonString: string): SemanticScoreResponse {
  try {
    const parsed = JSON.parse(jsonString);

    // 验证必需字段
    if (
      typeof parsed.sincerity !== 'number' ||
      typeof parsed.creativity !== 'number' ||
      typeof parsed.relevance !== 'number' ||
      typeof parsed.successRate !== 'number'
    ) {
      throw new Error('Missing required numeric fields');
    }

    // 确保分数在0-100范围
    const clamp = (val: number) => Math.max(0, Math.min(100, val));

    return {
      sincerity: clamp(parsed.sincerity),
      creativity: clamp(parsed.creativity),
      relevance: clamp(parsed.relevance),
      successRate: clamp(parsed.successRate),
      feedback: Array.isArray(parsed.feedback) ? parsed.feedback : [],
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : []
    };
  } catch (error) {
    throw new Error(`Failed to parse semantic score response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
