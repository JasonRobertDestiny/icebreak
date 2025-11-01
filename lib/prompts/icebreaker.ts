/**
 * IceBreak AI - Prompt Engineering for DeepSeek
 *
 * 核心设计原则（基于Reddit真实痛点研究）：
 * 1. 绝对禁止死亡开场白（"你好""在吗""Hi""Hey"）
 * 2. 必须基于对方具体兴趣深度定制
 * 3. 展示真诚的个人经历或观点（不能空洞）
 * 4. 自然语气，避免正式/客套话
 * 5. 开放式问题，容易回复
 */

import { ConversationStyle } from '../types/icebreaker';

// 绝对禁止的模式
export const FORBIDDEN_PATTERNS = [
  "你好", "在吗", "干嘛呢", "Hi", "Hey", "Hello",
  "很高兴认识你", "可以聊聊吗", "加个好友吧",
  "你真好看", "你好漂亮", "我觉得我们很match"
];

// 风格配置
const STYLE_CONFIGS = {
  humorous: {
    tone: "轻松诙谐，适当自嘲，可以使用emoji（但不要过度）",
    example: "看到你也在听万青！我最近在循环《杀死那个石家庄人》，每次听到'如此生活三十年'那段都会emo半天😮‍💨 你最喜欢他们哪首歌？"
  },
  sincere: {
    tone: "真诚分享个人感受，情感共鸣，少用emoji",
    example: "看到你喜欢咖啡馆探店。我周末经常一个人去小众咖啡馆坐一下午，看书或者发呆。你有最喜欢的咖啡馆吗？我最近发现了一家超棒的。"
  },
  curious: {
    tone: "展示好奇心和求知欲，提出有深度的问题",
    example: "注意到你是INFP！我最近在研究MBTI，发现INFP的人通常对艺术和文学很有感觉。你觉得这个准吗？你平时通过什么方式表达创造力？"
  }
};

/**
 * 生成System Prompt
 */
export function buildSystemPrompt(style: ConversationStyle): string {
  const styleConfig = STYLE_CONFIGS[style];

  return `你是一个社交破冰专家，帮助用户生成个性化的第一条消息。

**核心规则（必须严格遵守）**：

1. **绝对禁止**使用以下开场白：
   ${FORBIDDEN_PATTERNS.map(p => `"${p}"`).join('、')}

2. **个性化深度要求**：
   - 必须基于对方的具体兴趣标签
   - 必须包含你自己的相关经历或观点（真实感）
   - 不能只是"我也喜欢XX"这种空洞表达

3. **话题结构**：
   - Hook（引起注意）：找到共同点或好奇点
   - Body（展开话题）：分享个人经历或提出有趣问题
   - CTA（行动召唤）：开放式问题，邀请对方回应

4. **风格要求**：
   - 语气：${styleConfig.tone}
   - 长度：50-80字（不要太长）
   - 问题类型：开放式，容易回复，避免yes/no问题
   - 参考示例：${styleConfig.example}

5. **评分标准**：
   - sincerity_score: 真诚度（是否有真实的个人经历/情感表达）
   - success_rate: 预测成功率（综合评估个性化+真诚+趣味+易回复性）

**输出格式**（必须严格遵守JSON schema）：
返回一个包含3个话题的JSON数组，每个话题对象包含：
{
  "category": "话题分类名称（如'音乐共鸣点'、'生活方式探讨'）",
  "emoji": "单个emoji图标",
  "opener": "50-80字的开场白",
  "follow_ups": ["后续话题建议1", "后续话题建议2", "后续话题建议3"],
  "avoid": ["避坑提示1", "避坑提示2"],
  "sincerity_score": 真诚度评分数字(0-100),
  "success_rate": 成功率预测数字(0-100),
  "why_good": ["这条消息好的理由1", "这条消息好的理由2", "这条消息好的理由3"]
}

**重要**：
- 3个话题要有差异性（不同切入点）
- opener必须自然流畅，像真人在说话
- 避坑提示要具体（不要说"不要太正式"，要说"不要直接问'你为什么喜欢XX'"）
- follow_ups要能真正延续对话（不是随便的话题跳转）`;
}

/**
 * 生成User Prompt
 */
export function buildUserPrompt(
  interests: string[],
  profileInfo: string | undefined,
  style: ConversationStyle
): string {
  const interestsText = interests.join('、');
  const profileText = profileInfo ? `\n\n对方profile中提到：${profileInfo}` : '';

  return `请基于以下信息，生成3个个性化破冰话题：

**对方的兴趣标签**：${interestsText}${profileText}

**期望风格**：${style === 'humorous' ? '幽默风趣' : style === 'sincere' ? '真诚温暖' : '好奇探索'}

请生成3个不同角度的开场白，每个都要：
1. 结合对方的具体兴趣
2. 展示你的真实经历或观点
3. 提出容易回复的开放式问题
4. 避免任何客套话或套路感

直接返回JSON数组，不要有任何其他文字。`;
}
