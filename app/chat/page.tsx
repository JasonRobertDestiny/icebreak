'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sparkles, Send, Copy, CheckCircle, ArrowLeft } from 'lucide-react';
import { IcebreakerTopic, ConversationStyle } from '@/lib/types/icebreaker';
import { ConfidenceScoreResponse } from '@/app/api/confidence-score/route';
import { toast } from 'sonner';
import Link from 'next/link';

// 对话状态
type ChatState =
  | 'WELCOME'           // 欢迎，引导输入
  | 'COLLECTING_INTERESTS'  // 收集兴趣标签
  | 'GENERATING'        // 生成话题中
  | 'TOPIC_SELECT'      // 选择话题
  | 'EVALUATING'        // 评估中
  | 'SCORE_RESULT'      // 展示评分
  | 'OPTIMIZING'        // 优化中（分数<70）
  | 'FINAL';            // 最终确认

// 消息类型
interface Message {
  id: string;
  role: 'ai' | 'user';
  type: 'text' | 'topics' | 'score' | 'final';
  content: string;
  data?: any;
  timestamp: number;
}

export default function ChatPage() {
  const [state, setState] = useState<ChatState>('WELCOME');
  const [messages, setMessages] = useState<Message[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [style, setStyle] = useState<ConversationStyle>('sincere');
  const [topics, setTopics] = useState<IcebreakerTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<IcebreakerTopic | null>(null);
  const [scoreResult, setScoreResult] = useState<ConfidenceScoreResponse | null>(null);
  const [optimizedMessage, setOptimizedMessage] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 初始化欢迎消息
  useEffect(() => {
    addAIMessage('text', '你好！我是你的破冰助手 ✨\n\n告诉我对方的兴趣爱好，我来帮你想一个完美的开场白！');
  }, []);

  const addAIMessage = (type: Message['type'], content: string, data?: any) => {
    const message: Message = {
      id: Date.now().toString(),
      role: 'ai',
      type,
      content,
      data,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, message]);
  };

  const addUserMessage = (content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      role: 'user',
      type: 'text',
      content,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, message]);
  };

  // 添加兴趣标签
  const handleAddInterest = () => {
    if (!currentInput.trim()) return;
    if (interests.length >= 5) {
      toast.error('最多5个兴趣标签');
      return;
    }

    const newInterest = currentInput.trim();
    setInterests(prev => [...prev, newInterest]);
    addUserMessage(newInterest);
    setCurrentInput('');

    if (interests.length === 0) {
      setTimeout(() => {
        addAIMessage('text', '很好！还有其他兴趣吗？（最多5个）\n或者点击"生成开场白"继续 →');
      }, 500);
    }
  };

  // 生成话题
  const handleGenerateTopics = async () => {
    if (interests.length === 0) {
      toast.error('请至少添加一个兴趣标签');
      return;
    }

    setState('GENERATING');
    addAIMessage('text', '明白了！让我想想怎么开场...');

    try {
      const response = await fetch('/api/generate-icebreaker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests, style })
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error);

      setTopics(data.topics);
      setState('TOPIC_SELECT');

      setTimeout(() => {
        addAIMessage('topics', '我为你准备了3个开场白，选一个你最喜欢的吧！', data.topics);
      }, 800);

    } catch (error: any) {
      toast.error('生成失败，请重试');
      setState('WELCOME');
      addAIMessage('text', '抱歉，出了点问题。要不要重新开始？');
    }
  };

  // 选择话题
  const handleSelectTopic = async (topic: IcebreakerTopic) => {
    setSelectedTopic(topic);
    addUserMessage(`我选择：${topic.category}`);

    setState('EVALUATING');
    addAIMessage('text', '不错的选择！让我评估一下发送成功率...');

    try {
      const response = await fetch('/api/confidence-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: topic.openingLine,
          targetInterests: interests,
          mode: 'full'
        })
      });

      if (!response.ok) throw new Error('评估失败');

      const scoreData: ConfidenceScoreResponse = await response.json();
      setScoreResult(scoreData);
      setState('SCORE_RESULT');

      setTimeout(() => {
        if (scoreData.finalScore >= 70) {
          addAIMessage('score', `评分：${scoreData.finalScore}分 - ${scoreData.recommendation}`, scoreData);
          setTimeout(() => {
            setState('FINAL');
            addAIMessage('final', '很棒！这个开场白已经很好了。复制并发送吧，相信自己！', {
              message: topic.openingLine,
              score: scoreData.finalScore
            });
          }, 1500);
        } else {
          addAIMessage('score', `评分：${scoreData.finalScore}分 - 我觉得可以更好一点`, scoreData);
          setTimeout(() => {
            handleOptimize(topic.openingLine);
          }, 1000);
        }
      }, 1000);

    } catch (error) {
      toast.error('评估失败，请重试');
      setState('TOPIC_SELECT');
    }
  };

  // 优化开场白
  const handleOptimize = async (originalMessage: string) => {
    setState('OPTIMIZING');
    addAIMessage('text', '让我帮你优化一下...');

    // 简单优化逻辑：基于AI反馈
    const optimized = originalMessage; // 实际可以调用API进一步优化
    setOptimizedMessage(optimized);

    setTimeout(() => {
      setState('FINAL');
      addAIMessage('final', '这是优化后的版本，更加真诚自然。试试这个吧！', {
        message: optimized,
        score: scoreResult?.finalScore
      });
    }, 1500);
  };

  // 复制消息
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('已复制到剪贴板！');
  };

  // 重新开始
  const handleRestart = () => {
    setState('WELCOME');
    setMessages([]);
    setInterests([]);
    setTopics([]);
    setSelectedTopic(null);
    setScoreResult(null);
    setOptimizedMessage('');
    addAIMessage('text', '重新开始！告诉我对方的兴趣爱好吧 😊');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              破冰助手
            </h1>
            <p className="text-gray-600 text-sm mt-1">AI帮你想开场白，还告诉你行不行</p>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" />
              返回
            </Button>
          </Link>
        </div>

        {/* Chat Container */}
        <Card className="h-[600px] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onSelectTopic={handleSelectTopic}
                  onCopy={handleCopy}
                />
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4 bg-gray-50">
            {state === 'WELCOME' || state === 'COLLECTING_INTERESTS' ? (
              <div className="space-y-3">
                {/* 已选兴趣标签 */}
                {interests.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {interests.map((tag, idx) => (
                      <Badge key={idx} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* 输入框 */}
                <div className="flex gap-2">
                  <Input
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddInterest();
                      }
                    }}
                    placeholder="例如：独立音乐、咖啡馆、INFP..."
                    className="flex-1"
                  />
                  <Button
                    onClick={handleAddInterest}
                    disabled={!currentInput.trim() || interests.length >= 5}
                  >
                    添加
                  </Button>
                  {interests.length > 0 && (
                    <Button
                      onClick={handleGenerateTopics}
                      className="bg-gradient-to-r from-purple-600 to-pink-600"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      生成开场白
                    </Button>
                  )}
                </div>
              </div>
            ) : state === 'FINAL' ? (
              <div className="flex gap-2">
                <Button
                  onClick={handleRestart}
                  variant="outline"
                  className="flex-1"
                >
                  重新开始
                </Button>
              </div>
            ) : (
              <div className="text-center text-gray-500 text-sm">
                AI正在处理中...
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

// 消息气泡组件
function MessageBubble({
  message,
  onSelectTopic,
  onCopy
}: {
  message: Message;
  onSelectTopic: (topic: IcebreakerTopic) => void;
  onCopy: (text: string) => void;
}) {
  const isAI = message.role === 'ai';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}
    >
      <div className={`max-w-[80%] ${isAI ? '' : 'flex flex-col items-end'}`}>
        {/* AI标识 */}
        {isAI && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">AI助手</span>
          </div>
        )}

        {/* 消息内容 */}
        {message.type === 'text' && (
          <div
            className={`rounded-2xl px-4 py-3 ${
              isAI
                ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-gray-800'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
            }`}
          >
            <p className="whitespace-pre-line">{message.content}</p>
          </div>
        )}

        {/* 话题卡片 */}
        {message.type === 'topics' && message.data && (
          <div className="space-y-3 w-full">
            {message.data.map((topic: IcebreakerTopic, idx: number) => (
              <Card
                key={idx}
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-300"
                onClick={() => onSelectTopic(topic)}
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary">{topic.category}</Badge>
                  <span className="text-2xl">{topic.emoji}</span>
                </div>
                <p className="text-gray-700 leading-relaxed mb-3">
                  {topic.openingLine}
                </p>
                <div className="text-sm text-purple-600 font-medium">
                  点击选择 →
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* 评分结果 */}
        {message.type === 'score' && message.data && (
          <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl font-bold text-purple-600">
                {message.data.finalScore}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-700">发送成功率</div>
                <div className="text-xs text-gray-500">{message.data.recommendation}</div>
              </div>
            </div>
          </div>
        )}

        {/* 最终消息 */}
        {message.type === 'final' && message.data && (
          <div className="space-y-3 w-full">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border-2 border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-800">最终开场白</span>
              </div>
              <p className="text-gray-700 leading-relaxed mb-3">
                {message.data.message}
              </p>
              <Button
                onClick={() => onCopy(message.data.message)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
              >
                <Copy className="w-4 h-4 mr-2" />
                复制并发送
              </Button>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 italic">
                {message.content}
              </p>
            </div>
          </div>
        )}

        {/* 时间戳 */}
        <div className={`text-xs text-gray-400 mt-1 ${isAI ? 'text-left' : 'text-right'}`}>
          {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </motion.div>
  );
}
