# IceBreak AI - MVP

AI驱动的社交破冰话题生成器，告别尴尬开场白。

## 🚀 Quick Start

### 1. 环境配置

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.local.example .env.local
```

编辑 `.env.local`，填入真实的DeepSeek API Key:

```
DEEPSEEK_API_KEY=sk-your-actual-api-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. 运行开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 3. 测试DeepSeek API

访问 http://localhost:3000/api/test-deepseek 验证API连接。

## 📦 技术栈

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **AI API**: DeepSeek Chat (OpenAI-compatible)

## 🔑 获取DeepSeek API Key

1. 访问 https://platform.deepseek.com
2. 注册账号并充值
3. 创建API Key
4. 将Key填入 `.env.local`

## 🌐 部署到Vercel

### 方式1: 通过Vercel CLI

```bash
# 安装Vercel CLI
npm i -g vercel

# 部署
vercel
```

### 方式2: 通过Git连接

1. 推送代码到GitHub
2. 访问 https://vercel.com/new
3. 导入GitHub仓库
4. 配置环境变量 `DEEPSEEK_API_KEY`
5. 点击Deploy

## 📁 项目结构

```
icebreak-ai/
├── app/
│   ├── api/
│   │   └── test-deepseek/     # DeepSeek API测试路由
│   ├── page.tsx                # Landing Page
│   └── layout.tsx
├── components/
│   └── ui/                     # shadcn/ui组件
├── lib/
│   └── utils.ts
├── .env.local.example          # 环境变量模板
└── next.config.ts              # Next.js配置
```

## ✅ Day 1 完成状态

- [x] Next.js 15项目初始化
- [x] TypeScript + Tailwind CSS配置
- [x] shadcn/ui集成
- [x] Framer Motion安装
- [x] DeepSeek API测试路由
- [x] Landing Page (带Framer Motion动画)
- [ ] Vercel生产部署 (需手动操作)

## 🎯 核心功能 (Day 1)

### Landing Page
- 渐变紫-粉-红背景
- Hero section动画
- 3个用户痛点卡片 (基于Reddit真实引用)
- CTA按钮 "开始使用"
- 移动端响应式设计

### API配置
- DeepSeek API Base URL: https://newapi.deepwisdom.ai/v1
- Model: deepseek-chat
- OpenAI-compatible接口

## 📝 后续开发计划

- **Day 2**: 兴趣标签选择 + 话题生成API + 话题卡片UI
- **Day 3**: 置信度评分系统 (客户端+语义分析)
- **Day 4**: UI抛光 + 用户测试 + Bug修复
- **Day 5**: 文档 + 比赛材料 + Demo视频 + 最终提交

## 🐛 已知问题

- DeepSeek API需要真实API Key才能测试 (当前使用占位符)
- 需要配置Vercel环境变量进行生产部署

## 📞 联系方式

项目仓库: [GitHub链接]
Demo地址: [Vercel部署链接] (待部署)

---

**生成于**: 2025-11-01
**开发模式**: 5天MVP冲刺
