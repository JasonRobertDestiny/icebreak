'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import InterestInput from '@/components/icebreaker/InterestInput';
import { TopicCard } from '@/components/icebreaker/TopicCard';
import { ConversationStyle, IcebreakerTopic } from '@/lib/types/icebreaker';
import { toast } from 'sonner';

export default function GeneratePage() {
  const [interests, setInterests] = useState<string[]>([]);
  const [profileInfo, setProfileInfo] = useState('');
  const [style, setStyle] = useState<ConversationStyle>('sincere');
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<IcebreakerTopic[]>([]);

  const handleGenerate = async () => {
    if (interests.length === 0) {
      toast.error('请至少选择一个兴趣标签');
      return;
    }

    setLoading(true);
    setTopics([]);

    try {
      const response = await fetch('/api/generate-icebreaker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interests,
          profileInfo: profileInfo.trim() || undefined,
          style
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || '生成失败');
      }

      setTopics(data.topics || []);
      toast.success('成功生成3个破冰话题！');

    } catch (error: any) {
      console.error('Generate error:', error);
      toast.error(error.message || 'AI生成失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('已复制到剪贴板');
  };

  const handleSelect = (topic: IcebreakerTopic) => {
    toast.success(`已选择：${topic.category}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回首页
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              生成破冰话题
            </h1>
            <p className="text-white/90 text-lg">
              告诉我对方的兴趣，AI瞬间生成个性化开场白
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <InterestInput value={interests} onChange={setInterests} />
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                对方profile补充信息（可选）
              </h3>
              <textarea
                value={profileInfo}
                onChange={(e) => setProfileInfo(e.target.value)}
                placeholder='例如："最近在听万能青年旅店" 或 "周末喜欢去798"'
                className="w-full h-24 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                选择对话风格
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'humorous', label: '幽默风趣', emoji: '😄' },
                  { value: 'sincere', label: '真诚温暖', emoji: '💝' },
                  { value: 'curious', label: '好奇探索', emoji: '🤔' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setStyle(option.value as ConversationStyle)}
                    className={
                      style === option.value
                        ? 'px-4 py-3 rounded-lg font-medium transition-all bg-purple-600 text-white shadow-lg scale-105'
                        : 'px-4 py-3 rounded-lg font-medium transition-all bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  >
                    <div className="text-2xl mb-1">{option.emoji}</div>
                    <div className="text-sm">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading || interests.length === 0}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 shadow-xl"
            >
              {loading ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                  AI正在思考...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  生成破冰话题
                </>
              )}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {topics.length === 0 ? (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-12 shadow-xl h-full flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">点击"生成破冰话题"开始</p>
                  <p className="text-sm mt-2">AI会为你生成3个个性化开场白</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {topics.map((topic, index) => (
                  <TopicCard
                    key={index}
                    topic={topic}
                    index={index}
                    onCopy={handleCopy}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
