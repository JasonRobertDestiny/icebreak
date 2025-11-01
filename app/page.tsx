'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

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
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            AI驱动的破冰话题生成器，让每次对话都精彩开始
          </p>
          <Link href="/generate">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6"
            >
              开始使用 →
            </Button>
          </Link>
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

        {/* Feature Highlight */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16 text-white"
        >
          <h2 className="text-3xl font-semibold mb-4">
            基于你的兴趣，生成个性化破冰话题
          </h2>
          <p className="text-lg text-white/80">
            选择兴趣标签 → 获取3个高质量开场白 → 自信开启对话
          </p>
        </motion.div>
      </div>
    </div>
  );
}
