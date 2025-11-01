import OpenAI from 'openai';
import { NextResponse } from 'next/server';

// 延迟初始化OpenAI客户端，避免构建时报错
let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({
      baseURL: process.env.DEEPSEEK_API_BASE || 'https://newapi.deepwisdom.ai/v1',
      apiKey: process.env.DEEPSEEK_API_KEY
    });
  }
  return client;
}

export async function GET() {
  try {
    const response = await getClient().chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: 'Say hello in Chinese' }],
      max_tokens: 100
    });

    return NextResponse.json({
      success: true,
      message: response.choices[0].message.content,
      usage: response.usage
    });
  } catch (error: any) {
    console.error('DeepSeek API Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error occurred'
    }, { status: 500 });
  }
}
