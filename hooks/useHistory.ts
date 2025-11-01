'use client';

import { useState, useEffect } from 'react';
import {
  getTopicHistory,
  getConfidenceHistory,
  TopicHistoryItem,
  ConfidenceHistoryItem,
  deleteTopicHistory,
  deleteConfidenceHistory,
  clearTopicHistory,
  clearConfidenceHistory,
  getTopicStats,
  getConfidenceStats
} from '@/lib/storage/history';

/**
 * 话题生成历史Hook
 */
export function useTopicHistory() {
  const [history, setHistory] = useState<TopicHistoryItem[]>([]);
  const [stats, setStats] = useState(getTopicStats());

  // 初始化加载
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    setHistory(getTopicHistory());
    setStats(getTopicStats());
  };

  const deleteItem = (id: string) => {
    if (deleteTopicHistory(id)) {
      loadHistory();
    }
  };

  const clearAll = () => {
    if (clearTopicHistory()) {
      loadHistory();
    }
  };

  return {
    history,
    stats,
    refresh: loadHistory,
    deleteItem,
    clearAll
  };
}

/**
 * 信心评分历史Hook
 */
export function useConfidenceHistory() {
  const [history, setHistory] = useState<ConfidenceHistoryItem[]>([]);
  const [stats, setStats] = useState(getConfidenceStats());

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    setHistory(getConfidenceHistory());
    setStats(getConfidenceStats());
  };

  const deleteItem = (id: string) => {
    if (deleteConfidenceHistory(id)) {
      loadHistory();
    }
  };

  const clearAll = () => {
    if (clearConfidenceHistory()) {
      loadHistory();
    }
  };

  return {
    history,
    stats,
    refresh: loadHistory,
    deleteItem,
    clearAll
  };
}
