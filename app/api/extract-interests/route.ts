import { NextResponse } from 'next/server';

/**
 * 从profile文本中提取兴趣标签
 */
export async function POST(request: Request) {
  try {
    const { profileText } = await request.json();

    if (!profileText || typeof profileText !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Profile文本不能为空' },
        { status: 400 }
      );
    }

    // 调用DeepSeek提取兴趣
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `你是一个兴趣标签提取助手。从用户提供的profile文本中，提取出3-5个核心兴趣标签。

要求：
1. 标签要简洁（2-6个字）
2. 优先提取具体的兴趣，如"独立音乐"、"咖啡馆"、"摄影"等
3. 也可以提取性格标签，如"INFP"、"内向"等
4. 最多5个标签
5. 直接以JSON数组格式返回，格式：["标签1", "标签2", "标签3"]
6. 不要有任何额外的解释文字`
          },
          {
            role: 'user',
            content: `请从以下profile中提取兴趣标签：\n\n${profileText}`
          }
        ],
        temperature: 0.3,
        max_tokens: 100
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`DeepSeek API调用失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || '';

    // 解析AI返回的JSON数组
    let interests: string[] = [];
    try {
      // 尝试直接解析JSON
      interests = JSON.parse(aiResponse.trim());
    } catch {
      // 如果解析失败，尝试提取引号中的内容
      const matches = aiResponse.match(/"([^"]+)"/g);
      if (matches) {
        interests = matches.map((m: string) => m.replace(/"/g, ''));
      }
    }

    // 限制最多5个
    interests = interests.slice(0, 5);

    if (interests.length === 0) {
      return NextResponse.json(
        { success: false, error: '无法从profile中提取兴趣标签，请手动输入' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      interests,
      usage: {
        input_tokens: data.usage?.prompt_tokens || 0,
        output_tokens: data.usage?.completion_tokens || 0
      }
    });

  } catch (error: any) {
    console.error('提取兴趣失败:', error);
    return NextResponse.json(
      { success: false, error: error.message || '提取失败，请重试' },
      { status: 500 }
    );
  }
}
