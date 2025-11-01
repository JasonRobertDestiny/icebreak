/**
 * 客户端评分规则 - 快速regex检测（<50ms）
 * 用于实时反馈，无需API调用
 */

// 禁用词模式（直接降低信心分）
export const FORBIDDEN_PATTERNS = [
  // 无效开场白
  /^(你好|在吗|干嘛呢|hi|hey|hello)[\s!！?？。.]*$/i,
  /^(很高兴认识你|可以聊聊吗|加个好友吧)[\s!！?？。.]*$/i,

  // 过度赞美（缺乏具体性）
  /你(真|好|很)(好看|漂亮|帅|美)/i,
  /我觉得(我们|你我)很?match/i,

  // 低质量疑问
  /^(有空吗|在干嘛|睡了吗|忙吗)[\s?？]*$/i,

  // 过于直接的邀约
  /^(约吗|见面吧|出来玩)[\s?？!！]*$/i,
];

// 低质量模式（轻微扣分）
export const LOW_QUALITY_PATTERNS = [
  // 过多emoji（>3个）
  /([\u{1F300}-\u{1F9FF}].*){4,}/u,

  // 全大写（超过5个连续字符）
  /[A-Z]{6,}/,

  // 重复字符（如"哈哈哈哈哈哈"）
  /(.)\1{5,}/,

  // 过多标点
  /[!！?？。.]{3,}/,
];

// 积极模式（加分）
export const POSITIVE_PATTERNS = [
  // 包含具体兴趣点
  /看到你(也|喜欢|在听|关注).*\S+/,

  // 分享个人经历
  /(我|自己)(曾经|最近|之前|也).*[，,]/,

  // 提出有深度的问题
  /你(觉得|认为|怎么看|如何理解).*[?？]/,

  // 展示好奇心
  /(想知道|好奇|请教|了解一下).*[?？]/,
];

/**
 * 字符长度评分
 */
export function scoreMsgLength(text: string): number {
  const length = text.trim().length;

  if (length < 10) return 0;      // 太短，无意义
  if (length < 20) return 30;     // 偏短
  if (length < 50) return 60;     // 合适
  if (length < 100) return 80;    // 较好
  if (length < 200) return 70;    // 稍长但可接受
  return 50;                      // 过长，可能吓跑对方
}

/**
 * 模式匹配评分
 */
export function scorePatternMatch(text: string): {
  score: number;
  violations: string[];
  positives: string[];
} {
  let score = 50;  // 基础分
  const violations: string[] = [];
  const positives: string[] = [];

  // 检测禁用词（每个-30分）
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(text)) {
      score -= 30;
      violations.push(`使用了禁用开场白或低质量模式`);
    }
  }

  // 检测低质量模式（每个-15分）
  for (const pattern of LOW_QUALITY_PATTERNS) {
    if (pattern.test(text)) {
      score -= 15;
      violations.push(`包含低质量元素（过多emoji/标点/重复）`);
    }
  }

  // 检测积极模式（每个+20分）
  for (const pattern of POSITIVE_PATTERNS) {
    if (pattern.test(text)) {
      score += 20;
      positives.push(`展示了真诚/好奇/个性化`);
    }
  }

  // 限制分数范围 0-100
  score = Math.max(0, Math.min(100, score));

  return { score, violations, positives };
}

/**
 * 完整客户端评分（综合长度+模式）
 */
export interface ClientScoreResult {
  totalScore: number;      // 总分 0-100
  lengthScore: number;     // 长度评分
  patternScore: number;    // 模式评分
  violations: string[];    // 违规项
  positives: string[];     // 加分项
  feedback: string;        // 反馈文案
}

export function calculateClientScore(message: string): ClientScoreResult {
  const lengthScore = scoreMsgLength(message);
  const { score: patternScore, violations, positives } = scorePatternMatch(message);

  // 综合评分（长度40% + 模式60%）
  const totalScore = Math.round(lengthScore * 0.4 + patternScore * 0.6);

  // 生成反馈文案
  let feedback = '';
  if (totalScore >= 80) {
    feedback = '这个开场白很有个性！真诚且有趣。';
  } else if (totalScore >= 60) {
    feedback = '不错的开场白，可以试试加入更多个人经历。';
  } else if (totalScore >= 40) {
    feedback = '开场白偏普通，建议结合对方兴趣点具体化。';
  } else {
    feedback = '建议避免无效开场白，多展示真诚和好奇心。';
  }

  return {
    totalScore,
    lengthScore,
    patternScore,
    violations,
    positives,
    feedback
  };
}
