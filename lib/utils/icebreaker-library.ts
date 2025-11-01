/**
 * 破冰库 - LocalStorage管理
 */

export interface IcebreakerRecord {
  id: string;
  interests: string[];
  opener: string;
  category: string;
  emoji: string;
  success_rate: number;
  createdAt: number;
  status: 'pending' | 'success' | 'failed' | 'in_progress';
  notes?: string;
}

const STORAGE_KEY = 'icebreaker_library';

export const IcebreakerLibrary = {
  // 添加记录
  add: (record: Omit<IcebreakerRecord, 'id' | 'createdAt' | 'status'>): IcebreakerRecord => {
    const newRecord: IcebreakerRecord = {
      ...record,
      id: Date.now().toString(),
      createdAt: Date.now(),
      status: 'pending'
    };

    const records = IcebreakerLibrary.getAll();
    records.unshift(newRecord); // 最新的在前
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return newRecord;
  },

  // 获取所有记录
  getAll: (): IcebreakerRecord[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  // 更新记录状态
  updateStatus: (id: string, status: IcebreakerRecord['status'], notes?: string) => {
    const records = IcebreakerLibrary.getAll();
    const index = records.findIndex(r => r.id === id);
    if (index !== -1) {
      records[index].status = status;
      if (notes) records[index].notes = notes;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }
  },

  // 删除记录
  delete: (id: string) => {
    const records = IcebreakerLibrary.getAll();
    const filtered = records.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  // 获取统计数据
  getStats: () => {
    const records = IcebreakerLibrary.getAll();
    return {
      total: records.length,
      success: records.filter(r => r.status === 'success').length,
      in_progress: records.filter(r => r.status === 'in_progress').length,
      pending: records.filter(r => r.status === 'pending').length,
      failed: records.filter(r => r.status === 'failed').length
    };
  }
};
