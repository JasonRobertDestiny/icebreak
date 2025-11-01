'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Loader2, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ConfidenceMeterProps {
  score: number;  // 0-100
  confidence: 'low' | 'medium' | 'high' | 'very-high';
  isLoading?: boolean;
  feedback?: string;
  mode?: 'compact' | 'full';
}

export function ConfidenceMeter({
  score,
  confidence,
  isLoading = false,
  feedback,
  mode = 'full'
}: ConfidenceMeterProps) {
  // 动画计数器（从0到目标分数）
  const springScore = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    springScore.set(score);
    const unsubscribe = springScore.on('change', (latest) => {
      setDisplayScore(Math.round(latest));
    });
    return () => unsubscribe();
  }, [score, springScore]);

  // 根据信心等级选择颜色和图标
  const getConfidenceStyle = () => {
    switch (confidence) {
      case 'very-high':
        return {
          gradient: 'from-green-500 to-emerald-600',
          bgGradient: 'from-green-50 to-emerald-50',
          textColor: 'text-green-700',
          icon: <CheckCircle2 className="w-5 h-5" />,
          label: '很有信心',
          emoji: '🎯'
        };
      case 'high':
        return {
          gradient: 'from-blue-500 to-cyan-600',
          bgGradient: 'from-blue-50 to-cyan-50',
          textColor: 'text-blue-700',
          icon: <Sparkles className="w-5 h-5" />,
          label: '有信心',
          emoji: '✨'
        };
      case 'medium':
        return {
          gradient: 'from-yellow-500 to-orange-500',
          bgGradient: 'from-yellow-50 to-orange-50',
          textColor: 'text-yellow-700',
          icon: <AlertCircle className="w-5 h-5" />,
          label: '中等',
          emoji: '💭'
        };
      case 'low':
        return {
          gradient: 'from-gray-400 to-gray-500',
          bgGradient: 'from-gray-50 to-gray-100',
          textColor: 'text-gray-700',
          icon: <AlertCircle className="w-5 h-5" />,
          label: '需要优化',
          emoji: '🤔'
        };
    }
  };

  const style = getConfidenceStyle();

  // 加载状态
  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="flex items-center justify-center gap-3 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>分析中...</span>
        </div>
      </Card>
    );
  }

  // Compact模式（仅显示分数和等级）
  if (mode === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${style.gradient} text-white font-semibold shadow-md`}
      >
        <span className="text-2xl">{style.emoji}</span>
        <span className="text-lg">{displayScore}</span>
        <span className="text-sm opacity-90">{style.label}</span>
      </motion.div>
    );
  }

  // Full模式（完整仪表盘）
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`p-6 bg-gradient-to-br ${style.bgGradient} border-2`}>
        <div className="space-y-4">
          {/* 头部：标题和图标 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 ${style.textColor}">
              {style.icon}
              <span className="font-semibold">信心指数</span>
            </div>
            <span className="text-3xl">{style.emoji}</span>
          </div>

          {/* 分数显示（大号动画数字） */}
          <div className="relative">
            <div className="flex items-baseline justify-center gap-2">
              <motion.span
                className={`text-6xl font-bold ${style.textColor}`}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                {displayScore}
              </motion.span>
              <span className={`text-2xl ${style.textColor} opacity-60`}>/100</span>
            </div>

            {/* 环形进度条 */}
            <motion.div
              className="absolute inset-0 -z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
            >
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  className={style.textColor}
                  strokeDasharray={`${(score / 100) * 283} 283`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
            </motion.div>
          </div>

          {/* 信心等级标签 */}
          <div className="text-center">
            <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${style.textColor} bg-white/50`}>
              {style.label}
            </span>
          </div>

          {/* 反馈文案 */}
          {feedback && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: 0.3 }}
              className={`text-sm ${style.textColor} bg-white/70 rounded-lg p-3`}
            >
              {feedback}
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
