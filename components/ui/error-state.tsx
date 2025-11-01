'use client';

import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  showRetry?: boolean;
  showHome?: boolean;
}

export function ErrorState({
  title = '出错了',
  message = '抱歉，发生了一些问题。请稍后重试。',
  onRetry,
  onGoHome,
  showRetry = true,
  showHome = false
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-12 text-center bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-block"
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        </motion.div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{message}</p>

        <div className="flex gap-3 justify-center">
          {showRetry && onRetry && (
            <Button
              onClick={onRetry}
              variant="default"
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              重试
            </Button>
          )}

          {showHome && onGoHome && (
            <Button onClick={onGoHome} variant="outline">
              <Home className="w-4 h-4 mr-2" />
              返回首页
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

// API错误专用组件
export function ApiErrorState({
  error,
  onRetry
}: {
  error: Error;
  onRetry?: () => void;
}) {
  const isNetworkError = error.message.includes('fetch') || error.message.includes('network');
  const isRateLimitError = error.message.includes('429') || error.message.includes('rate limit');

  let title = 'API调用失败';
  let message = error.message;

  if (isNetworkError) {
    title = '网络连接失败';
    message = '请检查网络连接后重试';
  } else if (isRateLimitError) {
    title = '请求过于频繁';
    message = '请稍后再试（约1分钟）';
  }

  return <ErrorState title={title} message={message} onRetry={onRetry} showRetry={true} />;
}

// 空状态组件
export function EmptyState({
  icon: Icon = AlertCircle,
  title = '暂无数据',
  message = '还没有任何内容',
  actionLabel,
  onAction
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-12 text-center bg-gradient-to-br from-gray-50 to-white">
        <Icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">{title}</h3>
        <p className="text-gray-500 mb-6">{message}</p>

        {actionLabel && onAction && (
          <Button onClick={onAction} variant="outline">
            {actionLabel}
          </Button>
        )}
      </Card>
    </motion.div>
  );
}
