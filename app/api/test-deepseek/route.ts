import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const client = new OpenAI({
  baseURL: process.env.DEEPSEEK_API_BASE || 'https://newapi.deepwisdom.ai/v1',
  apiKey: process.env.DEEPSEEK_API_KEY
});

export async function GET() {
  try {
    const response = await client.chat.completions.create({
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
