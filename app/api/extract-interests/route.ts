import { NextResponse } from 'next/server';

/**
 * 本地fallback：从profile文本中提取兴趣标签
 */
function extractInterestsLocally(profileText: string): string[] {
  const interests: string[] = [];
  const text = profileText.toLowerCase();

  // MBTI性格类型
  const mbtiPattern = /\b(intj|intp|entj|entp|infj|infp|enfj|enfp|istj|isfj|estj|esfj|istp|isfp|estp|esfp)\b/gi;
  const mbtiMatches = profileText.match(mbtiPattern);
  if (mbtiMatches) {
    interests.push(...mbtiMatches.map(m => m.toUpperCase()));
  }

  // 常见兴趣关键词库
  const interestKeywords = [
    // 音乐
    { keywords: ['独立音乐', '古典音乐', '爵士', '摇滚', '电子音乐', 'hiphop', 'hip-hop'], label: '音乐' },
    { keywords: ['吉他', '钢琴', '小提琴', '架子鼓'], label: '乐器' },

    // 阅读写作
    { keywords: ['村上春树', '东野圭吾', '加西亚·马尔克斯', '三体', '哈利波特'], label: '阅读' },
    { keywords: ['看书', '读书', '阅读'], label: '阅读' },
    { keywords: ['写作', '写小说', '博客'], label: '写作' },

    // 艺术
    { keywords: ['摄影', '拍照', '相机'], label: '摄影' },
    { keywords: ['绘画', '画画', '素描', '水彩'], label: '绘画' },
    { keywords: ['设计', '平面设计', 'ui设计'], label: '设计' },

    // 生活方式
    { keywords: ['咖啡', '咖啡馆', 'cafe', '精品咖啡'], label: '咖啡' },
    { keywords: ['茶', '茶艺', '品茶'], label: '茶艺' },
    { keywords: ['烘焙', '做甜点'], label: '烘焙' },
    { keywords: ['做饭', '烹饪', '美食'], label: '烹饪' },

    // 运动
    { keywords: ['健身', '撸铁', 'gym'], label: '健身' },
    { keywords: ['跑步', '马拉松', '晨跑'], label: '跑步' },
    { keywords: ['瑜伽'], label: '瑜伽' },
    { keywords: ['篮球', 'nba'], label: '篮球' },
    { keywords: ['足球'], label: '足球' },
    { keywords: ['游泳'], label: '游泳' },
    { keywords: ['滑板', '滑雪'], label: '板类运动' },
    { keywords: ['登山', '徒步', '爬山'], label: '登山' },

    // 旅行
    { keywords: ['旅行', '旅游', '环游'], label: '旅行' },
    { keywords: ['露营'], label: '露营' },

    // 科技
    { keywords: ['编程', '写代码', '程序员', 'developer', 'coding'], label: '编程' },
    { keywords: ['科技', '数码', '极客', 'geek'], label: '科技' },

    // 游戏
    { keywords: ['游戏', 'switch', 'ps5', 'steam'], label: '游戏' },
    { keywords: ['王者荣耀', '原神', '英雄联盟'], label: '手游' },

    // 影视
    { keywords: ['电影', '看电影', '影迷'], label: '电影' },
    { keywords: ['美剧', '日剧', '韩剧', '追剧'], label: '追剧' },
    { keywords: ['动漫', 'anime', '二次元'], label: '动漫' },

    // 其他
    { keywords: ['手工', 'diy'], label: '手工' },
    { keywords: ['宠物', '猫', '狗', '养猫', '养狗'], label: '宠物' },
    { keywords: ['心理学'], label: '心理学' },
    { keywords: ['哲学'], label: '哲学' },
    { keywords: ['投资', '理财', '股票'], label: '投资' },
  ];

  // 匹配关键词
  for (const group of interestKeywords) {
    for (const keyword of group.keywords) {
      if (text.includes(keyword)) {
        if (!interests.includes(group.label)) {
          interests.push(group.label);
        }
        break;
      }
    }
  }

  // 提取性格相关词汇
  const personalityWords = ['内向', '外向', '社恐', 'i人', 'e人'];
  for (const word of personalityWords) {
    if (text.includes(word) && !interests.some(i => i.includes(word))) {
      interests.push(word);
    }
  }

  // 限制最多5个
  return interests.slice(0, 5);
}

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

    let interests: string[] = [];
    let usedFallback = false;

    // 尝试调用DeepSeek API
    try {
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

      if (response.ok) {
        const data = await response.json();
        const aiResponse = data.choices[0]?.message?.content || '';

        // 解析AI返回的JSON数组
        try {
          interests = JSON.parse(aiResponse.trim());
        } catch {
          const matches = aiResponse.match(/"([^"]+)"/g);
          if (matches) {
            interests = matches.map((m: string) => m.replace(/"/g, ''));
          }
        }

        interests = interests.slice(0, 5);
      } else {
        throw new Error('API调用失败');
      }
    } catch (apiError: any) {
      // API失败，使用本地fallback
      console.log('DeepSeek API失败，使用本地提取:', apiError.message);
      interests = extractInterestsLocally(profileText);
      usedFallback = true;
    }

    if (interests.length === 0) {
      return NextResponse.json(
        { success: false, error: '无法从profile中提取兴趣标签，请手动输入' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      interests,
      method: usedFallback ? 'local' : 'ai',
      usage: usedFallback ? undefined : {
        input_tokens: 0,
        output_tokens: 0
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
