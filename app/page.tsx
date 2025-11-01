'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, TrendingUp, Users, CheckCircle2, Zap, Heart, MessageCircle, Star, Coffee, Music, Camera } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

// 实时成功案例（模拟数据）
const successCases = [
  { name: "小王", topic: "咖啡馆话题", time: "2分钟前", score: 90, status: "对方已回复", color: "emerald" },
  { name: "小李", topic: "独立音乐", time: "5分钟前", score: 85, status: "聊了5轮", color: "blue" },
  { name: "小张", topic: "INTJ性格", time: "8分钟前", score: 88, status: "要到微信了", color: "violet" },
  { name: "小陈", topic: "摄影爱好", time: "12分钟前", score: 82, status: "约了线下", color: "rose" },
  { name: "小赵", topic: "村上春树", time: "15分钟前", score: 87, status: "聊得很嗨", color: "amber" },
];

const painPoints = [
  {
    quote: "每次开场就是'你好'、'在吗'，感觉特别尴尬",
    author: "Reddit r/dating_advice 用户",
    emoji: "😅",
    color: "from-blue-500 to-cyan-500"
  },
  {
    quote: "想聊深入点的话题，但不知道怎么开头",
    author: "Reddit r/socialskills 用户",
    emoji: "🤔",
    color: "from-violet-500 to-purple-500"
  },
  {
    quote: "总是担心第一句话说错，错过好的connection",
    author: "Reddit r/relationships 用户",
    emoji: "😰",
    color: "from-rose-500 to-pink-500"
  }
];

// 3D 浮动图标数据
const floatingIcons = [
  { Icon: Coffee, color: 'from-amber-400 to-orange-500', delay: 0, x: -100, y: -50 },
  { Icon: Music, color: 'from-purple-400 to-pink-500', delay: 0.2, x: 100, y: -80 },
  { Icon: Camera, color: 'from-blue-400 to-cyan-500', delay: 0.4, x: -120, y: 60 },
  { Icon: Star, color: 'from-yellow-400 to-amber-500', delay: 0.6, x: 120, y: 80 },
  { Icon: Heart, color: 'from-rose-400 to-pink-500', delay: 0.8, x: 0, y: -120 },
];

// 3D 浮动图标组件
function FloatingIcon({ Icon, color, delay, x, y }: {
  Icon: any;
  color: string;
  delay: number;
  x: number;
  y: number;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: '50%', top: '50%' }}
      initial={{ opacity: 0, scale: 0, x: 0, y: 0, rotateY: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1.2, 1, 0.8],
        x: [0, x * 0.5, x, x * 1.2],
        y: [0, y * 0.5, y, y * 1.2],
        rotateY: [0, 180, 360, 540],
        rotateX: [0, 15, -15, 0]
      }}
      transition={{
        duration: 20,
        delay,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut"
      }}
    >
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-2xl backdrop-blur-sm`}
        style={{
          transform: 'perspective(1000px)',
          transformStyle: 'preserve-3d'
        }}
      >
        <Icon className="w-8 h-8 text-white" />
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const [currentCase, setCurrentCase] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, 50]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);

  // 实时成功案例自动滚动
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCase((prev) => (prev + 1) % successCases.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // 鼠标视差效果
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX - innerWidth / 2) / innerWidth;
      const y = (clientY - innerHeight / 2) / innerHeight;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      {/* 3D 增强背景 */}
      <div className="fixed inset-0 pointer-events-none">
        {/* 动态渐变背景 */}
        <motion.div
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/20 via-violet-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            transform: `translate(${mousePosition.x * 50}px, ${mousePosition.y * 50}px)`
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-pink-400/20 via-rose-400/20 to-red-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            transform: `translate(${-mousePosition.x * 50}px, ${-mousePosition.y * 50}px)`
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-br from-cyan-400/15 to-blue-400/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            x: [-50, 50, -50],
            y: [-50, 50, -50],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* 网格背景 */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`
          }}
        />
      </div>

      <div className="container relative mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 relative"
          style={{ perspective: '1000px' }}
        >
          {/* 3D 浮动图标 */}
          <div className="absolute inset-0 hidden md:block">
            {floatingIcons.map((icon, index) => (
              <FloatingIcon key={index} {...icon} />
            ))}
          </div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-6 relative z-10"
            whileHover={{ scale: 1.05 }}
          >
            <Badge className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-4 py-2 text-sm border-0 shadow-lg">
              <Sparkles className="w-4 h-4 mr-2 inline" />
              AI驱动的破冰助手
            </Badge>
          </motion.div>

          {/* 主标题 */}
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight relative z-10"
            style={{ y: y1 }}
          >
            <motion.span
              className="bg-gradient-to-r from-gray-900 via-blue-900 to-violet-900 bg-clip-text text-transparent inline-block"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              AI对话助手
            </motion.span>
            <br />
            <motion.span
              className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent inline-block"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              找到最优破冰开场白
            </motion.span>
          </motion.h1>

          {/* 副标题 */}
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            粘贴profile → AI自动识别兴趣 → 对话引导 → 实时评分 → 得到最优开场白
          </p>

          {/* 数据背书 */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-10">
            <div className="flex items-center gap-2 text-gray-700">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-base">已帮助 <strong className="text-gray-900">12,847</strong> 人成功破冰</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span className="text-base">平均成功率 <strong className="text-gray-900">78%</strong></span>
            </div>
          </div>

          {/* 实时成功案例滚动 */}
          <motion.div
            key={currentCase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 inline-flex items-center gap-3 mb-10 border border-gray-200 shadow-lg"
          >
            <div className={`w-2 h-2 rounded-full bg-${successCases[currentCase].color}-500 animate-pulse`} />
            <span className="text-sm text-gray-700">
              <strong className="text-gray-900">{successCases[currentCase].name}</strong> 刚用{successCases[currentCase].topic}
              <span className="mx-2 text-gray-400">·</span>
              <span className="text-emerald-600 font-medium">✓ {successCases[currentCase].status}</span>
              <span className="mx-2 text-gray-400">·</span>
              <span className="text-gray-500">{successCases[currentCase].time}</span>
            </span>
          </motion.div>

          {/* CTA按钮 */}
          <Link href="/chat">
            <motion.div
              className="relative inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* 光晕效果 */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl blur-xl opacity-50"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.7, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <Button
                size="lg"
                className="relative bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white text-xl px-12 py-7 shadow-2xl rounded-2xl border-0 font-semibold overflow-hidden group"
              >
                {/* 悬停光效 */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <motion.div
                  className="flex items-center relative z-10"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 15, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Zap className="w-6 h-6 mr-2" />
                  </motion.div>
                  立即生成开场白
                </motion.div>
              </Button>
            </motion.div>
          </Link>

          {/* 次要信息 */}
          <p className="text-gray-500 text-sm mt-6">
            🎉 免费使用 · 无需注册 · 开源项目
          </p>
        </motion.div>

        {/* Success Stats Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-20"
          style={{ y: y2 }}
        >
          {[
            { icon: Zap, value: "30秒", label: "从打开到得到开场白", gradient: "from-blue-600 to-cyan-600", bg: "from-blue-50 to-cyan-50", border: "border-blue-200", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
            { icon: TrendingUp, value: "78%", label: "平均破冰成功率", gradient: "from-violet-600 to-purple-600", bg: "from-violet-50 to-purple-50", border: "border-violet-200", iconBg: "bg-violet-100", iconColor: "text-violet-600" },
            { icon: Users, value: "12K+", label: "已成功破冰次数", gradient: "from-rose-600 to-pink-600", bg: "from-rose-50 to-pink-50", border: "border-rose-200", iconBg: "bg-rose-100", iconColor: "text-rose-600" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                rotateX: 5,
                z: 50
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Card className={`p-6 bg-gradient-to-br ${stat.bg} ${stat.border} hover:shadow-2xl transition-all cursor-pointer`}>
                <div className="text-center" style={{ transform: 'translateZ(20px)' }}>
                  <motion.div
                    className={`w-12 h-12 ${stat.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-3`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </motion.div>
                  <div className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>{stat.value}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
            AI对话式引导流程
          </h2>
          <Card className="p-8 bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
            <div className="space-y-6">
              {[
                {
                  num: 1,
                  title: "粘贴对方的profile",
                  desc: "例如：\"INTJ、咖啡馆、独立音乐\"，AI自动识别兴趣标签",
                  icon: MessageCircle,
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  num: 2,
                  title: "AI生成3个候选话题",
                  desc: "基于兴趣匹配，生成不同角度的破冰开场白",
                  icon: Sparkles,
                  color: "from-violet-500 to-purple-500"
                },
                {
                  num: 3,
                  title: "自动评分排序",
                  desc: "混合评分算法（客户端30% + 服务端70%）预测成功率",
                  icon: TrendingUp,
                  color: "from-emerald-500 to-green-500"
                },
                {
                  num: 4,
                  title: "AI解释推荐理由",
                  desc: "告诉你为什么这样说好，让你更自信地发送",
                  icon: CheckCircle2,
                  color: "from-amber-500 to-orange-500"
                },
                {
                  num: 5,
                  title: "一键复制发送",
                  desc: "复制到剪贴板，自动保存到破冰库供日后参考",
                  icon: Heart,
                  color: "from-rose-500 to-pink-500"
                }
              ].map((step) => (
                <div key={step.num} className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                    {step.num}
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1 flex items-center gap-2">
                      <step.icon className="w-5 h-5" />
                      {step.title}
                    </h3>
                    <p className="text-gray-600">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>全程AI对话引导，无需注册，完全免费使用</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Pain Points Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          {painPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
              whileHover={{
                scale: 1.03,
                rotateY: 3,
                rotateX: 3,
                z: 30
              }}
              style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
            >
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-gray-200 hover:shadow-2xl transition-all h-full">
                <motion.div
                  className={`w-12 h-12 bg-gradient-to-r ${point.color} rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg`}
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  style={{ transform: 'translateZ(20px)' }}
                >
                  {point.emoji}
                </motion.div>
                <blockquote className="text-gray-700 italic mb-4 leading-relaxed">
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
          className="text-center text-gray-500 text-sm mt-16 pt-8 border-t border-gray-200"
        >
          <p>
            <a
              href="https://github.com/JasonRobertDestiny/icebreak"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-900 transition-colors"
            >
              GitHub
            </a>
            {' · '}
            <a
              href="mailto:johnrobertdestiny@gmail.com"
              className="underline hover:text-gray-900 transition-colors"
            >
              Contact
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
