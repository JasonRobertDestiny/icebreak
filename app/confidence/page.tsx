'use client';

import { useState } from 'react';
import { ConfidenceMeter } from '@/components/confidence/ConfidenceMeter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ConfidenceScoreResponse } from '@/app/api/confidence-score/route';
import { Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';

export default function ConfidencePage() {
  const [message, setMessage] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ConfidenceScoreResponse | null>(null);

  // 添加兴趣标签
  const addInterest = (tag: string) => {
    if (interests.length >= 5) {
      toast.error('最多5个兴趣标签');
      return;
    }
    if (!interests.includes(tag)) {
      setInterests([...interests, tag]);
      setCustomInterest('');
    }
  };

  // 删除兴趣标签
  const removeInterest = (tag: string) => {
    setInterests(interests.filter(t => t !== tag));
  };

  // 分析信心分数
  const analyzeConfidence = async () => {
    if (!message.trim()) {
      toast.error('请输入开场白');
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch('/api/confidence-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          targetInterests: interests.length > 0 ? interests : undefined,
          mode: 'full'
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data: ConfidenceScoreResponse = await response.json();
      setResult(data);

      // 根据分数显示toast
      if (data.finalScore >= 80) {
        toast.success('很棒的开场白！');
      } else if (data.finalScore >= 60) {
        toast.info('不错，可以优化一下');
      } else {
        toast.warning('建议重新思考开场白');
      }

    } catch (error) {
      console.error('Confidence analysis failed:', error);
      toast.error('分析失败，请重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* 头部 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            信心增强器 ✨
          </h1>
          <p className="text-gray-600 text-lg">
            输入你的开场白，AI帮你评估发送成功率
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 左侧：输入区域 */}
          <Card className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                你的开场白
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="例如：看到你也在听万青，最近循环《杀死那个石家庄人》..."
                className="w-full min-h-[120px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {message.length}/500
                </span>
              </div>
            </div>

            {/* 对方兴趣标签（可选） */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                对方兴趣（可选，最多5个）
              </label>
              <div className="flex gap-2 mb-3">
                <Input
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addInterest(customInterest);
                    }
                  }}
                  placeholder="输入兴趣标签，按Enter添加"
                  maxLength={15}
                  disabled={interests.length >= 5}
                />
              </div>

              {/* 已选标签 */}
              {interests.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {interests.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="px-3 py-1 flex items-center gap-1"
                    >
                      {tag}
                      <button
                        onClick={() => removeInterest(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* 分析按钮 */}
            <Button
              onClick={analyzeConfidence}
              disabled={!message.trim() || isAnalyzing}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                  分析中...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  分析信心指数
                </>
              )}
            </Button>
          </Card>

          {/* 右侧：结果展示 */}
          <div className="space-y-6">
            {result && (
              <>
                {/* 信心仪表盘 */}
                <ConfidenceMeter
                  score={result.finalScore}
                  confidence={result.confidence}
                  feedback={result.recommendation}
                  mode="full"
                />

                {/* 详细反馈 */}
                <Card className="p-6 space-y-4">
                  <h3 className="font-semibold text-gray-900">详细反馈</h3>

                  {/* 客户端评分 */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">客户端评分</span>
                      <span className="font-medium">{result.clientScore.totalScore}/100</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">长度评分</span>
                      <span className="font-medium">{result.clientScore.lengthScore}/100</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">模式评分</span>
                      <span className="font-medium">{result.clientScore.patternScore}/100</span>
                    </div>
                  </div>

                  {/* 语义评分 */}
                  {result.semanticScore && (
                    <div className="pt-4 border-t space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">真诚度</span>
                        <span className="font-medium">{result.semanticScore.sincerity}/100</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">创意性</span>
                        <span className="font-medium">{result.semanticScore.creativity}/100</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">相关性</span>
                        <span className="font-medium">{result.semanticScore.relevance}/100</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">成功率</span>
                        <span className="font-medium">{result.semanticScore.successRate}%</span>
                      </div>
                    </div>
                  )}

                  {/* 优点 */}
                  {result.clientScore.positives.length > 0 && (
                    <div className="pt-4 border-t">
                      <span className="text-sm font-medium text-green-700">✓ 优点</span>
                      <ul className="mt-2 space-y-1">
                        {result.clientScore.positives.map((item, idx) => (
                          <li key={idx} className="text-sm text-gray-600 ml-4">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 需要改进 */}
                  {result.clientScore.violations.length > 0 && (
                    <div className="pt-4 border-t">
                      <span className="text-sm font-medium text-orange-700">⚠ 需要改进</span>
                      <ul className="mt-2 space-y-1">
                        {result.clientScore.violations.map((item, idx) => (
                          <li key={idx} className="text-sm text-gray-600 ml-4">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* AI建议 */}
                  {result.semanticScore && result.semanticScore.feedback.length > 0 && (
                    <div className="pt-4 border-t">
                      <span className="text-sm font-medium text-blue-700">💡 AI建议</span>
                      <ul className="mt-2 space-y-1">
                        {result.semanticScore.feedback.map((item, idx) => (
                          <li key={idx} className="text-sm text-gray-600 ml-4">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              </>
            )}

            {/* 占位状态 */}
            {!result && !isAnalyzing && (
              <Card className="p-12 text-center bg-gradient-to-br from-gray-50 to-white">
                <Sparkles className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">
                  输入开场白后，点击"分析"查看信心指数
                </p>
              </Card>
            )}

            {isAnalyzing && (
              <ConfidenceMeter score={0} confidence="medium" isLoading={true} mode="full" />
            )}
          </div>
        </div>

        {/* 示例开场白 */}
        <Card className="mt-12 p-6 bg-gradient-to-br from-purple-50/50 to-pink-50/50">
          <h3 className="font-semibold text-gray-900 mb-4">💡 高分开场白示例</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                "看到你也在听万青，最近循环《杀死那个石家庄人》时总想起大学时和室友在宿舍单曲循环整晚的时光。你最喜欢他们哪首歌带来的情绪触动？"
              </p>
              <span className="text-xs text-green-600 font-medium mt-2 inline-block">分数：88</span>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                "刷到你的咖啡馆打卡，那家隐藏在小巷里的店我也去过！老板的手冲真的绝，但每次都纠结豆子选择。你一般会选什么产区的豆子？"
              </p>
              <span className="text-xs text-green-600 font-medium mt-2 inline-block">分数：85</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
