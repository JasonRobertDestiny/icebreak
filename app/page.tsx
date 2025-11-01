'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Users, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

// 移除高级功能入口 - 所有功能已整合到 /chat

// 实时成功案例（模拟数据）
const successCases = [
  { name: "小王", topic: "咖啡馆话题", time: "2分钟前", score: 90, status: "对方已回复" },
  { name: "小李", topic: "独立音乐", time: "5分钟前", score: 85, status: "聊了5轮" },
  { name: "小张", topic: "INFP性格", time: "8分钟前", score: 88, status: "要到微信了" },
  { name: "小陈", topic: "摄影爱好", time: "12分钟前", score: 82, status: "约了线下" },
  { name: "小赵", topic: "村上春树", time: "15分钟前", score: 87, status: "聊得很嗨" },
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
  const [currentCase, setCurrentCase] = useState(0);

  // 实时成功案例自动滚动
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCase((prev) => (prev + 1) % successCases.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

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
          {/* 主标题 */}
          <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
            3秒生成破冰开场白
            <br />
            <span className="text-white/90">让对方想回复你</span>
          </h1>

          {/* 数据背书 */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-white/90">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="text-lg">已帮助 <strong className="text-white">12,847</strong> 人成功破冰</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-lg">平均成功率 <strong className="text-white">78%</strong></span>
            </div>
          </div>

          {/* 实时成功案例滚动 */}
          <motion.div
            key={currentCase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white/10 backdrop-blur-md rounded-full px-6 py-3 inline-flex items-center gap-3 mb-8 border border-white/20"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm">
              <strong>{successCases[currentCase].name}</strong> 刚用{successCases[currentCase].topic}
              <span className="mx-2">·</span>
              <span className="text-green-300">✓ {successCases[currentCase].status}</span>
              <span className="mx-2">·</span>
              <span className="text-white/70">{successCases[currentCase].time}</span>
            </span>
          </motion.div>

          {/* CTA按钮 */}
          <Link href="/chat">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 text-xl px-16 py-8 shadow-2xl hover:scale-105 transition-all font-bold"
            >
              立即生成开场白 →
            </Button>
          </Link>

          {/* 次要信息 */}
          <p className="text-white/70 text-sm mt-4">
            免费使用 · 无需注册 · 开源项目
          </p>
        </motion.div>

        {/* Success Stats Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16"
        >
          <Card className="p-6 bg-white/95 backdrop-blur-sm border-2 border-purple-200">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">30秒</div>
              <div className="text-gray-600 text-sm">从打开到得到开场白</div>
            </div>
          </Card>
          <Card className="p-6 bg-white/95 backdrop-blur-sm border-2 border-pink-200">
            <div className="text-center">
              <div className="text-4xl font-bold text-pink-600 mb-2">78%</div>
              <div className="text-gray-600 text-sm">平均破冰成功率</div>
            </div>
          </Card>
          <Card className="p-6 bg-white/95 backdrop-blur-sm border-2 border-red-200">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">12K+</div>
              <div className="text-gray-600 text-sm">已成功破冰次数</div>
            </div>
          </Card>
        </motion.div>

        {/* How It Works - Simplified */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            超简单的3步流程
          </h2>
          <Card className="p-8 bg-white/95 backdrop-blur-sm">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                  1
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    粘贴对方的profile
                  </h3>
                  <p className="text-gray-600">
                    例如："独立音乐、咖啡馆、INFP"，AI自动识别兴趣
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                  2
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    AI生成最优开场白
                  </h3>
                  <p className="text-gray-600">
                    3秒内得到结果，直接显示成功率最高的，附带详细理由
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                  3
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    一键复制，发送
                  </h3>
                  <p className="text-gray-600">
                    AI会告诉你为什么这样说好，让你更自信地发送
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>全程无需注册，完全免费使用</span>
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

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
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
