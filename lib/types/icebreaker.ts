/**
 * IceBreak AI - 核心类型定义
 */

export type ConversationStyle = 'humorous' | 'sincere' | 'curious';

export interface IcebreakerTopic {
  category: string;           // 话题分类，如"音乐共鸣点"
  emoji: string;              // 单个emoji图标
  opener: string;             // 开场白，50-80字
  follow_ups: string[];       // 2-3个后续话题建议
  avoid: string[];            // 1-2个避坑提示
  sincerity_score: number;    // 真诚度评分 0-100
  success_rate: number;       // 预测成功率 0-100
  why_good: string[];         // 为什么这条好，2-3点解释
}

export interface GenerateRequest {
  interests: string[];        // 对方兴趣标签，最多5个
  profileInfo?: string;       // 对方profile关键信息（可选）
  style: ConversationStyle;   // 对话风格
}

export interface GenerateResponse {
  success: boolean;
  topics?: IcebreakerTopic[]; // 生成3个话题
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
  error?: string;
}
