'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, CheckCircle2, Lightbulb, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IcebreakerTopic } from '@/lib/types/icebreaker';

interface TopicCardProps {
  topic: IcebreakerTopic;
  index: number;
  onCopy: (text: string) => void;
  onSelect: (topic: IcebreakerTopic) => void;
}

export function TopicCard({ topic, index, onCopy, onSelect }: TopicCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy(topic.opener);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.15,
        ease: 'easeOut'
      }}
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50/80 via-pink-50/80 to-white p-6 hover:shadow-xl transition-shadow duration-300">
        {/* Top section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{topic.emoji}</span>
            <div>
              <h3 className="font-semibold text-gray-800">{topic.category}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">成功率</span>
                <span className={
                  topic.success_rate >= 85 ? 'bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium' : 
                  topic.success_rate >= 70 ? 'bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-medium' : 
                  'bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium'
                }>
                  {topic.success_rate}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Opener text */}
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 mb-4">
          <p className="text-lg leading-relaxed text-gray-800">
            "{topic.opener}"
          </p>
        </div>

        {/* Why good */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <span className="text-green-500">✓</span>
            为什么这条好
          </h4>
          <ul className="space-y-1">
            {topic.why_good.map((reason, idx) => (
              <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Follow ups */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
            后续话题方向
          </h4>
          <ul className="space-y-1">
            {topic.follow_ups.map((followUp, idx) => (
              <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-yellow-500 mt-0.5">•</span>
                <span>{followUp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Avoid tips */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            避坑提示
          </h4>
          <ul className="space-y-1">
            {topic.avoid.map((tip, idx) => (
              <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex-1"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-1 text-green-500" />
                已复制
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1" />
                复制
              </>
            )}
          </Button>
          <Button
            size="sm"
            onClick={() => onSelect(topic)}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            选择这条
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
