import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompts/icebreaker';
import { GenerateRequest, GenerateResponse, IcebreakerTopic } from '@/lib/types/icebreaker';

const client = new OpenAI({
  baseURL: process.env.DEEPSEEK_API_BASE || 'https://newapi.deepwisdom.ai/v1',
  apiKey: process.env.DEEPSEEK_API_KEY
});

// 3-retry指数退避配置
const RETRY_DELAYS = [1000, 2000, 4000]; // 1s, 2s, 4s
const REQUEST_TIMEOUT = 30000; // 30秒超时

/**
 * 延迟函数
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 带重试的DeepSeek API调用
 */
async function callDeepSeekWithRetry(
  systemPrompt: string,
  userPrompt: string,
  retries = 3
): Promise<{ content: string; usage: any }> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await client.chat.completions.create({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8, // 创意性
        max_tokens: 1500,
        response_format: { type: 'json_object' } // 强制JSON输出
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('Empty response from DeepSeek');
      }

      return {
        content,
        usage: response.usage
      };
    } catch (error: any) {
      lastError = error;
      console.error(`DeepSeek API attempt ${attempt + 1} failed:`, error.message);

      // 如果还有重试机会，等待后重试
      if (attempt < retries - 1) {
        await delay(RETRY_DELAYS[attempt]);
      }
    }
  }

  throw lastError || new Error('Failed to call DeepSeek API after retries');
}

/**
 * 验证和解析DeepSeek返回的JSON
 */
function parseAndValidateTopics(jsonString: string): IcebreakerTopic[] {
  try {
    console.log('DeepSeek raw response:', jsonString);
    const parsed = JSON.parse(jsonString);
    console.log('Parsed JSON:', JSON.stringify(parsed, null, 2));

    // 支持多种返回格式
    let topics: any[];
    if (Array.isArray(parsed)) {
      topics = parsed;
    } else if (parsed.topics && Array.isArray(parsed.topics)) {
      topics = parsed.topics;
    } else if (parsed.data && Array.isArray(parsed.data)) {
      topics = parsed.data;
    } else {
      // 如果是单个对象，尝试提取数组字段
      const possibleArrayFields = Object.keys(parsed).filter(key => Array.isArray(parsed[key]));
      if (possibleArrayFields.length > 0) {
        topics = parsed[possibleArrayFields[0]];
      } else {
        console.error('Cannot find topics array in response:', parsed);
        throw new Error('Invalid response format');
      }
    }

    if (!Array.isArray(topics) || topics.length === 0) {
      throw new Error('Invalid topics array');
    }

    console.log(`Found ${topics.length} topics`);

    // 验证每个topic的必需字段
    topics.forEach((topic, index) => {
      const required = ['category', 'emoji', 'opener', 'follow_ups', 'avoid', 'why_good'];
      required.forEach(field => {
        if (!(field in topic)) {
          console.error(`Topic ${index} missing field: ${field}`, topic);
          throw new Error(`Topic ${index} missing field: ${field}`);
        }
      });

      // 确保评分在合理范围内
      if (typeof topic.sincerity_score !== 'number' || topic.sincerity_score < 0 || topic.sincerity_score > 100) {
        topic.sincerity_score = 85; // 默认值
      }
      if (typeof topic.success_rate !== 'number' || topic.success_rate < 0 || topic.success_rate > 100) {
        topic.success_rate = 80; // 默认值
      }
    });

    return topics.slice(0, 3); // 确保只返回3个
  } catch (error: any) {
    console.error('Failed to parse DeepSeek response:', error);
    console.error('Raw string was:', jsonString);
    throw new Error(`Invalid JSON response: ${error.message}`);
  }
}

/**
 * POST /api/generate-icebreaker
 * 生成3个个性化破冰话题
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 解析请求体
    const body: GenerateRequest = await request.json();
    const { interests, profileInfo, style } = body;

    // 2. 输入验证
    if (!interests || !Array.isArray(interests) || interests.length === 0) {
      return NextResponse.json(
        { success: false, error: '请至少选择一个兴趣标签' },
        { status: 400 }
      );
    }

    if (interests.length > 5) {
      return NextResponse.json(
        { success: false, error: '最多选择5个兴趣标签' },
        { status: 400 }
      );
    }

    if (!style || !['humorous', 'sincere', 'curious'].includes(style)) {
      return NextResponse.json(
        { success: false, error: '无效的对话风格' },
        { status: 400 }
      );
    }

    // 3. 构建Prompts
    const systemPrompt = buildSystemPrompt(style);
    const userPrompt = buildUserPrompt(interests, profileInfo, style);

    // 4. 调用DeepSeek API（带3-retry）
    const { content, usage } = await callDeepSeekWithRetry(systemPrompt, userPrompt);

    // 5. 解析和验证返回结果
    const topics = parseAndValidateTopics(content);

    // 6. 返回成功响应
    const response: GenerateResponse = {
      success: true,
      topics,
      usage: {
        input_tokens: usage?.prompt_tokens || 0,
        output_tokens: usage?.completion_tokens || 0
      }
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Generate icebreaker error:', error);

    // 友好的错误信息
    let errorMessage = 'AI生成失败，请稍后重试';

    if (error.message?.includes('timeout')) {
      errorMessage = '请求超时，请检查网络连接后重试';
    } else if (error.message?.includes('API key')) {
      errorMessage = 'API配置错误，请联系管理员';
    } else if (error.message?.includes('rate limit')) {
      errorMessage = '请求过于频繁，请稍后再试';
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
