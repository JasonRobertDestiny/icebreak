# IceBreak AI - 破冰助手 ✨

AI驱动的社交破冰话题生成器 | 3秒生成个性化开场白 + 给你发送的勇气

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![DeepSeek](https://img.shields.io/badge/AI-DeepSeek-purple)](https://deepseek.com/)

---

## 📖 项目简介

**IceBreak AI**是一款专为社交焦虑者设计的AI破冰助手，通过深度学习生成个性化开场白，并实时评估发送成功率，帮助用户建立真诚、有趣的对话连接。

### 核心功能

#### 🎯 智能话题生成器
- **3种对话风格**：幽默诙谐、真诚分享、好奇探索
- **20个预设兴趣标签**：独立音乐、咖啡馆、INFP、健身、旅行...
- **3-retry指数退避**：1s/2s/4s智能重试，确保成功率
- **实时评分**：成功率 + 真诚度双维度评估

#### 💪 信心增强器
- **混合评分算法**：
  - 客户端快速评分（<50ms）：regex禁用词检测
  - 服务端语义分析（~2s）：DeepSeek深度理解
  - 综合评分：客户端30% + 语义70%
- **4维度评估**：真诚度、创意性、相关性、成功率
- **实时反馈**：Spring Physics动画计数器
- **4档信心等级**：very-high 🎯 / high ✨ / medium 💭 / low 🤔

---

## 🚀 快速开始

### 环境要求

- **Node.js**: ≥18.17.0
- **npm**: ≥9.0.0

### 本地开发

```bash
# 1. 克隆项目
git clone https://github.com/JasonRobertDestiny/icebreak.git
cd icebreak

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local，添加 DEEPSEEK_API_KEY

# 4. 启动开发服务器
npm run dev

# 5. 访问应用
# 打开 http://localhost:3000
```

### 生产构建

```bash
# 构建
npm run build

# 启动生产服务器
npm start
```

---

## 🎨 技术栈

### 前端框架
- **Next.js 16.0** - React全栈框架（App Router）
- **TypeScript 5.0** - 类型安全
- **Tailwind CSS** - 实用优先CSS框架
- **shadcn/ui** - 组件库（基于Radix UI）

### 动画与交互
- **Framer Motion** - 声明式动画库
- **Sonner** - Toast通知组件

### AI集成
- **DeepSeek API** - 大语言模型（OpenAI兼容）
- **OpenAI SDK** - API客户端

### 数据存储
- **LocalStorage** - 客户端历史记录（MVP阶段）

### 开发工具
- **ESLint** - 代码检查
- **Prettier** - 代码格式化（隐式）

---

## 📦 项目结构

```
icebreak/
├── app/                          # Next.js App Router
│   ├── api/                      # API路由
│   │   ├── generate-icebreaker/  # 话题生成API
│   │   ├── confidence-score/     # 信心评分API
│   │   └── test-deepseek/        # API测试
│   ├── generate/                 # 话题生成页面
│   ├── confidence/               # 信心增强器页面
│   ├── layout.tsx                # 全局布局
│   └── page.tsx                  # 首页
│
├── components/                   # React组件
│   ├── icebreaker/               # 破冰话题组件
│   ├── confidence/               # 信心评估组件
│   ├── layout/                   # 布局组件
│   └── ui/                       # 基础UI组件
│
├── lib/                          # 工具库
│   ├── types/                    # TypeScript类型定义
│   ├── prompts/                  # AI Prompt工程
│   ├── scoring/                  # 评分算法
│   ├── storage/                  # 数据存储
│   └── utils.ts                  # 通用工具函数
│
├── hooks/                        # React Hooks
│   └── useHistory.ts             # 历史记录Hook
│
└── public/                       # 静态资源
```

---

## 🎯 核心功能详解

### 1. 智能话题生成

**工作流程**:
```
用户输入
  → 选择兴趣标签（最多5个）
  → 选择对话风格
  → 点击"生成破冰话题"
  → API调用（3-retry）
  → 返回3个个性化话题
  → 自动保存到LocalStorage
```

### 2. 信心增强器

**双层评分**:
```
客户端评分 (<50ms)
  ├── 长度评分（40%）: 10-200字最优
  └── 模式评分（60%）: 禁用词-30，积极模式+20

服务端评分 (~2s)
  ├── 真诚度: 是否展示真实自我
  ├── 创意性: 是否有个性化表达
  ├── 相关性: 是否基于对方兴趣
  └── 成功率: 综合评估回复概率

最终分数 = 客户端30% + 服务端成功率70%
```

### 3. 历史记录系统

**LocalStorage设计**:
- **话题生成历史**：最多50条
- **信心评分历史**：最多50条
- **统计数据**：总次数、平均分、风格分布

---

## 🔧 配置说明

### 环境变量

创建 `.env.local` 文件：

```bash
# DeepSeek API配置
DEEPSEEK_API_KEY=your_api_key_here
DEEPSEEK_API_BASE=https://newapi.deepwisdom.ai/v1  # 可选

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000  # 可选
```

### Vercel部署

1. Fork本项目到你的GitHub
2. 在Vercel中导入项目
3. 配置环境变量：`DEEPSEEK_API_KEY`
4. 点击Deploy

详见 [VERCEL_ENV_SETUP.md](./VERCEL_ENV_SETUP.md)

---

## 📊 性能指标

| 指标 | 目标 | 实际 |
|------|------|------|
| 首页加载 | <1s | ~800ms |
| API响应 | <3s | 1.5-2.5s |
| 客户端评分 | <50ms | ~10ms |
| 页面过渡动画 | 60fps | 60fps |

---

## 🧪 测试

### API测试

```bash
# 测试DeepSeek连接
curl http://localhost:3000/api/test-deepseek

# 测试话题生成
curl -X POST http://localhost:3000/api/generate-icebreaker \
  -H "Content-Type: application/json" \
  -d '{"interests": ["独立音乐"], "style": "sincere"}'

# 测试信心评分
curl -X POST http://localhost:3000/api/confidence-score \
  -H "Content-Type: application/json" \
  -d '{"message": "看到你也在听万青...", "mode": "full"}'
```

---

## 📝 许可证

本项目采用 [MIT License](./LICENSE) 开源。

---

## 📧 联系方式

- **项目主页**: https://github.com/JasonRobertDestiny/icebreak
- **问题反馈**: https://github.com/JasonRobertDestiny/icebreak/issues
- **Email**: johnrobertdestiny@gmail.com

---

## 🎓 致谢

- **Next.js团队** - 提供强大的全栈框架
- **DeepSeek** - 提供高质量的大语言模型
- **shadcn** - 提供优雅的UI组件库
- **Framer团队** - 提供流畅的动画库

---

## 📅 开发日志

- **Day 1**: 项目初始化 + Landing Page
- **Day 2**: 核心话题生成功能
- **Day 3**: 信心增强器完整实现
- **Day 4**: UI优化 + LocalStorage历史记录
- **Day 5**: 文档完善 + 部署优化

详见 [开发日志](./.claude/)

---

**Built with ❤️ using Claude Code**

🤖 Generated with Claude Code · Co-Authored-By: Claude <noreply@anthropic.com>
