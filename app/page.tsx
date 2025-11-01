'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

const advancedFeatures = [
  {
    title: "话题生成器",
    description: "单独生成破冰话题",
    icon: "💬",
    href: "/generate",
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "信心评估器",
    description: "单独评估开场白",
    icon: "✨",
    href: "/confidence",
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
          className="text-center text-white mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            告别尴尬开场白
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            像和朋友聊天一样，AI一步步帮你搞定开场白
          </p>
          <Link href="/chat">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 text-xl px-12 py-8 shadow-2xl hover:scale-105 transition-transform"
            >
              开始对话 →
            </Button>
          </Link>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <Card className="p-8 bg-white/95 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              对话式体验，简单三步
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">告诉AI对方的兴趣</h3>
                  <p className="text-gray-600 text-sm">独立音乐、咖啡馆、INFP...想到什么说什么</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">AI生成3个开场白，你选一个</h3>
                  <p className="text-gray-600 text-sm">AI自动评估成功率，分数低会主动帮你优化</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">复制并发送，搞定！</h3>
                  <p className="text-gray-600 text-sm">整个过程30秒，AI会一直鼓励你</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

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

        {/* Advanced Mode */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-white/70 text-sm mb-4">需要更多控制？</p>
          <div className="flex gap-4 justify-center">
            {advancedFeatures.map((feature) => (
              <Link key={feature.title} href={feature.href}>
                <Button
                  variant="outline"
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                >
                  {feature.icon} {feature.title}
                </Button>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center text-white/70 text-sm mt-16 pt-8 border-t border-white/20"
        >
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
