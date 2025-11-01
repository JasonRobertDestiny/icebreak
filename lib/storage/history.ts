/**
 * LocalStorage历史记录管理
 * MVP阶段使用LocalStorage，无需数据库
 */

import { IcebreakerTopic } from '@/lib/types/icebreaker';
import { ConfidenceScoreResponse } from '@/app/api/confidence-score/route';

// 历史记录类型
export interface TopicHistoryItem {
  id: string;
  timestamp: number;
  interests: string[];
  style: 'humorous' | 'sincere' | 'curious';
  topics: IcebreakerTopic[];
  selectedTopic?: IcebreakerTopic;
}

export interface ConfidenceHistoryItem {
  id: string;
  timestamp: number;
  message: string;
  result: ConfidenceScoreResponse;
}

// LocalStorage keys
const TOPIC_HISTORY_KEY = 'icebreak_topic_history';
const CONFIDENCE_HISTORY_KEY = 'icebreak_confidence_history';
const MAX_HISTORY_ITEMS = 50; // 最多保存50条记录

/**
 * 生成唯一ID
 */
function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 安全读取LocalStorage
 */
function safeGetLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Failed to read localStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * 安全写入LocalStorage
 */
function safeSetLocalStorage<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false;

  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Failed to write localStorage key "${key}":`, error);
    return false;
  }
}

// ============ 话题生成历史 ============

/**
 * 获取所有话题生成历史
 */
export function getTopicHistory(): TopicHistoryItem[] {
  return safeGetLocalStorage<TopicHistoryItem[]>(TOPIC_HISTORY_KEY, []);
}

/**
 * 添加话题生成记录
 */
export function addTopicHistory(
  interests: string[],
  style: 'humorous' | 'sincere' | 'curious',
  topics: IcebreakerTopic[]
): string {
  const history = getTopicHistory();

  const newItem: TopicHistoryItem = {
    id: generateId(),
    timestamp: Date.now(),
    interests,
    style,
    topics
  };

  // 添加到开头，保持最新记录在前
  history.unshift(newItem);

  // 限制数量
  if (history.length > MAX_HISTORY_ITEMS) {
    history.splice(MAX_HISTORY_ITEMS);
  }

  safeSetLocalStorage(TOPIC_HISTORY_KEY, history);
  return newItem.id;
}

/**
 * 更新选中的话题
 */
export function updateSelectedTopic(id: string, topic: IcebreakerTopic): boolean {
  const history = getTopicHistory();
  const item = history.find(h => h.id === id);

  if (item) {
    item.selectedTopic = topic;
    return safeSetLocalStorage(TOPIC_HISTORY_KEY, history);
  }

  return false;
}

/**
 * 删除话题记录
 */
export function deleteTopicHistory(id: string): boolean {
  const history = getTopicHistory();
  const filtered = history.filter(h => h.id !== id);
  return safeSetLocalStorage(TOPIC_HISTORY_KEY, filtered);
}

/**
 * 清空所有话题历史
 */
export function clearTopicHistory(): boolean {
  return safeSetLocalStorage(TOPIC_HISTORY_KEY, []);
}

// ============ 信心评分历史 ============

/**
 * 获取所有信心评分历史
 */
export function getConfidenceHistory(): ConfidenceHistoryItem[] {
  return safeGetLocalStorage<ConfidenceHistoryItem[]>(CONFIDENCE_HISTORY_KEY, []);
}

/**
 * 添加信心评分记录
 */
export function addConfidenceHistory(
  message: string,
  result: ConfidenceScoreResponse
): string {
  const history = getConfidenceHistory();

  const newItem: ConfidenceHistoryItem = {
    id: generateId(),
    timestamp: Date.now(),
    message,
    result
  };

  history.unshift(newItem);

  if (history.length > MAX_HISTORY_ITEMS) {
    history.splice(MAX_HISTORY_ITEMS);
  }

  safeSetLocalStorage(CONFIDENCE_HISTORY_KEY, history);
  return newItem.id;
}

/**
 * 删除信心评分记录
 */
export function deleteConfidenceHistory(id: string): boolean {
  const history = getConfidenceHistory();
  const filtered = history.filter(h => h.id !== id);
  return safeSetLocalStorage(CONFIDENCE_HISTORY_KEY, filtered);
}

/**
 * 清空所有信心评分历史
 */
export function clearConfidenceHistory(): boolean {
  return safeSetLocalStorage(CONFIDENCE_HISTORY_KEY, []);
}

// ============ 统计数据 ============

/**
 * 获取话题生成统计
 */
export function getTopicStats() {
  const history = getTopicHistory();

  return {
    totalGenerated: history.length,
    totalTopics: history.reduce((sum, item) => sum + item.topics.length, 0),
    selectedCount: history.filter(h => h.selectedTopic).length,
    styleBreakdown: {
      humorous: history.filter(h => h.style === 'humorous').length,
      sincere: history.filter(h => h.style === 'sincere').length,
      curious: history.filter(h => h.style === 'curious').length
    }
  };
}

/**
 * 获取信心评分统计
 */
export function getConfidenceStats() {
  const history = getConfidenceHistory();

  if (history.length === 0) {
    return {
      totalEvaluations: 0,
      averageScore: 0,
      highConfidenceCount: 0,
      lowConfidenceCount: 0
    };
  }

  const scores = history.map(h => h.result.finalScore);
  const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  return {
    totalEvaluations: history.length,
    averageScore,
    highConfidenceCount: history.filter(h => h.result.finalScore >= 70).length,
    lowConfidenceCount: history.filter(h => h.result.finalScore < 50).length
  };
}
