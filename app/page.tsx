'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

const features = [
  {
    title: "智能话题生成器",
    description: "基于对方兴趣，AI生成3个个性化破冰开场白",
    icon: "💬",
    href: "/generate",
    highlights: [
      "3种对话风格可选",
      "20+预设兴趣标签",
      "3-retry智能重试"
    ],
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "信心增强器",
    description: "评估你的开场白，给出发送成功率和优化建议",
    icon: "✨",
    href: "/confidence",
    highlights: [
      "混合评分算法",
      "4维度深度分析",
      "实时AI反馈"
    ],
    color: "from-pink-500 to-red-500"
  }
];

const painPoints = [
  {
    quote: "每次开场就是'你好'、'在吗'，感觉特别尴尬",
    author: "Reddit r/dating_advice 用户",
    emoji: "😅"
  },
  {
    quote: "想聊深入点的话题，但不知道怎么开头",
    author: "Reddit r/socialskills 用户",
    emoji: "🤔"
  },
  {
    quote: "总是担心第一句话说错，错过好的connection",
    author: "Reddit r/relationships 用户",
    emoji: "😰"
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-white mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            告别尴尬开场白
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-white/90">
            AI驱动的破冰助手，3秒生成个性化开场白 + 给你发送的勇气
          </p>
          <p className="text-lg text-white/80 mb-8">
            话题生成 × 信心评估 = 自信开启每一次对话
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
            >
              <Link href={feature.href}>
                <Card className={`p-8 bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all hover:scale-105 cursor-pointer h-full`}>
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {feature.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-700">
                        <span className="text-green-500 mr-2">✓</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                  <div className={`inline-block px-4 py-2 rounded-lg bg-gradient-to-r ${feature.color} text-white font-semibold`}>
                    立即体验 →
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Pain Points Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {painPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
            >
              <Card className="p-6 bg-white/95 backdrop-blur-sm hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{point.emoji}</div>
                <blockquote className="text-gray-700 italic mb-4">
                  "{point.quote}"
                </blockquote>
                <p className="text-sm text-gray-500">— {point.author}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16 mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8">
            简单三步，开启自信对话
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-white">
              <div className="text-4xl mb-4">1️⃣</div>
              <h3 className="text-xl font-semibold mb-2">选择兴趣</h3>
              <p className="text-white/80">
                输入对方的兴趣标签，支持20+预设选项或自定义
              </p>
            </div>
            <div className="text-white">
              <div className="text-4xl mb-4">2️⃣</div>
              <h3 className="text-xl font-semibold mb-2">AI生成</h3>
              <p className="text-white/80">
                3秒内获得3个个性化开场白，可选不同对话风格
              </p>
            </div>
            <div className="text-white">
              <div className="text-4xl mb-4">3️⃣</div>
              <h3 className="text-xl font-semibold mb-2">信心评估</h3>
              <p className="text-white/80">
                实时评分+优化建议，让你知道发送成功率有多高
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center text-white/70 text-sm mt-16 pt-8 border-t border-white/20"
        >
          <p className="mb-2">
            Built with ❤️ using{' '}
            <a
              href="https://claude.com/claude-code"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white"
            >
              Claude Code
            </a>
          </p>
          <p>
            <a
              href="https://github.com/JasonRobertDestiny/icebreak"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white"
            >
              GitHub
            </a>
            {' · '}
            <a
              href="mailto:johnrobertdestiny@gmail.com"
              className="underline hover:text-white"
            >
              Contact
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
