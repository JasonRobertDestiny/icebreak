import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { calculateClientScore, ClientScoreResult } from '@/lib/scoring/client-rules';
import {
  buildSemanticScoreSystemPrompt,
  buildSemanticScoreUserPrompt,
  parseSemanticScoreResponse,
  SemanticScoreRequest,
  SemanticScoreResponse
} from '@/lib/prompts/confidence';

const client = new OpenAI({
  baseURL: process.env.DEEPSEEK_API_BASE || 'https://newapi.deepwisdom.ai/v1',
  apiKey: process.env.DEEPSEEK_API_KEY
});

// 请求体类型
interface ConfidenceScoreRequestBody {
  message: string;
  targetInterests?: string[];
  targetProfile?: string;
  mode?: 'client-only' | 'full'; // client-only: 仅客户端评分, full: 混合评分
}

// 响应类型
export interface ConfidenceScoreResponse {
  mode: 'client-only' | 'full';
  clientScore: ClientScoreResult;
  semanticScore?: SemanticScoreResponse;
  finalScore: number;  // 综合评分 0-100
  confidence: 'low' | 'medium' | 'high' | 'very-high';  // 信心等级
  recommendation: string;  // 总体建议
}

/**
 * 计算信心等级
 */
function calculateConfidenceLevel(score: number): 'low' | 'medium' | 'high' | 'very-high' {
  if (score >= 85) return 'very-high';
  if (score >= 70) return 'high';
  if (score >= 50) return 'medium';
  return 'low';
}

/**
 * 生成总体建议
 */
function generateRecommendation(
  clientScore: ClientScoreResult,
  semanticScore?: SemanticScoreResponse
): string {
  const finalScore = semanticScore
    ? Math.round(clientScore.totalScore * 0.3 + semanticScore.successRate * 0.7)
    : clientScore.totalScore;

  if (finalScore >= 85) {
    return '这个开场白很棒！真诚、有创意且切中对方兴趣点。发送吧！';
  } else if (finalScore >= 70) {
    return '不错的开场白！可以发送，也可以参考建议进一步优化。';
  } else if (finalScore >= 50) {
    return '开场白可用，但建议参考反馈优化后再发送，成功率会更高。';
  } else {
    return '建议重新思考开场白。试着分享真实感受，或提出有深度的问题。';
  }
}

/**
 * 调用DeepSeek进行语义评分
 */
async function getSemanticScore(request: SemanticScoreRequest): Promise<SemanticScoreResponse> {
  const systemPrompt = buildSemanticScoreSystemPrompt();
  const userPrompt = buildSemanticScoreUserPrompt(request);

  try {
    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,  // 降低温度以获得更稳定的评分
      max_tokens: 800,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('Empty response from DeepSeek');
    }

    return parseSemanticScoreResponse(content);
  } catch (error) {
    console.error('Semantic scoring failed:', error);
    throw error;
  }
}

/**
 * POST /api/confidence-score
 * 评估用户输入的开场白的信心分数
 */
export async function POST(request: NextRequest) {
  try {
    const body: ConfidenceScoreRequestBody = await request.json();
    const { message, targetInterests, targetProfile, mode = 'full' } = body;

    // 验证输入
    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (message.length > 500) {
      return NextResponse.json(
        { error: 'Message too long (max 500 characters)' },
        { status: 400 }
      );
    }

    // 1. 客户端评分（必选，快速反馈）
    const clientScore = calculateClientScore(message);

    // 2. 语义评分（可选，需要API调用）
    let semanticScore: SemanticScoreResponse | undefined;
    if (mode === 'full') {
      try {
        semanticScore = await getSemanticScore({
          message,
          targetInterests,
          targetProfile
        });
      } catch (error) {
        console.error('Semantic scoring failed, falling back to client-only:', error);
        // 降级到client-only模式
      }
    }

    // 3. 计算最终分数
    // 如果有语义评分：客户端30% + 语义成功率70%
    // 如果无语义评分：客户端100%
    const finalScore = semanticScore
      ? Math.round(clientScore.totalScore * 0.3 + semanticScore.successRate * 0.7)
      : clientScore.totalScore;

    // 4. 生成响应
    const confidence = calculateConfidenceLevel(finalScore);
    const recommendation = generateRecommendation(clientScore, semanticScore);

    const response: ConfidenceScoreResponse = {
      mode: semanticScore ? 'full' : 'client-only',
      clientScore,
      semanticScore,
      finalScore,
      confidence,
      recommendation
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Confidence score API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to calculate confidence score',
        details: error.message
      },
      { status: 500 }
    );
  }
}
